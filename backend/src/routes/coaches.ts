import { Router } from 'express';
import { CoachesController } from '../controllers/coachesController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', CoachesController.getCoaches);
router.get('/:id', CoachesController.getCoach);

// Admin routes
router.post('/', authenticate, requireAdmin, CoachesController.createCoach);
router.put('/:id', authenticate, requireAdmin, CoachesController.updateCoach);
router.delete('/:id', authenticate, requireAdmin, CoachesController.deleteCoach);

export default router;
