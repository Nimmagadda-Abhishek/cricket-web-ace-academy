// server/routes/admin.js
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log database configuration for debugging (without sensitive info)
console.log('Admin routes - Database configuration:');
console.log('DB_HOST:', process.env.VITE_DB_HOST ? '✓ Set' : '✗ Not set');
console.log('DB_USER:', process.env.VITE_DB_USER ? '✓ Set' : '✗ Not set');
console.log('DB_NAME:', process.env.VITE_DB_NAME ? '✓ Set' : '✗ Not set');
console.log('DB_PORT:', process.env.VITE_DB_PORT || '3306');

const router = express.Router();

// Debug endpoint to check database configuration
router.get('/debug', (req, res) => {
  res.json({
    status: 'success',
    message: 'Admin routes debug information',
    dbConfig: {
      host: process.env.VITE_DB_HOST ? process.env.VITE_DB_HOST.substring(0, 5) + '...' : 'Not set',
      user: process.env.VITE_DB_USER ? process.env.VITE_DB_USER.substring(0, 5) + '...' : 'Not set',
      database: process.env.VITE_DB_NAME ? process.env.VITE_DB_NAME.substring(0, 5) + '...' : 'Not set',
      port: process.env.VITE_DB_PORT || '3306'
    },
    timestamp: new Date().toISOString()
  });
});

// Database configuration
const dbConfig = {
  host: process.env.VITE_DB_HOST,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  database: process.env.VITE_DB_NAME,
  port: process.env.VITE_DB_PORT || 3306
};

// Create a connection pool
let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('MySQL connection pool created for admin routes');
} catch (error) {
  console.error('Failed to create MySQL connection pool for admin routes:', error);
}

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // For development/demo purposes, allow all requests
  // In production, you would check for a valid token
  return next();
};

// Testimonials routes
// Get all testimonials
router.get('/testimonials', isAuthenticated, async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
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

// Get testimonial by ID
router.get('/testimonials/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    const [testimonials] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    
    if (testimonials.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Testimonial with ID ${id} not found`
      });
    }
    
    // Transform is_featured from 0/1 to boolean
    const testimonial = {
      ...testimonials[0],
      is_featured: testimonials[0].is_featured === 1
    };
    
    res.json({
      status: 'success',
      data: {
        testimonial
      }
    });
  } catch (error) {
    console.error(`Error fetching testimonial with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch testimonial',
      error: error.message
    });
  }
});

// Create a new testimonial
router.post('/testimonials', isAuthenticated, async (req, res) => {
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
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
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

// Update a testimonial
router.put('/testimonials/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialData = req.body;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    // Transform boolean is_featured to 0/1
    const dbTestimonial = {
      ...testimonialData,
      is_featured: testimonialData.is_featured ? 1 : 0,
      updated_at: new Date()
    };
    
    const [result] = await pool.query('UPDATE testimonials SET ? WHERE id = ?', [dbTestimonial, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Testimonial with ID ${id} not found`
      });
    }
    
    const [updatedTestimonials] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    
    if (updatedTestimonials.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve updated testimonial'
      });
    }
    
    // Transform is_featured from 0/1 to boolean
    const updatedTestimonial = {
      ...updatedTestimonials[0],
      is_featured: updatedTestimonials[0].is_featured === 1
    };
    
    res.json({
      status: 'success',
      data: {
        testimonial: updatedTestimonial
      }
    });
  } catch (error) {
    console.error(`Error updating testimonial with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update testimonial',
      error: error.message
    });
  }
});

// Delete a testimonial
router.delete('/testimonials/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    const [result] = await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Testimonial with ID ${id} not found`
      });
    }
    
    res.json({
      status: 'success',
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting testimonial with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete testimonial',
      error: error.message
    });
  }
});

// Facilities routes
// Get all facilities
router.get('/facilities', isAuthenticated, async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
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

// Get facility by ID
router.get('/facilities/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    const [facilities] = await pool.query('SELECT * FROM facilities WHERE id = ?', [id]);
    
    if (facilities.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Facility with ID ${id} not found`
      });
    }
    
    // Parse features JSON
    const facility = {
      ...facilities[0],
      features: facilities[0].features ? JSON.parse(facilities[0].features) : []
    };
    
    res.json({
      status: 'success',
      data: {
        facility
      }
    });
  } catch (error) {
    console.error(`Error fetching facility with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch facility',
      error: error.message
    });
  }
});

// Create a new facility
router.post('/facilities', isAuthenticated, async (req, res) => {
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
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
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

// Update a facility
router.put('/facilities/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const facilityData = req.body;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    // Stringify features array
    const dbFacility = {
      ...facilityData,
      features: facilityData.features ? JSON.stringify(facilityData.features) : null,
      updated_at: new Date()
    };
    
    const [result] = await pool.query('UPDATE facilities SET ? WHERE id = ?', [dbFacility, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Facility with ID ${id} not found`
      });
    }
    
    const [updatedFacilities] = await pool.query('SELECT * FROM facilities WHERE id = ?', [id]);
    
    if (updatedFacilities.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve updated facility'
      });
    }
    
    // Parse features JSON
    const updatedFacility = {
      ...updatedFacilities[0],
      features: updatedFacilities[0].features ? JSON.parse(updatedFacilities[0].features) : []
    };
    
    res.json({
      status: 'success',
      data: {
        facility: updatedFacility
      }
    });
  } catch (error) {
    console.error(`Error updating facility with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update facility',
      error: error.message
    });
  }
});

// Delete a facility
router.delete('/facilities/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    const [result] = await pool.query('DELETE FROM facilities WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Facility with ID ${id} not found`
      });
    }
    
    res.json({
      status: 'success',
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting facility with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete facility',
      error: error.message
    });
  }
});

// Gallery routes
// Get all gallery images
router.get('/gallery', isAuthenticated, async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
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

// Get gallery image by ID
router.get('/gallery/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    const [images] = await pool.query('SELECT * FROM gallery WHERE id = ?', [id]);
    
    if (images.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Gallery image with ID ${id} not found`
      });
    }
    
    res.json({
      status: 'success',
      data: {
        image: images[0]
      }
    });
  } catch (error) {
    console.error(`Error fetching gallery image with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch gallery image',
      error: error.message
    });
  }
});

// Create a new gallery image
router.post('/gallery', isAuthenticated, async (req, res) => {
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
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
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

// Update a gallery image
router.put('/gallery/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const imageData = req.body;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    const [result] = await pool.query('UPDATE gallery SET ? WHERE id = ?', [imageData, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Gallery image with ID ${id} not found`
      });
    }
    
    const [updatedImages] = await pool.query('SELECT * FROM gallery WHERE id = ?', [id]);
    
    if (updatedImages.length === 0) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve updated gallery image'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        image: updatedImages[0]
      }
    });
  } catch (error) {
    console.error(`Error updating gallery image with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update gallery image',
      error: error.message
    });
  }
});

// Delete a gallery image
router.delete('/gallery/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!pool) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection not available'
      });
    }
    
    const [result] = await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: `Gallery image with ID ${id} not found`
      });
    }
    
    res.json({
      status: 'success',
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting gallery image with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete gallery image',
      error: error.message
    });
  }
});

export default router;