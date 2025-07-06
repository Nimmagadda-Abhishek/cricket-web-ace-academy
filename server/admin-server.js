/**
 * Dedicated server for admin API endpoints
 */

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5005;

// Database configuration
const dbConfig = {
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Admin API server is running',
    timestamp: new Date().toISOString()
  });
});

// Database check endpoint
app.get('/db-check', async (req, res) => {
  try {
    // Test the connection
    const [result] = await pool.query('SELECT 1 as test');
    
    res.json({
      status: 'success',
      message: 'Database connection successful',
      result: result[0],
      dbConfig: {
        host: dbConfig.host,
        database: dbConfig.database,
        user: dbConfig.user,
        port: dbConfig.port
      }
    });
  } catch (error) {
    console.error('Database connection check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Get all testimonials
app.get('/testimonials', async (req, res) => {
  try {
    const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    
    // Transform is_featured from 0/1 to boolean
    const transformedTestimonials = testimonials.map(testimonial => ({
      ...testimonial,
      is_featured: testimonial.is_featured === 1
    }));
    
    res.json({
      status: 'success',
      data: {
        testimonials: transformedTestimonials
      }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
});

// Create a new testimonial
app.post('/testimonials', async (req, res) => {
  try {
    const testimonialData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'role', 'content', 'image_url'];
    for (const field of requiredFields) {
      if (!testimonialData[field]) {
        return res.status(400).json({
          status: 'fail',
          message: `Missing required field: ${field}`
        });
      }
    }
    
    // Transform boolean is_featured to 0/1
    const dbTestimonial = {
      ...testimonialData,
      is_featured: testimonialData.is_featured ? 1 : 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const [result] = await pool.query('INSERT INTO testimonials SET ?', [dbTestimonial]);
    const [newTestimonials] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [result.insertId]);
    
    if (newTestimonials.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve created testimonial'
      });
    }
    
    // Transform is_featured from 0/1 to boolean
    const newTestimonial = {
      ...newTestimonials[0],
      is_featured: newTestimonials[0].is_featured === 1
    };
    
    res.status(201).json({
      status: 'success',
      data: {
        testimonial: newTestimonial
      }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create testimonial',
      error: error.message
    });
  }
});

// Get all facilities
app.get('/facilities', async (req, res) => {
  try {
    const [facilities] = await pool.query('SELECT * FROM facilities ORDER BY created_at DESC');
    
    // Parse features JSON
    const transformedFacilities = facilities.map(facility => ({
      ...facility,
      features: facility.features ? JSON.parse(facility.features) : []
    }));
    
    res.json({
      status: 'success',
      data: {
        facilities: transformedFacilities
      }
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch facilities',
      error: error.message
    });
  }
});

// Create a new facility
app.post('/facilities', async (req, res) => {
  try {
    const facilityData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'image_url'];
    for (const field of requiredFields) {
      if (!facilityData[field]) {
        return res.status(400).json({
          status: 'fail',
          message: `Missing required field: ${field}`
        });
      }
    }
    
    // Stringify features array
    const dbFacility = {
      ...facilityData,
      features: facilityData.features ? JSON.stringify(facilityData.features) : null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const [result] = await pool.query('INSERT INTO facilities SET ?', [dbFacility]);
    const [newFacilities] = await pool.query('SELECT * FROM facilities WHERE id = ?', [result.insertId]);
    
    if (newFacilities.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve created facility'
      });
    }
    
    // Parse features JSON
    const newFacility = {
      ...newFacilities[0],
      features: newFacilities[0].features ? JSON.parse(newFacilities[0].features) : []
    };
    
    res.status(201).json({
      status: 'success',
      data: {
        facility: newFacility
      }
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create facility',
      error: error.message
    });
  }
});

// Get all gallery images
app.get('/gallery', async (req, res) => {
  try {
    const [images] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    
    res.json({
      status: 'success',
      data: {
        images
      }
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch gallery images',
      error: error.message
    });
  }
});

// Create a new gallery image
app.post('/gallery', async (req, res) => {
  try {
    const imageData = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'url'];
    for (const field of requiredFields) {
      if (!imageData[field]) {
        return res.status(400).json({
          status: 'fail',
          message: `Missing required field: ${field}`
        });
      }
    }
    
    const dbImage = {
      ...imageData,
      created_at: new Date()
    };
    
    const [result] = await pool.query('INSERT INTO gallery SET ?', [dbImage]);
    const [newImages] = await pool.query('SELECT * FROM gallery WHERE id = ?', [result.insertId]);
    
    if (newImages.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve created gallery image'
      });
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        image: newImages[0]
      }
    });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create gallery image',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Admin API server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log(`Database check available at: http://localhost:${PORT}/db-check`);
  console.log(`Testimonials available at: http://localhost:${PORT}/testimonials`);
  console.log(`Facilities available at: http://localhost:${PORT}/facilities`);
  console.log(`Gallery available at: http://localhost:${PORT}/gallery`);
});