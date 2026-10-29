import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { VendorMetricsService } from '../services/vendor-metrics.service.js';
import { VendorSearchService } from '../services/vendor-search.service.js';
import { AvailabilityStatus, BookingStatus, QuotationStatus } from '@prisma/client';

export class VendorController {
  public static async getVendors(req: Request, res: Response): Promise<void> {
    try {
      const { city, category } = req.query;

      const where: any = {
        verificationStatus: 'VERIFIED',
      };

      if (city) {
        where.primaryCity = { equals: String(city), mode: 'insensitive' };
      }

      if (category) {
        where.services = {
          some: {
            category: {
              slug: { equals: String(category).toLowerCase(), mode: 'insensitive' },
            },
          },
        };
      }

      const vendors = await prisma.vendor.findMany({
        where,
        include: {
          services: { include: { category: true } },
          serviceAreas: true,
        },
      });

      const vendorIds = vendors.map((v) => v.id);
      const metricsMap = await VendorMetricsService.calculateBatchMetrics(vendorIds);

      const enriched = vendors.map((v) => ({
        ...v,
        metrics: metricsMap.get(v.id),
      }));

      res.json({ success: true, data: enriched });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getVendorById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const vendor = await prisma.vendor.findUnique({
        where: { id },
        include: {
          services: {
            include: {
              category: true,
              availability: {
                where: {
                  availabilityDate: { gte: new Date() },
                },
                take: 60,
                orderBy: { availabilityDate: 'asc' },
              },
            },
          },
          serviceAreas: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      });

      if (!vendor) {
        res.status(404).json({ success: false, error: 'Vendor not found' });
        return;
      }

      const metrics = await VendorMetricsService.calculateMetrics(vendor.id);

      res.json({
        success: true,
        data: {
          ...vendor,
          metrics,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async updateVendor(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { businessName, businessDescription, primaryCity, contactPerson, businessAddress, serviceAreas } = req.body;

      const vendor = await prisma.vendor.findUnique({ where: { id } });
      if (!vendor) {
        res.status(404).json({ success: false, error: 'Vendor not found' });
        return;
      }

      if (req.user?.role !== 'VENDOR' || req.user.vendorId !== id) {
        res.status(403).json({ success: false, error: 'Unauthorized to edit this vendor profile' });
        return;
      }

      const updated = await prisma.$transaction(async (tx) => {
        const v = await tx.vendor.update({
          where: { id },
          data: {
            businessName: businessName ?? vendor.businessName,
            businessDescription: businessDescription ?? vendor.businessDescription,
            primaryCity: primaryCity ?? vendor.primaryCity,
            contactPerson: contactPerson ?? vendor.contactPerson,
            businessAddress: businessAddress ?? vendor.businessAddress,
          },
        });

        if (serviceAreas && Array.isArray(serviceAreas)) {
          await tx.vendorServiceArea.deleteMany({ where: { vendorId: id } });
          for (const sa of serviceAreas) {
            await tx.vendorServiceArea.create({
              data: {
                vendorId: id,
                city: sa.city || v.primaryCity,
                area: sa.area || sa,
              },
            });
          }
        }

        return v;
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async addVendorService(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { categoryId, serviceDescription, maximumGuestCapacity, maximumSimultaneousBookings, startingPrice } = req.body;

      if (!req.user?.vendorId) {
        res.status(400).json({ success: false, error: 'User does not have an associated vendor profile' });
        return;
      }

      const service = await prisma.vendorService.create({
        data: {
          vendorId: req.user.vendorId,
          categoryId,
          serviceDescription: serviceDescription || '',
          maximumGuestCapacity: maximumGuestCapacity || null,
          maximumSimultaneousBookings: maximumSimultaneousBookings || 1,
          startingPrice: startingPrice || null,
        },
        include: { category: true },
      });

      res.status(201).json({ success: true, data: service });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { startDate, endDate, serviceId } = req.query;

      const where: any = {
        vendorService: { vendorId: id },
      };

      if (serviceId) {
        where.vendorServiceId = String(serviceId);
      }

      if (startDate || endDate) {
        where.availabilityDate = {};
        if (startDate) where.availabilityDate.gte = new Date(String(startDate));
        if (endDate) where.availabilityDate.lte = new Date(String(endDate));
      }

      const entries = await prisma.vendorAvailability.findMany({
        where,
        include: {
          vendorService: { include: { category: true } },
        },
        orderBy: { availabilityDate: 'asc' },
      });

      res.json({ success: true, data: entries });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async setAvailability(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { vendorServiceId, date, status, availableCapacity } = req.body;

      if (req.user?.role !== 'VENDOR' || req.user.vendorId !== id) {
        res.status(403).json({ success: false, error: 'Unauthorized to update this calendar' });
        return;
      }

      const parsedDate = new Date(date);
      parsedDate.setUTCHours(0, 0, 0, 0);

      const entry = await prisma.vendorAvailability.upsert({
        where: {
          vendorServiceId_availabilityDate: {
            vendorServiceId,
            availabilityDate: parsedDate,
          },
        },
        update: {
          status: status as AvailabilityStatus,
          availableCapacity: availableCapacity !== undefined ? availableCapacity : 1,
        },
        create: {
          vendorServiceId,
          availabilityDate: parsedDate,
          status: (status as AvailabilityStatus) || AvailabilityStatus.AVAILABLE,
          availableCapacity: availableCapacity !== undefined ? availableCapacity : 1,
        },
      });

      res.json({ success: true, data: entry });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async checkAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { serviceId, date, guestCount } = req.body;

      if (!date || !serviceId) {
        res.status(400).json({ success: false, error: 'serviceId and date are required' });
        return;
      }

      const service = await prisma.vendorService.findUnique({
        where: { id: serviceId },
        include: { vendor: true },
      });

      if (!service || service.vendorId !== id) {
        res.status(404).json({ success: false, error: 'Vendor service not found' });
        return;
      }

      const parsedDate = new Date(date);
      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const cal = await prisma.vendorAvailability.findFirst({
        where: {
          vendorServiceId: serviceId,
          availabilityDate: { gte: startOfDay, lte: endOfDay },
        },
      });

      const confirmedBookings = await prisma.booking.count({
        where: {
          vendorServiceId: serviceId,
          eventDate: { gte: startOfDay, lte: endOfDay },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
        },
      });

      const maxCap = service.maximumSimultaneousBookings || 1;
      const remainingSlots = Math.max(0, maxCap - confirmedBookings);
      const isCalendarBlocked = cal && (cal.status === AvailabilityStatus.FULLY_BOOKED || cal.status === AvailabilityStatus.UNAVAILABLE);

      const guestCapacitySufficient = !guestCount || !service.maximumGuestCapacity || service.maximumGuestCapacity >= guestCount;

      const isAvailable = remainingSlots > 0 && !isCalendarBlocked && guestCapacitySufficient;

      res.json({
        success: true,
        data: {
          isAvailable,
          remainingSlots,
          maxCapacity: maxCap,
          guestCapacitySufficient,
          calendarStatus: cal ? cal.status : 'AVAILABLE',
          serviceGuestLimit: service.maximumGuestCapacity,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async search(req: Request, res: Response): Promise<void> {
    try {
      const { category, city, areas, date, guestCount, maxBudget, sortBy } = req.body;

      const result = await VendorSearchService.searchVendors({
        category,
        city,
        areas: Array.isArray(areas) ? areas : areas ? [areas] : undefined,
        date,
        guestCount: guestCount ? parseInt(guestCount, 10) : undefined,
        maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
        sortBy,
      });

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) {
        res.status(403).json({ success: false, error: 'Vendor profile not found for user' });
        return;
      }

      const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId },
        include: {
          services: { include: { category: true } },
          serviceAreas: true,
        },
      });

      if (!vendor) {
        res.status(404).json({ success: false, error: 'Vendor not found' });
        return;
      }

      // Total inquiries
      const totalInquiries = await prisma.inquiry.count({
        where: { vendorService: { vendorId } },
      });

      // Pending quotations
      const pendingQuotations = await prisma.quotation.count({
        where: {
          vendorId,
          status: { in: [QuotationStatus.SENT, QuotationStatus.UNDER_REVIEW] },
        },
      });

      // Confirmed bookings
      const confirmedBookings = await prisma.booking.count({
        where: {
          vendorId,
          status: BookingStatus.CONFIRMED,
        },
      });

      // Upcoming events
      const upcomingEvents = await prisma.booking.findMany({
        where: {
          vendorId,
          eventDate: { gte: new Date() },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] },
        },
        include: {
          event: true,
          vendorService: { include: { category: true } },
          customer: { select: { id: true, name: true, phone: true, email: true } },
        },
        orderBy: { eventDate: 'asc' },
        take: 10,
      });

      // 90-day performance metrics
      const metrics = await VendorMetricsService.calculateMetrics(vendorId);

      // Simulated payment records
      const payments = await prisma.payment.findMany({
        where: { payeeId: vendor.userId },
        include: {
          payer: { select: { id: true, name: true, email: true } },
          booking: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      res.json({
        success: true,
        data: {
          vendor,
          stats: {
            totalInquiries,
            pendingQuotations,
            confirmedBookings,
            metrics,
          },
          upcomingEvents,
          payments,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
