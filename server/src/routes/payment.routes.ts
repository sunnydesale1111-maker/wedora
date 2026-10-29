import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/simulate', PaymentController.simulatePayment);
router.get('/', PaymentController.getPayments);

export default router;
