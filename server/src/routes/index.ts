import { Router } from 'express';
import authRoutes from './auth.routes.js';
import vendorRoutes from './vendor.routes.js';
import eventRoutes from './event.routes.js';
import inquiryRoutes from './inquiry.routes.js';
import quotationRoutes from './quotation.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';
import timelineRoutes from './timeline.routes.js';
import aiRoutes from './ai.routes.js';
import categoryRoutes from './category.routes.js';
import { TimelineController } from '../controllers/timeline.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/vendors', vendorRoutes);
apiRouter.use('/events', eventRoutes);
apiRouter.use('/inquiries', inquiryRoutes);
apiRouter.use('/quotations', quotationRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/timeline', timelineRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/categories', categoryRoutes);

// Direct mapping for GET /api/events/:id/timeline as specified in Section 15
apiRouter.get('/events/:id/timeline', authenticateToken, TimelineController.getTasksByEvent);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AI Wedding Timeline Orchestrator Backend',
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
