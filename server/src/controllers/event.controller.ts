import { Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export class EventController {
  public static async createEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { eventName, eventType, eventDate, city, area, guestCount, estimatedBudget, description } = req.body;

      if (!eventName || !eventDate || !city || !guestCount) {
        res.status(400).json({ success: false, error: 'eventName, eventDate, city, and guestCount are required' });
        return;
      }

      const parsedDate = new Date(eventDate);

      const event = await prisma.event.create({
        data: {
          ownerUserId: req.user.id,
          eventName,
          eventType: eventType || 'Wedding',
          eventDate: parsedDate,
          city,
          area: area || city,
          guestCount: parseInt(guestCount, 10),
          estimatedBudget: estimatedBudget ? parseFloat(estimatedBudget) : null,
          description: description || null,
        },
      });

      // Default starter timeline tasks for convenience
      const defaultTasks = [
        { name: 'Confirm Venue & Date', daysBefore: 120 },
        { name: 'Book Catering Service', daysBefore: 90 },
        { name: 'Finalize Decoration Theme', daysBefore: 60 },
        { name: 'Confirm Lighting & Sound Setup', daysBefore: 45 },
        { name: 'Book Photography & Videography', daysBefore: 30 },
        { name: 'Final Vendor Coordination Meeting', daysBefore: 7 },
        { name: 'Wedding Day Execution', daysBefore: 0 },
      ];

      for (const t of defaultTasks) {
        const deadline = new Date(parsedDate.getTime() - t.daysBefore * 24 * 60 * 60 * 1000);
        await prisma.timelineTask.create({
          data: {
            eventId: event.id,
            taskName: t.name,
            deadline,
            status: 'PENDING',
          },
        });
      }

      res.status(201).json({ success: true, data: event });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const events = await prisma.event.findMany({
        where: { ownerUserId: req.user.id },
        include: {
          bookings: {
            include: {
              vendor: true,
              vendorService: { include: { category: true } },
              payments: true,
            },
          },
          inquiries: {
            include: {
              vendorService: { include: { vendor: true, category: true } },
            },
          },
          timelineTasks: true,
        },
        orderBy: { eventDate: 'asc' },
      });

      res.json({ success: true, data: events });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getEventById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          bookings: {
            include: {
              vendor: true,
              vendorService: { include: { category: true } },
              payments: true,
            },
          },
          inquiries: {
            include: {
              vendorService: { include: { vendor: true, category: true } },
              quotations: true,
            },
          },
          quotations: {
            include: {
              vendor: true,
              vendorService: { include: { category: true } },
            },
          },
          timelineTasks: {
            orderBy: { deadline: 'asc' },
          },
          payments: {
            include: {
              payer: { select: { id: true, name: true } },
              payee: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }

      // Role check: Only owner or assigned vendor can view
      if (event.ownerUserId !== req.user.id) {
        const isAssociatedVendor = event.bookings.some((b) => b.vendorId === req.user?.vendorId);
        if (!isAssociatedVendor) {
          res.status(403).json({ success: false, error: 'Access denied to this private event' });
          return;
        }
      }

      // Calculate total expenses and outstanding balances
      const totalBookedAmount = event.bookings.reduce((sum, b) => sum + b.agreedAmount, 0);
      const totalPaidAmount = event.payments
        .filter((p) => p.status === 'PAID')
        .reduce((sum, p) => sum + p.amount, 0);

      res.json({
        success: true,
        data: {
          ...event,
          financials: {
            estimatedBudget: event.estimatedBudget,
            totalBookedAmount,
            totalPaidAmount,
            outstandingBalance: Math.max(0, totalBookedAmount - totalPaidAmount),
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async updateEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await prisma.event.findUnique({ where: { id } });

      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }

      if (event.ownerUserId !== req.user?.id) {
        res.status(403).json({ success: false, error: 'Unauthorized to modify this event' });
        return;
      }

      const { eventName, eventType, eventDate, city, area, guestCount, estimatedBudget, description } = req.body;

      const updated = await prisma.event.update({
        where: { id },
        data: {
          eventName: eventName ?? event.eventName,
          eventType: eventType ?? event.eventType,
          eventDate: eventDate ? new Date(eventDate) : event.eventDate,
          city: city ?? event.city,
          area: area ?? event.area,
          guestCount: guestCount ? parseInt(guestCount, 10) : event.guestCount,
          estimatedBudget: estimatedBudget !== undefined ? parseFloat(estimatedBudget) : event.estimatedBudget,
          description: description ?? event.description,
        },
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // --- Event Profile Sharing & Participant Management ---

  public static async getParticipants(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          participants: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }

      res.json({ success: true, data: event.participants });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async inviteParticipant(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const { name, email, phone } = req.body;

      if (!name || (!email && !phone)) {
        res.status(400).json({ success: false, error: 'Name and email or phone are required' });
        return;
      }

      const event = await prisma.event.findUnique({ where: { id } });
      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }

      // Check authorization: Owner or Organizer
      const isOwner = event.ownerUserId === req.user.id;
      let isOrganizer = false;
      if (event.organizerClientId) {
        const client = await (prisma as any).organizerClientProfile.findUnique({
          where: { id: event.organizerClientId },
        });
        isOrganizer = client?.organizerUserId === req.user.id;
      }

      if (!isOwner && !isOrganizer && req.user.role !== 'PLANNER') {
        res.status(403).json({ success: false, error: 'Only event owners or organizers can invite participants' });
        return;
      }

      const participant = await (prisma as any).eventParticipant.create({
        data: {
          eventId: id,
          name: name.trim(),
          email: email ? email.trim().toLowerCase() : null,
          phone: phone ? phone.trim() : null,
          role: 'FAMILY_MEMBER',
          relationship: 'Invited Member',
          isPrimary: false,
          status: 'PENDING',
          canEdit: false,
        },
      });

      res.status(201).json({ success: true, data: participant });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async removeParticipant(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id, participantId } = req.params;
      const participant = await (prisma as any).eventParticipant.findUnique({
        where: { id: participantId },
      });

      if (!participant || participant.eventId !== id) {
        res.status(404).json({ success: false, error: 'Participant not found on this event' });
        return;
      }

      if (participant.isPrimary) {
        res.status(400).json({ success: false, error: 'Cannot remove required primary event participant' });
        return;
      }

      await (prisma as any).eventParticipant.delete({
        where: { id: participantId },
      });

      res.json({ success: true, message: 'Participant removed successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async acceptInvitation(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { id, participantId } = req.params;
      const participant = await (prisma as any).eventParticipant.findUnique({
        where: { id: participantId },
      });

      if (!participant || participant.eventId !== id) {
        res.status(404).json({ success: false, error: 'Participant not found' });
        return;
      }

      const updated = await (prisma as any).eventParticipant.update({
        where: { id: participantId },
        data: {
          status: 'ACCEPTED',
          userId: req.user.id,
          acceptedAt: new Date(),
        },
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
