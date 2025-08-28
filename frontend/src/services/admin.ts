// Admin services for database operations
import { db } from '@/integrations/hostinger/client';

// Testimonials service
export const testimonialsService = {
  // Get all testimonials
  getTestimonials: async () => {
    const testimonials = await db.query(
      'SELECT * FROM testimonials ORDER BY created_at DESC'
    );
    
    return {
      data: {
        testimonials: testimonials.map(transformTestimonialFromDb),
      },
    };
  },
  
  // Get testimonial by ID
  getTestimonialById: async (id: string) => {
    const testimonial = await db.queryOne(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );
    
    if (!testimonial) {
      throw new Error(`Testimonial with ID ${id} not found`);
    }
    
    return {
      data: {
        testimonial: transformTestimonialFromDb(testimonial),
      },
    };
  },

  // Create a new testimonial
  createTestimonial: async (testimonial: any) => {
    const now = new Date().toISOString();
    const dbTestimonial = {
      ...transformTestimonialToDb(testimonial),
      created_at: now,
      updated_at: now,
    };
    
    const id = await db.insert('testimonials', dbTestimonial);
    const newTestimonial = await db.queryOne('SELECT * FROM testimonials WHERE id = ?', [id]);
    
    return {
      data: {
        testimonial: transformTestimonialFromDb(newTestimonial),
      },
    };
  },

  // Update an existing testimonial
  updateTestimonial: async (id: string, updates: any) => {
    const dbUpdates = {
      ...transformTestimonialToDb(updates),
      updated_at: new Date().toISOString(),
    };
    
    await db.update('testimonials', dbUpdates, 'id = ?', [id]);
    const updatedTestimonial = await db.queryOne('SELECT * FROM testimonials WHERE id = ?', [id]);
    
    if (!updatedTestimonial) {
      throw new Error(`Testimonial with ID ${id} not found after update`);
    }
    
    return {
      data: {
        testimonial: transformTestimonialFromDb(updatedTestimonial),
      },
    };
  },

  // Delete a testimonial
  deleteTestimonial: async (id: string) => {
    await db.delete('testimonials', 'id = ?', [id]);
    
    return {
      data: {
        message: 'Testimonial deleted successfully',
      },
    };
  },
};

// Facilities service
export const facilitiesService = {
  // Get all facilities
  getFacilities: async () => {
    const facilities = await db.query(
      'SELECT * FROM facilities ORDER BY created_at DESC'
    );
    
    return {
      data: {
        facilities: facilities.map(transformFacilityFromDb),
      },
    };
  },
  
  // Get facility by ID
  getFacilityById: async (id: string) => {
    const facility = await db.queryOne(
      'SELECT * FROM facilities WHERE id = ?',
      [id]
    );
    
    if (!facility) {
      throw new Error(`Facility with ID ${id} not found`);
    }
    
    return {
      data: {
        facility: transformFacilityFromDb(facility),
      },
    };
  },

  // Create a new facility
  createFacility: async (facility: any) => {
    const now = new Date().toISOString();
    const dbFacility = {
      ...transformFacilityToDb(facility),
      created_at: now,
      updated_at: now,
    };
    
    const id = await db.insert('facilities', dbFacility);
    const newFacility = await db.queryOne('SELECT * FROM facilities WHERE id = ?', [id]);
    
    return {
      data: {
        facility: transformFacilityFromDb(newFacility),
      },
    };
  },

  // Update an existing facility
  updateFacility: async (id: string, updates: any) => {
    const dbUpdates = {
      ...transformFacilityToDb(updates),
      updated_at: new Date().toISOString(),
    };
    
    await db.update('facilities', dbUpdates, 'id = ?', [id]);
    const updatedFacility = await db.queryOne('SELECT * FROM facilities WHERE id = ?', [id]);
    
    if (!updatedFacility) {
      throw new Error(`Facility with ID ${id} not found after update`);
    }
    
    return {
      data: {
        facility: transformFacilityFromDb(updatedFacility),
      },
    };
  },

  // Delete a facility
  deleteFacility: async (id: string) => {
    await db.delete('facilities', 'id = ?', [id]);
    
    return {
      data: {
        message: 'Facility deleted successfully',
      },
    };
  },
};

