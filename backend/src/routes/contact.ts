import { Router } from 'express';
import { ContactController } from '../controllers/contactController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/', ContactController.createMessage);

// Admin routes
router.get('/', authenticate, requireAdmin, ContactController.getMessages);
router.get('/stats', authenticate, requireAdmin, ContactController.getStats);
router.get('/:id', authenticate, requireAdmin, ContactController.getMessage);
router.patch('/:id/reply', authenticate, requireAdmin, ContactController.markAsReplied);
router.delete('/:id', authenticate, requireAdmin, ContactController.deleteMessage);

export default router;
