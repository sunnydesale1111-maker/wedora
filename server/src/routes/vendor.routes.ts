import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller.js';
import { authenticateToken, requireRoles } from '../middleware/auth.js';
import { Role } from '@prisma/client';

const router = Router();

// Public discovery
router.get('/', VendorController.getVendors);
router.post('/search', VendorController.search);
router.get('/:id', VendorController.getVendorById);
router.get('/:id/availability', VendorController.getAvailability);
router.post('/:id/check-availability', VendorController.checkAvailability);

// Authenticated vendor operations
router.get('/dashboard/me', authenticateToken, requireRoles(Role.VENDOR), VendorController.getDashboard);
router.patch('/:id', authenticateToken, requireRoles(Role.VENDOR), VendorController.updateVendor);
router.post('/services', authenticateToken, requireRoles(Role.VENDOR), VendorController.addVendorService);
router.put('/:id/availability', authenticateToken, requireRoles(Role.VENDOR), VendorController.setAvailability);

export default router;