// Gallery service
export const galleryService = {
  // Get all gallery images
  getGalleryImages: async () => {
    const images = await db.query(
      'SELECT * FROM gallery ORDER BY created_at DESC'
    );
    
    return {
      data: {
        images: images.map(transformGalleryImageFromDb),
      },
    };
  },
  
  // Get gallery image by ID
  getGalleryImageById: async (id: string) => {
    const image = await db.queryOne(
      'SELECT * FROM gallery WHERE id = ?',
      [id]
    );
    
    if (!image) {
      throw new Error(`Gallery image with ID ${id} not found`);
    }
    
    return {
      data: {
        image: transformGalleryImageFromDb(image),
      },
    };
  },

  // Create a new gallery image
  createGalleryImage: async (image: any) => {
    const now = new Date().toISOString();
    const dbImage = {
      ...transformGalleryImageToDb(image),
      created_at: now,
    };
    
    const id = await db.insert('gallery', dbImage);
    const newImage = await db.queryOne('SELECT * FROM gallery WHERE id = ?', [id]);
    
    return {
      data: {
        image: transformGalleryImageFromDb(newImage),
      },
    };
  },

  // Update an existing gallery image
  updateGalleryImage: async (id: string, updates: any) => {
    const dbUpdates = transformGalleryImageToDb(updates);
    
    await db.update('gallery', dbUpdates, 'id = ?', [id]);
    const updatedImage = await db.queryOne('SELECT * FROM gallery WHERE id = ?', [id]);
    
    if (!updatedImage) {
      throw new Error(`Gallery image with ID ${id} not found after update`);
    }
    
    return {
      data: {
        image: transformGalleryImageFromDb(updatedImage),
      },
    };
  },

  // Delete a gallery image
  deleteGalleryImage: async (id: string) => {
    await db.delete('gallery', 'id = ?', [id]);
    
    return {
      data: {
        message: 'Gallery image deleted successfully',
      },
    };
  },
};

// Helper function to transform testimonial data from database format to application format
function transformTestimonialFromDb(dbTestimonial: any): any {
  return {
    id: dbTestimonial.id,
    name: dbTestimonial.name,
    role: dbTestimonial.role,
    content: dbTestimonial.content,
    rating: dbTestimonial.rating,
    image_url: dbTestimonial.image_url,
    is_featured: dbTestimonial.is_featured === 1, // Convert from 0/1 to boolean
    created_at: dbTestimonial.created_at,
    updated_at: dbTestimonial.updated_at,
  };
}

// Helper function to transform testimonial data from application format to database format
function transformTestimonialToDb(appTestimonial: any): any {
  return {
    name: appTestimonial.name,
    role: appTestimonial.role,
    content: appTestimonial.content,
    rating: appTestimonial.rating,
    image_url: appTestimonial.image_url,
    is_featured: appTestimonial.is_featured ? 1 : 0, // Convert from boolean to 0/1
  };
}

// Helper function to transform facility data from database format to application format
function transformFacilityFromDb(dbFacility: any): any {
  return {
    id: dbFacility.id,
    name: dbFacility.name,
    description: dbFacility.description,
    image_url: dbFacility.image_url,
    features: dbFacility.features ? JSON.parse(dbFacility.features) : [],
    status: dbFacility.status,
    created_at: dbFacility.created_at,
    updated_at: dbFacility.updated_at,
  };
}

// Helper function to transform facility data from application format to database format
function transformFacilityToDb(appFacility: any): any {
  return {
    name: appFacility.name,
    description: appFacility.description,
    image_url: appFacility.image_url,
    features: appFacility.features ? JSON.stringify(appFacility.features) : null,
    status: appFacility.status,
  };
}

// Helper function to transform gallery image data from database format to application format
function transformGalleryImageFromDb(dbImage: any): any {
  return {
    id: dbImage.id,
    title: dbImage.title,
    description: dbImage.description,
    url: dbImage.url,
    category: dbImage.category,
    created_at: dbImage.created_at,
  };
}

// Helper function to transform gallery image data from application format to database format
function transformGalleryImageToDb(appImage: any): any {
  return {
    title: appImage.title,
    description: appImage.description,
    url: appImage.url,
    category: appImage.category,
  };
}

export default {
  testimonials: testimonialsService,
  facilities: facilitiesService,
  gallery: galleryService,
};
