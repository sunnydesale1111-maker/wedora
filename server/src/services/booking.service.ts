import prisma from '../config/prisma.js';
import { BookingStatus, AvailabilityStatus, QuotationStatus } from '@prisma/client';

export interface ConfirmBookingInput {
  quotationId: string;
  userId: string;
}

export class BookingService {
  /**
   * Confirms a booking from an accepted quotation with double-booking prevention
   */
  public static async confirmBooking(input: ConfirmBookingInput) {
    const { quotationId, userId } = input;

    // 1. Fetch quotation with inquiry, event, vendor, and vendorService
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        event: true,
        inquiry: true,
        vendor: true,
        vendorService: {
          include: { vendor: true, category: true },
        },
      },
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    if (quotation.event.ownerUserId !== userId) {
      throw new Error('Unauthorized: Only the event owner can confirm this booking');
    }

    if (quotation.status !== QuotationStatus.ACCEPTED) {
      throw new Error(`Quotation must be ACCEPTED by customer before booking confirmation. Current status: ${quotation.status}`);
    }

    const eventDate = quotation.event.eventDate;
    const startOfDay = new Date(eventDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(eventDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // 2. Double-booking check: count active confirmed bookings on this date for this vendor service
    const activeBookingsCount = await prisma.booking.count({
      where: {
        vendorServiceId: quotation.vendorServiceId,
        eventDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS],
        },
      },
    });

    const maxCapacity = quotation.vendorService.maximumSimultaneousBookings || 1;
    if (activeBookingsCount >= maxCapacity) {
      throw new Error(
        `Capacity Exceeded: This vendor has reached maximum simultaneous bookings (${maxCapacity}) on ${eventDate.toISOString().split('T')[0]}`
      );
    }

    // 3. Check vendor_availability table entry
    const availabilityEntry = await prisma.vendorAvailability.findFirst({
      where: {
        vendorServiceId: quotation.vendorServiceId,
        availabilityDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (availabilityEntry && availabilityEntry.status === AvailabilityStatus.FULLY_BOOKED) {
      throw new Error('Vendor calendar is marked FULLY_BOOKED for this date');
    }

    // 4. Create booking and update availability inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      const agreedAmount = quotation.quotedAmount + quotation.additionalCharges;

      const booking = await tx.booking.create({
        data: {
          eventId: quotation.eventId,
          quotationId: quotation.id,
          vendorId: quotation.vendorId,
          vendorServiceId: quotation.vendorServiceId,
          customerId: userId,
          status: BookingStatus.CONFIRMED,
          agreedAmount,
          eventDate,
        },
        include: {
          event: true,
          vendor: true,
          vendorService: { include: { category: true } },
        },
      });

      // Update remaining capacity in calendar
      const newActiveCount = activeBookingsCount + 1;
      const remainingCapacity = Math.max(0, maxCapacity - newActiveCount);
      const newStatus = remainingCapacity === 0 ? AvailabilityStatus.FULLY_BOOKED : AvailabilityStatus.AVAILABLE;

      if (availabilityEntry) {
        await tx.vendorAvailability.update({
          where: { id: availabilityEntry.id },
          data: {
            availableCapacity: remainingCapacity,
            status: newStatus,
          },
        });
      } else {
        await tx.vendorAvailability.create({
          data: {
            vendorServiceId: quotation.vendorServiceId,
            availabilityDate: startOfDay,
            availableCapacity: remainingCapacity,
            status: newStatus,
          },
        });
      }

      // Automatically create a linked timeline task for this booking
      await tx.timelineTask.create({
        data: {
          eventId: quotation.eventId,
          taskName: `Coordinate with ${quotation.vendor.businessName} (${quotation.vendorService.category.categoryName})`,
          deadline: new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days before
          relatedBookingId: booking.id,
          status: 'PENDING',
        },
      });

      return booking;
    });

    return result;
  }

  /**
   * Mark booking completed (which enables it for 90-day vendor performance calculation)
   */
  public static async completeBooking(bookingId: string, authorizedUserId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { event: true, vendor: true },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.customerId !== authorizedUserId && booking.vendor.userId !== authorizedUserId) {
      throw new Error('Unauthorized to modify this booking');
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        updatedAt: new Date(),
      },
    });

    return updated;
  }
}
