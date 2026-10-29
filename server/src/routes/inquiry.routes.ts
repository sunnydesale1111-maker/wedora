import { Router } from 'express';
import { InquiryQuotationController } from '../controllers/inquiry-quotation.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', InquiryQuotationController.createInquiry);
router.get('/', InquiryQuotationController.getInquiries);
router.patch('/:id', InquiryQuotationController.updateInquiryStatus);

export default router;
