import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import * as adminController from '../controllers/adminController';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('admin', 'super-admin'));

// Admin dashboard routes
router.get('/dashboard', adminController.getDashboardStats);

// Testimonials routes
router.route('/testimonials')
  .get(adminController.getAllTestimonials)
  .post(adminController.createTestimonial);

router.route('/testimonials/:id')
  .get(adminController.getTestimonialById)
  .patch(adminController.updateTestimonial)
  .delete(adminController.deleteTestimonial);

// Facilities routes
router.route('/facilities')
  .get(adminController.getAllFacilities)
  .post(adminController.createFacility);

router.route('/facilities/:id')
  .get(adminController.getFacilityById)
  .patch(adminController.updateFacility)
  .delete(adminController.deleteFacility);

// Gallery routes
router.route('/gallery')
  .get(adminController.getAllGalleryImages)
  .post(adminController.createGalleryImage);

router.route('/gallery/:id')
  .get(adminController.getGalleryImageById)
  .patch(adminController.updateGalleryImage)
  .delete(adminController.deleteGalleryImage);

export default router;