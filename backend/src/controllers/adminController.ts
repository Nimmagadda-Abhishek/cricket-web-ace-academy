import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.VITE_DB_HOST || 'localhost',
  user: process.env.VITE_DB_USER || 'root',
  password: process.env.VITE_DB_PASSWORD || '',
  database: process.env.VITE_DB_NAME || 'cricket_academy',
  port: parseInt(process.env.VITE_DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Dashboard stats
export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [testimonialResult] = await pool.query('SELECT COUNT(*) as count FROM testimonials');
    const [facilityResult] = await pool.query('SELECT COUNT(*) as count FROM facilities');
    const [galleryResult] = await pool.query('SELECT COUNT(*) as count FROM gallery');

    const testimonialCount = (testimonialResult as any)[0]?.count || 0;
    const facilityCount = (facilityResult as any)[0]?.count || 0;
    const galleryCount = (galleryResult as any)[0]?.count || 0;

    res.status(200).json({
      status: 'success',
      data: {
        testimonials: testimonialCount,
        facilities: facilityCount,
        gallery: galleryCount
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return next(new AppError('Error fetching dashboard statistics', 500));
  }
});

// Testimonials
export const getAllTestimonials = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');

    res.status(200).json({
      status: 'success',
      results: (testimonials as any[]).length,
      data: {
        testimonials
      }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return next(new AppError('Error fetching testimonials', 500));
  }
});

export const getTestimonialById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [testimonials] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    const testimonial = (testimonials as any[])[0];

    if (!testimonial) {
      return next(new AppError('No testimonial found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        testimonial
      }
    });
  } catch (error) {
    console.error(`Error fetching testimonial with ID ${req.params.id}:`, error);
    return next(new AppError('Error fetching testimonial', 500));
  }
});

export const createTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, role, content, rating, image_url, is_featured } = req.body;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await pool.query(
      'INSERT INTO testimonials (name, role, content, rating, image_url, is_featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, role, content, rating, image_url, is_featured ? 1 : 0, now, now]
    );

    const insertId = (result as any).insertId;
    const [testimonials] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [insertId]);
    const newTestimonial = (testimonials as any[])[0];

    res.status(201).json({
      status: 'success',
      data: {
        testimonial: newTestimonial
      }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return next(new AppError('Error creating testimonial', 500));
  }
});

export const updateTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, role, content, rating, image_url, is_featured } = req.body;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // First check if testimonial exists
    const [existingTestimonials] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if ((existingTestimonials as any[]).length === 0) {
      return next(new AppError('No testimonial found with that ID', 404));
    }

    await pool.query(
      'UPDATE testimonials SET name = ?, role = ?, content = ?, rating = ?, image_url = ?, is_featured = ?, updated_at = ? WHERE id = ?',
      [name, role, content, rating, image_url, is_featured ? 1 : 0, now, req.params.id]
    );

    const [testimonials] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    const updatedTestimonial = (testimonials as any[])[0];

    res.status(200).json({
      status: 'success',
      data: {
        testimonial: updatedTestimonial
      }
    });
  } catch (error) {
    console.error(`Error updating testimonial with ID ${req.params.id}:`, error);
    return next(new AppError('Error updating testimonial', 500));
  }
});

export const deleteTestimonial = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First check if testimonial exists
    const [existingTestimonials] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if ((existingTestimonials as any[]).length === 0) {
      return next(new AppError('No testimonial found with that ID', 404));
    }

    await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(`Error deleting testimonial with ID ${req.params.id}:`, error);
    return next(new AppError('Error deleting testimonial', 500));
  }
});

// Facilities
export const getAllFacilities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [facilities] = await pool.query('SELECT * FROM facilities ORDER BY created_at DESC');
    
    // Parse features JSON string to array
    const facilitiesWithParsedFeatures = (facilities as any[]).map(facility => ({
      ...facility,
      features: facility.features ? JSON.parse(facility.features) : []
    }));

    res.status(200).json({
      status: 'success',
      results: facilitiesWithParsedFeatures.length,
      data: {
        facilities: facilitiesWithParsedFeatures
      }
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return next(new AppError('Error fetching facilities', 500));
  }
});

export const getFacilityById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [facilities] = await pool.query('SELECT * FROM facilities WHERE id = ?', [req.params.id]);
    const facility = (facilities as any[])[0];

    if (!facility) {
      return next(new AppError('No facility found with that ID', 404));
    }

    // Parse features JSON string to array
    facility.features = facility.features ? JSON.parse(facility.features) : [];

    res.status(200).json({
      status: 'success',
      data: {
        facility
      }
    });
  } catch (error) {
    console.error(`Error fetching facility with ID ${req.params.id}:`, error);
    return next(new AppError('Error fetching facility', 500));
  }
});

