import prisma from '../config/prisma.js';
import { PaymentStatus, PaymentType } from '@prisma/client';
import crypto from 'crypto';

export interface SimulatePaymentInput {
  bookingId?: string;
  eventId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  paymentType: PaymentType;
  paymentPurpose: string;
  idempotencyKey?: string;
}

export class PaymentService {
  /**
   * Records a simulated payment transaction with financial validation and balance calculation
   */
  public static async simulatePayment(input: SimulatePaymentInput) {
    const { bookingId, eventId, payerId, payeeId, amount, paymentType, paymentPurpose, idempotencyKey } = input;

    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }

    // 1. Verify Event exists and payer is authorized
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    let booking: any = null;

    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { payments: true, vendor: true },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Authorization check
      if (booking.customerId !== payerId && event.ownerUserId !== payerId) {
        throw new Error('Unauthorized: Only the event owner or booking customer can pay');
      }

      // Check outstanding balance
      const existingPaidTotal = booking.payments
        .filter((p: any) => p.status === PaymentStatus.PAID)
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      const outstandingBalance = booking.agreedAmount - existingPaidTotal;

      if (amount > outstandingBalance) {
        throw new Error(
          `Payment amount (₹${amount}) exceeds outstanding booking balance (₹${outstandingBalance}). Maximum allowed: ₹${outstandingBalance}`
        );
      }
    }

    // 2. Prevent duplicate payment requests (Idempotency check)
    const transactionRef = idempotencyKey || `SIM-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const existingPayment = await prisma.payment.findUnique({
      where: { transactionRef },
    });

    if (existingPayment) {
      return {
        payment: existingPayment,
        isDuplicate: true,
        message: 'Transaction already processed (idempotency key matched).',
      };
    }

    // 3. Record simulated payment in database
    const payment = await prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          bookingId: bookingId || null,
          eventId,
          payerId,
          payeeId,
          amount,
          paymentType,
          status: PaymentStatus.PAID,
          paymentPurpose: paymentPurpose || 'Vendor Service Payment (Simulated)',
          isSimulated: true,
          transactionRef,
        },
        include: {
          payer: { select: { id: true, name: true, email: true } },
          payee: { select: { id: true, name: true, email: true } },
          booking: true,
        },
      });

      return created;
    });

    // 4. Calculate total event and booking balances
    const allBookingPayments = bookingId
      ? await prisma.payment.findMany({
          where: { bookingId, status: PaymentStatus.PAID },
        })
      : [];

    const totalPaidOnBooking = allBookingPayments.reduce((sum, p) => sum + p.amount, 0);
    const bookingAgreedAmount = booking ? booking.agreedAmount : 0;
    const isFullyPaid = booking ? totalPaidOnBooking >= bookingAgreedAmount : false;

    return {
      payment,
      simulationNotice: 'SIMULATION — NO REAL MONEY CHARGED. Test transaction successfully logged.',
      financialSummary: {
        amountPaid: amount,
        totalPaidOnBooking,
        bookingAgreedAmount,
        outstandingBalance: Math.max(0, bookingAgreedAmount - totalPaidOnBooking),
        isFullyPaid,
      },
    };
  }

  /**
   * Get payments for a specific user, vendor, or event
   */
  public static async getPayments(filters: {
    userId?: string;
    vendorId?: string;
    eventId?: string;
    bookingId?: string;
  }) {
    const where: any = {};

    if (filters.eventId) where.eventId = filters.eventId;
    if (filters.bookingId) where.bookingId = filters.bookingId;

    if (filters.userId) {
      where.OR = [
        { payerId: filters.userId },
        { payeeId: filters.userId },
      ];
    }

    if (filters.vendorId) {
      const vendor = await prisma.vendor.findUnique({
        where: { id: filters.vendorId },
        select: { userId: true },
      });
      if (vendor) {
        where.payeeId = vendor.userId;
      }
    }

    return await prisma.payment.findMany({
      where,
      include: {
        payer: { select: { id: true, name: true, email: true, role: true } },
        payee: { select: { id: true, name: true, email: true, role: true } },
        booking: {
          include: {
            vendorService: { include: { category: true } },
            vendor: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
