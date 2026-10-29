import { Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { BookingService } from '../services/booking.service.js';
import { BookingStatus } from '@prisma/client';

export class BookingController {
  public static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { quotationId } = req.body;
      if (!quotationId) {
        res.status(400).json({ success: false, error: 'quotationId is required' });
        return;
      }

      const booking = await BookingService.confirmBooking({
        quotationId,
        userId: req.user.id,
      });

      res.status(201).json({ success: true, data: booking });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public static async getBookings(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { eventId, status } = req.query;
      const where: any = {};

      if (status) {
        where.status = status as BookingStatus;
      }

      if (req.user.role === 'VENDOR') {
        if (!req.user.vendorId) {
          res.json({ success: true, data: [] });
          return;
        }
        where.vendorId = req.user.vendorId;
      } else {
        // Planner or Customer
        where.customerId = req.user.id;
        if (eventId) {
          where.eventId = String(eventId);
        }
      }

      const bookings = await prisma.booking.findMany({
        where,
        include: {
          event: true,
          vendor: true,
          vendorService: { include: { category: true } },
          quotation: true,
          payments: true,
        },
        orderBy: { eventDate: 'asc' },
      });

      res.json({ success: true, data: bookings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getBookingById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          event: true,
          vendor: true,
          vendorService: { include: { category: true } },
          quotation: true,
          payments: {
            orderBy: { createdAt: 'desc' },
          },
          timelineTasks: true,
        },
      });

      if (!booking) {
        res.status(404).json({ success: false, error: 'Booking not found' });
        return;
      }

      // Check permission: customer or vendor
      if (booking.customerId !== req.user?.id && booking.vendorId !== req.user?.vendorId) {
        res.status(403).json({ success: false, error: 'Unauthorized access to booking' });
        return;
      }

      const totalPaid = booking.payments
        .filter((p) => p.status === 'PAID')
        .reduce((sum, p) => sum + p.amount, 0);

      res.json({
        success: true,
        data: {
          ...booking,
          paymentSummary: {
            agreedAmount: booking.agreedAmount,
            totalPaid,
            remainingBalance: Math.max(0, booking.agreedAmount - totalPaid),
            isFullyPaid: totalPaid >= booking.agreedAmount,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async updateBookingStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(BookingStatus).includes(status)) {
        res.status(400).json({ success: false, error: `Invalid status. Valid values: ${Object.values(BookingStatus).join(', ')}` });
        return;
      }

      if (status === BookingStatus.COMPLETED) {
        const completed = await BookingService.completeBooking(id, req.user.id);
        res.json({ success: true, data: completed });
        return;
      }

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { event: true, vendor: true },
      });

      if (!booking) {
        res.status(404).json({ success: false, error: 'Booking not found' });
        return;
      }

      if (booking.customerId !== req.user.id && booking.vendor.userId !== req.user.id) {
        res.status(403).json({ success: false, error: 'Unauthorized to modify this booking' });
        return;
      }

      const updated = await prisma.booking.update({
        where: { id },
        data: { status: status as BookingStatus },
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
