import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Customer Family Profiles
router.get('/customer', authenticateToken, ProfileController.getCustomerProfiles);
router.post('/customer', authenticateToken, ProfileController.createFamilyProfile);
router.put('/customer/:id', authenticateToken, ProfileController.updateFamilyProfile);
router.delete('/customer/:id', authenticateToken, ProfileController.deleteFamilyProfile);

// Organizer Client Profiles
router.get('/organizer/clients', authenticateToken, ProfileController.getOrganizerClients);
router.post('/organizer/clients', authenticateToken, ProfileController.createOrganizerClient);
router.put('/organizer/clients/:id', authenticateToken, ProfileController.updateOrganizerClient);
router.post('/organizer/clients/:id/archive', authenticateToken, ProfileController.archiveOrganizerClient);

export default router;
