import { Router } from 'express';
import { EventController } from '../controllers/event.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', EventController.createEvent);
router.get('/', EventController.getEvents);
router.get('/:id', EventController.getEventById);
router.patch('/:id', EventController.updateEvent);

export default router;
