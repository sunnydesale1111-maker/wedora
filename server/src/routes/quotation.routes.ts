import { Router } from 'express';
import { InquiryQuotationController } from '../controllers/inquiry-quotation.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', InquiryQuotationController.createQuotation);
router.get('/:id', InquiryQuotationController.getQuotationById);
router.patch('/:id/respond', InquiryQuotationController.respondToQuotation);

export default router;
