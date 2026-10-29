import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public configuration status check
router.get('/status', AIController.getStatus);

router.use(authenticateToken);

router.post('/chat', AIController.chat);
router.get('/conversations', AIController.listConversations);
router.get('/conversations/:id', AIController.getConversation);

export default router;
