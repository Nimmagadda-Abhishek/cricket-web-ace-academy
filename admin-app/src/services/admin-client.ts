// Admin client service for database operations
// This service uses the API endpoints for admin operations

import { api } from '@/lib/api';

// Testimonials service
export const testimonialsService = {
  // Get all testimonials
  getTestimonials: async () => {
    try {
      return await api.admin.testimonials.getAll();
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return { 
        status: 'error', 
        data: { testimonials: [] },
        message: 'Failed to fetch testimonials'
      };
    }
  },
  
  // Get testimonial by ID
  getTestimonialById: async (id: string) => {
    try {
      return await api.admin.testimonials.getById(id);
    } catch (error) {
      console.error(`Error fetching testimonial with ID ${id}:`, error);
      return { 
        status: 'error', 
        data: { testimonial: null },
        message: `Failed to fetch testimonial with ID ${id}`
      };
    }
  },

  // Create a new testimonial
  createTestimonial: async (testimonial: any) => {
    try {
      return await api.admin.testimonials.create(testimonial);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return { 
        status: 'error', 
        message: 'Failed to create testimonial'
      };
    }
  },

  // Update an existing testimonial
  updateTestimonial: async (id: string, updates: any) => {
    try {
      return await api.admin.testimonials.update(id, updates);
    } catch (error) {
      console.error(`Error updating testimonial with ID ${id}:`, error);
      return { 
        status: 'error', 
        message: `Failed to update testimonial with ID ${id}`
      };
    }
  },

  // Delete a testimonial
  deleteTestimonial: async (id: string) => {
    try {
      return await api.admin.testimonials.delete(id);
    } catch (error) {
      console.error(`Error deleting testimonial with ID ${id}:`, error);
      return { 
        status: 'error', 
        message: `Failed to delete testimonial with ID ${id}`
      };
    }
  },
};

// Facilities service
export const facilitiesService = {
  // Get all facilities
  getFacilities: async () => {
    try {
      return await api.admin.facilities.getAll();
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return { 
        status: 'error', 
        data: { facilities: [] },
        message: 'Failed to fetch facilities'
      };
    }
  },
  
  // Get facility by ID
  getFacilityById: async (id: string) => {
    try {
      return await api.admin.facilities.getById(id);
    } catch (error) {
      console.error(`Error fetching facility with ID ${id}:`, error);
      return { 
        status: 'error', 
        data: { facility: null },
        message: `Failed to fetch facility with ID ${id}`
      };
    }
  },

  // Create a new facility
  createFacility: async (facility: any) => {
    try {
      return await api.admin.facilities.create(facility);
    } catch (error) {
      console.error('Error creating facility:', error);
      return { 
        status: 'error', 
        message: 'Failed to create facility'
      };
    }
  },

  // Update an existing facility
  updateFacility: async (id: string, updates: any) => {
    try {
      return await api.admin.facilities.update(id, updates);
    } catch (error) {
      console.error(`Error updating facility with ID ${id}:`, error);
      return { 
        status: 'error', 
        message: `Failed to update facility with ID ${id}`
      };
    }
  },

  // Delete a facility
  deleteFacility: async (id: string) => {
    try {
      return await api.admin.facilities.delete(id);
    } catch (error) {
      console.error(`Error deleting facility with ID ${id}:`, error);
      return { 
        status: 'error', 
        message: `Failed to delete facility with ID ${id}`
      };
    }
  },
};

// Gallery service
export const galleryService = {
  // Get all gallery images
  getGalleryImages: async () => {
    try {
      return await api.admin.gallery.getAll();
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      return { 
        status: 'error', 
        data: { images: [] },
        message: 'Failed to fetch gallery images'
      };
    }
  },
  
  // Get gallery image by ID
  getGalleryImageById: async (id: string) => {
    try {
      return await api.admin.gallery.getById(id);
    } catch (error) {
      console.error(`Error fetching gallery image with ID ${id}:`, error);
      return { 
        status: 'error', 
        data: { image: null },
        message: `Failed to fetch gallery image with ID ${id}`
      };
    }
  },

  // Create a new gallery image
  createGalleryImage: async (image: any) => {
    try {
      return await api.admin.gallery.create(image);
    } catch (error) {
      console.error('Error creating gallery image:', error);
      return { 
        status: 'error', 
        message: 'Failed to create gallery image'
      };
    }
  },

  // Update an existing gallery image
  updateGalleryImage: async (id: string, updates: any) => {
    try {
      return await api.admin.gallery.update(id, updates);
    } catch (error) {
      console.error(`Error updating gallery image with ID ${id}:`, error);
      return { 
        status: 'error', 
        message: `Failed to update gallery image with ID ${id}`
      };
    }
  },

  // Delete a gallery image
  deleteGalleryImage: async (id: string) => {
    try {
      return await api.admin.gallery.delete(id);
    } catch (error) {
      console.error(`Error deleting gallery image with ID ${id}:`, error);
      return { 
        status: 'error', 
        message: `Failed to delete gallery image with ID ${id}`
      };
    }
  },
};

export default {
  testimonials: testimonialsService,
  facilities: facilitiesService,
  gallery: galleryService,
};