import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', BookingController.createBooking);
router.get('/', BookingController.getBookings);
router.get('/:id', BookingController.getBookingById);
router.patch('/:id/status', BookingController.updateBookingStatus);

export default router;
