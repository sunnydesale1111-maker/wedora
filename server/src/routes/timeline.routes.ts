import { Router } from 'express';
import { TimelineController } from '../controllers/timeline.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.post('/tasks', TimelineController.createTask);
router.patch('/tasks/:id', TimelineController.updateTask);
router.delete('/tasks/:id', TimelineController.deleteTask);

export default router;
