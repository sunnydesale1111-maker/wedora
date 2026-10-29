import { Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { InquiryStatus, QuotationStatus } from '@prisma/client';

export class InquiryQuotationController {
  // --- INQUIRIES ---

  public static async createInquiry(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { eventId, vendorServiceId, requirements, guestCount, budget } = req.body;

      if (!eventId || !vendorServiceId || !requirements) {
        res.status(400).json({ success: false, error: 'eventId, vendorServiceId, and requirements are required' });
        return;
      }

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }

      if (event.ownerUserId !== req.user.id) {
        res.status(403).json({ success: false, error: 'Unauthorized: You do not own this event' });
        return;
      }

      const inquiry = await prisma.inquiry.create({
        data: {
          eventId,
          vendorServiceId,
          requesterId: req.user.id,
          status: InquiryStatus.PENDING,
          requirements,
          guestCount: guestCount ? parseInt(guestCount, 10) : event.guestCount,
          eventDate: event.eventDate,
          budget: budget ? parseFloat(budget) : event.estimatedBudget,
        },
        include: {
          event: true,
          vendorService: {
            include: { vendor: true, category: true },
          },
        },
      });

      res.status(201).json({ success: true, data: inquiry });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getInquiries(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { eventId, status } = req.query;
      const where: any = {};

      if (status) {
        where.status = status as InquiryStatus;
      }

      if (req.user.role === 'VENDOR') {
        if (!req.user.vendorId) {
          res.json({ success: true, data: [] });
          return;
        }
        where.vendorService = { vendorId: req.user.vendorId };
      } else {
        // Planner or Customer: show their inquiries
        where.requesterId = req.user.id;
        if (eventId) {
          where.eventId = String(eventId);
        }
      }

      const inquiries = await prisma.inquiry.findMany({
        where,
        include: {
          event: true,
          requester: { select: { id: true, name: true, email: true, phone: true } },
          vendorService: {
            include: { vendor: true, category: true },
          },
          quotations: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({ success: true, data: inquiries });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async updateInquiryStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const inquiry = await prisma.inquiry.findUnique({
        where: { id },
        include: { vendorService: true },
      });

      if (!inquiry) {
        res.status(404).json({ success: false, error: 'Inquiry not found' });
        return;
      }

      // Check authorization
      const isVendor = req.user?.vendorId === inquiry.vendorService.vendorId;
      const isRequester = req.user?.id === inquiry.requesterId;

      if (!isVendor && !isRequester) {
        res.status(403).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const updated = await prisma.inquiry.update({
        where: { id },
        data: { status: status as InquiryStatus },
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // --- QUOTATIONS ---

  public static async createQuotation(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'VENDOR' || !req.user.vendorId) {
        res.status(403).json({ success: false, error: 'Only vendors can submit quotations' });
        return;
      }

      const { inquiryId, quotedAmount, serviceScope, includedServices, additionalCharges, validDays, paymentTerms } = req.body;

      if (!inquiryId || quotedAmount === undefined || !serviceScope) {
        res.status(400).json({ success: false, error: 'inquiryId, quotedAmount, and serviceScope are required' });
        return;
      }

      const inquiry = await prisma.inquiry.findUnique({
        where: { id: inquiryId },
        include: { vendorService: true, event: true },
      });

      if (!inquiry) {
        res.status(404).json({ success: false, error: 'Inquiry not found' });
        return;
      }

      if (inquiry.vendorService.vendorId !== req.user.vendorId) {
        res.status(403).json({ success: false, error: 'Unauthorized: This inquiry belongs to another vendor' });
        return;
      }

      const days = validDays ? parseInt(validDays, 10) : 14;
      const validUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const quotation = await prisma.$transaction(async (tx) => {
        const q = await tx.quotation.create({
          data: {
            inquiryId,
            eventId: inquiry.eventId,
            vendorId: req.user!.vendorId!,
            vendorServiceId: inquiry.vendorServiceId,
            quotedAmount: parseFloat(quotedAmount),
            serviceScope,
            includedServices: includedServices || null,
            additionalCharges: additionalCharges ? parseFloat(additionalCharges) : 0,
            validUntil,
            paymentTerms: paymentTerms || '50% advance upon booking, 50% on event completion',
            status: QuotationStatus.SENT,
          },
          include: {
            vendor: true,
            vendorService: { include: { category: true } },
            event: true,
          },
        });

        await tx.inquiry.update({
          where: { id: inquiryId },
          data: { status: InquiryStatus.QUOTED },
        });

        return q;
      });

      res.status(201).json({ success: true, data: quotation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getQuotationById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const quotation = await prisma.quotation.findUnique({
        where: { id },
        include: {
          vendor: true,
          vendorService: { include: { category: true } },
          event: true,
          inquiry: true,
        },
      });

      if (!quotation) {
        res.status(404).json({ success: false, error: 'Quotation not found' });
        return;
      }

      // Check permission: event owner or quoting vendor
      if (quotation.event.ownerUserId !== req.user?.id && quotation.vendorId !== req.user?.vendorId) {
        res.status(403).json({ success: false, error: 'Unauthorized access to quotation' });
        return;
      }

      res.json({ success: true, data: quotation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async respondToQuotation(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { action } = req.body; // 'ACCEPT' or 'REJECT'

      if (!action || !['ACCEPT', 'REJECT'].includes(action)) {
        res.status(400).json({ success: false, error: "Action must be 'ACCEPT' or 'REJECT'" });
        return;
      }

      const quotation = await prisma.quotation.findUnique({
        where: { id },
        include: { event: true },
      });

      if (!quotation) {
        res.status(404).json({ success: false, error: 'Quotation not found' });
        return;
      }

      if (quotation.event.ownerUserId !== req.user?.id) {
        res.status(403).json({ success: false, error: 'Only the event owner can accept or reject a quotation' });
        return;
      }

      const newStatus = action === 'ACCEPT' ? QuotationStatus.ACCEPTED : QuotationStatus.REJECTED;

      const updated = await prisma.quotation.update({
        where: { id },
        data: { status: newStatus },
        include: {
          vendor: true,
          vendorService: { include: { category: true } },
          event: true,
        },
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
