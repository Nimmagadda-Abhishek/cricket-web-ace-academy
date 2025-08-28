import { Router } from 'express';
import { UploadController } from '../controllers/uploadController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { uploadImage, uploadImages } from '../middleware/upload.js';

const router = Router();

// Upload routes (admin only)
router.post('/image', authenticate, requireAdmin, uploadImage.single('image'), UploadController.uploadImage);
router.post('/images', authenticate, requireAdmin, uploadImages.array('images', 10), UploadController.uploadImages);

// File management routes (admin only)
router.get('/files', authenticate, requireAdmin, UploadController.listFiles);
router.get('/files/:filename', UploadController.getFileInfo);
router.delete('/files/:filename', authenticate, requireAdmin, UploadController.deleteFile);

export default router;
