import { Router } from 'express';
import { BookingsController } from '../controllers/bookingsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/', BookingsController.createBooking); // Public booking
router.get('/available-slots', BookingsController.getAvailableSlots);
router.patch('/:id/cancel', BookingsController.cancelBooking); // Public cancellation

// Admin routes
router.get('/', authenticate, requireAdmin, BookingsController.getBookings);
router.get('/:id', authenticate, requireAdmin, BookingsController.getBooking);
router.put('/:id', authenticate, requireAdmin, BookingsController.updateBooking);

export default router;
