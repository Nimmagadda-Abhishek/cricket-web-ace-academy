import { Router } from 'express';
import { ProgramsController } from '../controllers/programsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', ProgramsController.getPrograms);
router.get('/:id', ProgramsController.getProgram);

// Admin routes
router.post('/', authenticate, requireAdmin, ProgramsController.createProgram);
router.put('/:id', authenticate, requireAdmin, ProgramsController.updateProgram);
router.delete('/:id', authenticate, requireAdmin, ProgramsController.deleteProgram);

export default router;
