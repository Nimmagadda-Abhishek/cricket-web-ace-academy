// Admin API service for database operations
// This service uses the server API endpoints instead of direct database access

import { api } from '@/lib/api';

// Testimonials service
export const testimonialsService = {
  // Get all testimonials
  getTestimonials: async () => {
    try {
      const response = await api.admin.testimonials.getAll();
      return response;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },
  
  // Get testimonial by ID
  getTestimonialById: async (id: string) => {
    try {
      const response = await api.admin.testimonials.getById(id);
      return response;
    } catch (error) {
      console.error(`Error fetching testimonial with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new testimonial
  createTestimonial: async (testimonial: any) => {
    try {
      const response = await api.admin.testimonials.create(testimonial);
      return response;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  },

  // Update an existing testimonial
  updateTestimonial: async (id: string, updates: any) => {
    try {
      const response = await api.admin.testimonials.update(id, updates);
      return response;
    } catch (error) {
      console.error(`Error updating testimonial with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a testimonial
  deleteTestimonial: async (id: string) => {
    try {
      const response = await api.admin.testimonials.delete(id);
      return response;
    } catch (error) {
      console.error(`Error deleting testimonial with ID ${id}:`, error);
      throw error;
    }
  },
};

// Facilities service
export const facilitiesService = {
  // Get all facilities
  getFacilities: async () => {
    try {
      const response = await api.admin.facilities.getAll();
      return response;
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  },
  
  // Get facility by ID
  getFacilityById: async (id: string) => {
    try {
      const response = await api.admin.facilities.getById(id);
      return response;
    } catch (error) {
      console.error(`Error fetching facility with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new facility
  createFacility: async (facility: any) => {
    try {
      const response = await api.admin.facilities.create(facility);
      return response;
    } catch (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
  },

  // Update an existing facility
  updateFacility: async (id: string, updates: any) => {
    try {
      const response = await api.admin.facilities.update(id, updates);
      return response;
    } catch (error) {
      console.error(`Error updating facility with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a facility
  deleteFacility: async (id: string) => {
    try {
      const response = await api.admin.facilities.delete(id);
      return response;
    } catch (error) {
      console.error(`Error deleting facility with ID ${id}:`, error);
      throw error;
    }
  },
};

// Gallery service
export const galleryService = {
  // Get all gallery images
  getGalleryImages: async () => {
    try {
      const response = await api.admin.gallery.getAll();
      return response;
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
  },
  
  // Get gallery image by ID
  getGalleryImageById: async (id: string) => {
    try {
      const response = await api.admin.gallery.getById(id);
      return response;
    } catch (error) {
      console.error(`Error fetching gallery image with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new gallery image
  createGalleryImage: async (image: any) => {
    try {
      const response = await api.admin.gallery.create(image);
      return response;
    } catch (error) {
      console.error('Error creating gallery image:', error);
      throw error;
    }
  },

  // Update an existing gallery image
  updateGalleryImage: async (id: string, updates: any) => {
    try {
      const response = await api.admin.gallery.update(id, updates);
      return response;
    } catch (error) {
      console.error(`Error updating gallery image with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a gallery image
  deleteGalleryImage: async (id: string) => {
    try {
      const response = await api.admin.gallery.delete(id);
      return response;
    } catch (error) {
      console.error(`Error deleting gallery image with ID ${id}:`, error);
      throw error;
    }
  },
};

export default {
  testimonials: testimonialsService,
  facilities: facilitiesService,
  gallery: galleryService,
};