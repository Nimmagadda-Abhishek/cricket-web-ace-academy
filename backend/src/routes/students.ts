import { Router } from 'express';
import { StudentsController } from '../controllers/studentsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/', StudentsController.createStudent); // Public registration

// Admin routes
router.get('/', authenticate, requireAdmin, StudentsController.getStudents);
router.get('/:id', authenticate, requireAdmin, StudentsController.getStudent);
router.put('/:id', authenticate, requireAdmin, StudentsController.updateStudent);
router.delete('/:id', authenticate, requireAdmin, StudentsController.deleteStudent);

export default router;
