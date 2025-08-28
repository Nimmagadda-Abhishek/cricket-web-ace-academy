// Admin API service for database operations
// This service uses the server API endpoints instead of direct database access

import { api } from '@/lib/api';

// Testimonials service
export const testimonialsService = {
  // Get all testimonials
  getTestimonials: async () => {
    return api.admin.testimonials.getAll();
  },
  
  // Get testimonial by ID
  getTestimonialById: async (id: string) => {
    return api.admin.testimonials.getById(id);
  },

  // Create a new testimonial
  createTestimonial: async (testimonial: any) => {
    return api.admin.testimonials.create(testimonial);
  },

  // Update an existing testimonial
  updateTestimonial: async (id: string, updates: any) => {
    return api.admin.testimonials.update(id, updates);
  },

  // Delete a testimonial
  deleteTestimonial: async (id: string) => {
    return api.admin.testimonials.delete(id);
  },
};

// Facilities service
export const facilitiesService = {
  // Get all facilities
  getFacilities: async () => {
    return api.admin.facilities.getAll();
  },
  
  // Get facility by ID
  getFacilityById: async (id: string) => {
    return api.admin.facilities.getById(id);
  },

  // Create a new facility
  createFacility: async (facility: any) => {
    return api.admin.facilities.create(facility);
  },

  // Update an existing facility
  updateFacility: async (id: string, updates: any) => {
    return api.admin.facilities.update(id, updates);
  },

  // Delete a facility
  deleteFacility: async (id: string) => {
    return api.admin.facilities.delete(id);
  },
};

// Gallery service
export const galleryService = {
  // Get all gallery images
  getGalleryImages: async () => {
    return api.admin.gallery.getAll();
  },
  
  // Get gallery image by ID
  getGalleryImageById: async (id: string) => {
    return api.admin.gallery.getById(id);
  },

  // Create a new gallery image
  createGalleryImage: async (image: any) => {
    return api.admin.gallery.create(image);
  },

  // Update an existing gallery image
  updateGalleryImage: async (id: string, updates: any) => {
    return api.admin.gallery.update(id, updates);
  },

  // Delete a gallery image
  deleteGalleryImage: async (id: string) => {
    return api.admin.gallery.delete(id);
  },
};

export default {
  testimonials: testimonialsService,
  facilities: facilitiesService,
  gallery: galleryService,
};
