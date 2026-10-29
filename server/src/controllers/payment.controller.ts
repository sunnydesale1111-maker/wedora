import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { PaymentService } from '../services/payment.service.js';
import { PaymentType } from '@prisma/client';

export class PaymentController {
  public static async simulatePayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { bookingId, eventId, payeeId, amount, paymentType, paymentPurpose, idempotencyKey } = req.body;

      if (!eventId || !payeeId || amount === undefined) {
        res.status(400).json({ success: false, error: 'eventId, payeeId, and amount are required' });
        return;
      }

      const result = await PaymentService.simulatePayment({
        bookingId,
        eventId,
        payerId: req.user.id,
        payeeId,
        amount: parseFloat(amount),
        paymentType: (paymentType as PaymentType) || (req.user.role === 'PLANNER' ? PaymentType.PLANNER_TO_VENDOR : PaymentType.CUSTOMER_TO_VENDOR),
        paymentPurpose: paymentPurpose || 'Vendor Advance / Service Payment (Simulated)',
        idempotencyKey,
      });

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  public static async getPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { eventId, bookingId } = req.query;

      const payments = await PaymentService.getPayments({
        userId: req.user.id,
        vendorId: req.user.vendorId,
        eventId: eventId ? String(eventId) : undefined,
        bookingId: bookingId ? String(bookingId) : undefined,
      });

      res.json({ success: true, data: payments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
