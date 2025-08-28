import { Router } from 'express';
import { TestimonialsController } from '../controllers/testimonialsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', TestimonialsController.getTestimonials);
router.post('/', TestimonialsController.createTestimonial); // Public submission

// Admin routes
router.put('/:id', authenticate, requireAdmin, TestimonialsController.updateTestimonial);
router.delete('/:id', authenticate, requireAdmin, TestimonialsController.deleteTestimonial);

export default router;
