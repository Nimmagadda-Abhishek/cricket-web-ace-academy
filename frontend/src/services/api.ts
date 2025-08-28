// API service for making requests to the backend


const API_URL = 'https://cricket-web-ace-academy.onrender.com/api';
const IS_DEV = import.meta.env.DEV || process.env.NODE_ENV === 'development';

// Generic fetch function with error handling
async function fetchData(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Programs API
export const programsApi = {
  // Get all public programs
  getPrograms: async () => {
    return fetchData('/programs');
  },
  
  // Get program details by ID
  getProgramById: async (id: string) => {
    return fetchData(`/programs/${id}`);
  },
};

// Payments API (for checkout)
export const paymentsApi = {
  // Create a new payment intent
  createPaymentIntent: (data: { amount: number; programId: string; studentInfo: Record<string, unknown> }) => {
    // For development, return mock success
    if (IS_DEV) {
      return Promise.resolve({
        data: {
          clientSecret: 'pi_mock_client_secret',
          paymentIntentId: 'pi_mock_payment_intent',
        },
      });
    }
    
    // Note: Supabase doesn't handle payment intents directly
    // You would typically use a serverless function or backend API for this
    // This would connect to Stripe or another payment processor
    
    return fetchData('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Confirm payment and create enrollment
  confirmPayment: (paymentIntentId: string) => {
    // For development, return mock success
    if (IS_DEV) {
      return Promise.resolve({
        data: {
          status: 'succeeded',
          enrollmentId: 'enroll_mock_123',
        },
      });
    }
    
    // Fallback to REST API
    return fetchData('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    });
  },
  
  // Create enrollment record
  createEnrollment: (data: { 
    program_id: string; 
    student_info: Record<string, unknown>; 
    payment_intent_id: string;
    amount_paid: number;
  }) => {
    // For development, return mock success
    if (IS_DEV) {
      return Promise.resolve({
        data: {
          enrollment: {
            id: 'enroll_mock_123',
            ...data,
            payment_status: 'pending',
          },
        },
      });
    }
    
    // Fallback to REST API
    return fetchData('/enrollments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Coaches API
export const coachesApi = {
  // Get all coaches
  getCoaches: async () => {
    return fetchData('/coaches');
  },
};

// Achievements API
export const achievementsApi = {
  // Get all achievements
  getAchievements: async () => {
    return fetchData('/achievements');
  },
};

// Facilities API
export const facilitiesApi = {
  // Get all facilities
  getFacilities: async () => {
    return fetchData('/facilities');
  },
};

// Gallery API
export const galleryApi = {
  // Get all gallery images
  getGalleryImages: async () => {
    return fetchData('/gallery');
  },
};

// Testimonials API  
export const testimonialsApi = {
  // Get all testimonials
  getTestimonials: async () => {
    return fetchData('/testimonials');
  },
};

// Contacts API
export const contactsApi = {
  // Submit contact form
  submitContact: (data: { name: string; email: string; phone: string; message: string }) => {
    return fetchData('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Legacy export for backward compatibility
export const fetchPrograms = async () => {
  const result = await programsApi.getPrograms();
  const programs = result.data.programs || [];
  
  // Transform database fields to match frontend expectations
  return programs.map((program: {
    id: number;
    title: string;
    description: string;
    image_url: string;
    skill_level: string;
    highlights?: string[];
    age_group: string;
    duration: string;
    price: string | number;
    max_participants: number;
  }) => ({
    _id: program.id.toString(),
    title: program.title,
    description: program.description,
    image: program.image_url, // Map image_url to image
    level: program.skill_level,
    highlights: program.highlights || [],
    ageGroup: program.age_group,
    duration: program.duration,
    price: typeof program.price === 'string' ? parseFloat(program.price) : program.price,
    maxStudents: program.max_participants
  }));
};

export default {
  programs: programsApi,
  payments: paymentsApi,
  contacts: contactsApi,
  coaches: coachesApi,
  achievements: achievementsApi,
  facilities: facilitiesApi,
  gallery: galleryApi,
  testimonials: testimonialsApi,
};