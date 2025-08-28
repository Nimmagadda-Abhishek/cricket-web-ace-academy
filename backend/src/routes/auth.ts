import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate, requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// Authentication routes
router.post('/login', AuthController.login);
router.get('/profile', authenticate, AuthController.getProfile);
router.post('/change-password', authenticate, AuthController.changePassword);
router.post('/create-admin', authenticate, requireSuperAdmin, AuthController.createAdmin);

export default router;