export const createFacility = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, image_url, features, status } = req.body;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // Convert features array to JSON string
    const featuresJson = features ? JSON.stringify(features) : null;

    const [result] = await pool.query(
      'INSERT INTO facilities (name, description, image_url, features, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, image_url, featuresJson, status || 'available', now, now]
    );

    const insertId = (result as any).insertId;
    const [facilities] = await pool.query('SELECT * FROM facilities WHERE id = ?', [insertId]);
    const newFacility = (facilities as any[])[0];
    
    // Parse features JSON string back to array for response
    newFacility.features = newFacility.features ? JSON.parse(newFacility.features) : [];

    res.status(201).json({
      status: 'success',
      data: {
        facility: newFacility
      }
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    return next(new AppError('Error creating facility', 500));
  }
});

export const updateFacility = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, image_url, features, status } = req.body;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // Convert features array to JSON string
    const featuresJson = features ? JSON.stringify(features) : null;

    // First check if facility exists
    const [existingFacilities] = await pool.query('SELECT * FROM facilities WHERE id = ?', [req.params.id]);
    if ((existingFacilities as any[]).length === 0) {
      return next(new AppError('No facility found with that ID', 404));
    }

    await pool.query(
      'UPDATE facilities SET name = ?, description = ?, image_url = ?, features = ?, status = ?, updated_at = ? WHERE id = ?',
      [name, description, image_url, featuresJson, status, now, req.params.id]
    );

    const [facilities] = await pool.query('SELECT * FROM facilities WHERE id = ?', [req.params.id]);
    const updatedFacility = (facilities as any[])[0];
    
    // Parse features JSON string back to array for response
    updatedFacility.features = updatedFacility.features ? JSON.parse(updatedFacility.features) : [];

    res.status(200).json({
      status: 'success',
      data: {
        facility: updatedFacility
      }
    });
  } catch (error) {
    console.error(`Error updating facility with ID ${req.params.id}:`, error);
    return next(new AppError('Error updating facility', 500));
  }
});

export const deleteFacility = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First check if facility exists
    const [existingFacilities] = await pool.query('SELECT * FROM facilities WHERE id = ?', [req.params.id]);
    if ((existingFacilities as any[]).length === 0) {
      return next(new AppError('No facility found with that ID', 404));
    }

    await pool.query('DELETE FROM facilities WHERE id = ?', [req.params.id]);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(`Error deleting facility with ID ${req.params.id}:`, error);
    return next(new AppError('Error deleting facility', 500));
  }
});

// Gallery
export const getAllGalleryImages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [images] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');

    res.status(200).json({
      status: 'success',
      results: (images as any[]).length,
      data: {
        images
      }
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return next(new AppError('Error fetching gallery images', 500));
  }
});

export const getGalleryImageById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [images] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    const image = (images as any[])[0];

    if (!image) {
      return next(new AppError('No gallery image found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        image
      }
    });
  } catch (error) {
    console.error(`Error fetching gallery image with ID ${req.params.id}:`, error);
    return next(new AppError('Error fetching gallery image', 500));
  }
});

export const createGalleryImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, url, category } = req.body;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await pool.query(
      'INSERT INTO gallery (title, description, url, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || '', url, category || 'general', now, now]
    );

    const insertId = (result as any).insertId;
    const [images] = await pool.query('SELECT * FROM gallery WHERE id = ?', [insertId]);
    const newImage = (images as any[])[0];

    res.status(201).json({
      status: 'success',
      data: {
        image: newImage
      }
    });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return next(new AppError('Error creating gallery image', 500));
  }
});

export const updateGalleryImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, url, category } = req.body;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // First check if gallery image exists
    const [existingImages] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if ((existingImages as any[]).length === 0) {
      return next(new AppError('No gallery image found with that ID', 404));
    }

    await pool.query(
      'UPDATE gallery SET title = ?, description = ?, url = ?, category = ?, updated_at = ? WHERE id = ?',
      [title, description || '', url, category || 'general', now, req.params.id]
    );

    const [images] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    const updatedImage = (images as any[])[0];

    res.status(200).json({
      status: 'success',
      data: {
        image: updatedImage
      }
    });
  } catch (error) {
    console.error(`Error updating gallery image with ID ${req.params.id}:`, error);
    return next(new AppError('Error updating gallery image', 500));
  }
});

export const deleteGalleryImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First check if gallery image exists
    const [existingImages] = await pool.query('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if ((existingImages as any[]).length === 0) {
      return next(new AppError('No gallery image found with that ID', 404));
    }

    await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(`Error deleting gallery image with ID ${req.params.id}:`, error);
    return next(new AppError('Error deleting gallery image', 500));
  }
});