import { Router } from 'express';
import { EventController } from '../controllers/event.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/', EventController.createEvent);
router.get('/', EventController.getEvents);
router.get('/:id', EventController.getEventById);
router.patch('/:id', EventController.updateEvent);

// Event Profile Sharing & Participant Management
router.get('/:id/participants', EventController.getParticipants);
router.post('/:id/participants/invite', EventController.inviteParticipant);
router.delete('/:id/participants/:participantId', EventController.removeParticipant);
router.post('/:id/participants/:participantId/accept', EventController.acceptInvitation);

export default router;
