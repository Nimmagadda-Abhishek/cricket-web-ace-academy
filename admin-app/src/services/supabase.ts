// Supabase service for database operations
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

// Programs service
export const programsService = {
  // Get all public programs
  getPrograms: async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('status', 'active')
      .order('price');
    
    if (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
    
    return {
      data: {
        programs: data.map(transformProgramFromDb),
      },
    };
  },
  
  // Get program details by ID
  getProgramById: async (id: string) => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching program with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        program: transformProgramFromDb(data),
      },
    };
  },

  // Create a new program (admin only)
  createProgram: async (program: Omit<TablesInsert<'programs'>, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('programs')
      .insert([{
        ...program,
        current_students: program.current_students || 0,
        status: program.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating program:', error);
      throw error;
    }
    
    return {
      data: {
        program: transformProgramFromDb(data),
      },
    };
  },

  // Update an existing program (admin only)
  updateProgram: async (id: string, updates: Partial<TablesInsert<'programs'>>) => {
    const { data, error } = await supabase
      .from('programs')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating program with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        program: transformProgramFromDb(data),
      },
    };
  },
};

// Contacts service
export const contactsService = {
  // Submit contact form
  submitContact: async (contactData: { name: string; email: string; phone: string; message: string }) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        ...contactData,
        status: 'new',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
    
    return {
      data: {
        message: 'Contact form submitted successfully',
        id: data.id,
      },
    };
  },
};

// Payments service
export const paymentsService = {
  // Create a new enrollment record
  createEnrollment: async (enrollmentData: { 
    program_id: string; 
    student_info: any; 
    payment_intent_id: string;
    amount_paid: number;
    payment_status?: string;
  }) => {
    const { data, error } = await supabase
      .from('enrollments')
      .insert([{
        ...enrollmentData,
        payment_status: enrollmentData.payment_status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
    
    return {
      data: {
        enrollment: data,
      },
    };
  },

  // Update enrollment payment status
  updateEnrollmentStatus: async (paymentIntentId: string, status: string) => {
    const { data, error } = await supabase
      .from('enrollments')
      .update({
        payment_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_intent_id', paymentIntentId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating enrollment with payment intent ID ${paymentIntentId}:`, error);
      throw error;
    }
    
    return {
      data: {
        status: data.payment_status,
        enrollmentId: data.id,
      },
    };
  },
};

// Helper function to transform program data from database format to application format
function transformProgramFromDb(dbProgram: Tables<'programs'>): any {
  return {
    _id: dbProgram.id,
    title: dbProgram.title,
    description: dbProgram.description,
    ageGroup: dbProgram.age_group,
    duration: dbProgram.duration,
    price: dbProgram.price,
    maxStudents: dbProgram.max_students,
    currentStudents: dbProgram.current_students,
    features: dbProgram.features,
    status: dbProgram.status,
    coach: dbProgram.coach,
    schedule: dbProgram.schedule,
    equipment: dbProgram.equipment,
    level: dbProgram.level,
    category: dbProgram.category,
    startDate: dbProgram.start_date,
    icon: dbProgram.icon,
    color: dbProgram.color,
    image: dbProgram.image,
    prerequisites: dbProgram.prerequisites,
    certificationProvided: dbProgram.certification_provided,
    discount: dbProgram.discount,
  };
}

// Helper function to transform program data from application format to database format
export function transformProgramToDb(appProgram: any): Omit<TablesInsert<'programs'>, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: appProgram.title,
    description: appProgram.description,
    age_group: appProgram.ageGroup,
    duration: appProgram.duration,
    price: appProgram.price,
    max_students: appProgram.maxStudents,
    current_students: appProgram.currentStudents,
    features: appProgram.features,
    status: appProgram.status,
    coach: appProgram.coach,
    schedule: appProgram.schedule,
    equipment: appProgram.equipment,
    level: appProgram.level,
    category: appProgram.category,
    start_date: appProgram.startDate,
    icon: appProgram.icon,
    color: appProgram.color,
    image: appProgram.image,
    prerequisites: appProgram.prerequisites,
    certification_provided: appProgram.certificationProvided,
    discount: appProgram.discount,
  };
}

// Gallery service
export const galleryService = {
  // Get all gallery images
  getGalleryImages: async (category?: string) => {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
    
    return {
      data: {
        images: data,
      },
    };
  },
  
  // Add a new gallery image
  addGalleryImage: async (imageData: { title: string; description?: string; url: string; category?: string }) => {
    const { data, error } = await supabase
      .from('gallery')
      .insert([{
        ...imageData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding gallery image:', error);
      throw error;
    }
    
    return {
      data: {
        image: data,
      },
    };
  },
  
  // Delete a gallery image
  deleteGalleryImage: async (id: string) => {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting gallery image with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        message: 'Gallery image deleted successfully',
      },
    };
  },
};

// Facilities service
export const facilitiesService = {
  // Get all facilities
  getFacilities: async (status?: string) => {
    let query = supabase
      .from('facilities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
    
    return {
      data: {
        facilities: data,
      },
    };
  },
  
  // Get facility by ID
  getFacilityById: async (id: string) => {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching facility with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        facility: data,
      },
    };
  },
  
  // Create a new facility
  createFacility: async (facilityData: { 
    name: string; 
    description: string; 
    image_url: string; 
    features: string[]; 
    status?: string;
  }) => {
    const { data, error } = await supabase
      .from('facilities')
      .insert([{
        ...facilityData,
        status: facilityData.status || 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
    
    return {
      data: {
        facility: data,
      },
    };
  },
  
  // Update an existing facility
  updateFacility: async (id: string, updates: Partial<TablesInsert<'facilities'>>) => {
    const { data, error } = await supabase
      .from('facilities')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating facility with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        facility: data,
      },
    };
  },
  
  // Delete a facility
  deleteFacility: async (id: string) => {
    const { error } = await supabase
      .from('facilities')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting facility with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        message: 'Facility deleted successfully',
      },
    };
  },
};

// Testimonials service
export const testimonialsService = {
  // Get all testimonials
  getTestimonials: async (featuredOnly: boolean = false) => {
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
    
    return {
      data: {
        testimonials: data,
      },
    };
  },
  
  // Get testimonial by ID
  getTestimonialById: async (id: string) => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching testimonial with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        testimonial: data,
      },
    };
  },
  
  // Create a new testimonial
  createTestimonial: async (testimonialData: { 
    name: string; 
    role: string; 
    content: string; 
    rating?: number; 
    image_url: string; 
    is_featured?: boolean;
  }) => {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        ...testimonialData,
        rating: testimonialData.rating || 5,
        is_featured: testimonialData.is_featured || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
    
    return {
      data: {
        testimonial: data,
      },
    };
  },
  
  // Update an existing testimonial
  updateTestimonial: async (id: string, updates: Partial<TablesInsert<'testimonials'>>) => {
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating testimonial with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        testimonial: data,
      },
    };
  },
  
  // Toggle featured status
  toggleFeatured: async (id: string, isFeatured: boolean) => {
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        is_featured: !isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error toggling featured status for testimonial with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        testimonial: data,
      },
    };
  },
  
  // Delete a testimonial
  deleteTestimonial: async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting testimonial with ID ${id}:`, error);
      throw error;
    }
    
    return {
      data: {
        message: 'Testimonial deleted successfully',
      },
    };
  },
};

export default {
  programs: programsService,
  contacts: contactsService,
  payments: paymentsService,
  gallery: galleryService,
  facilities: facilitiesService,
  testimonials: testimonialsService,
};
