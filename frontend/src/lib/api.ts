/**
 * API Service for Cricket Academy
 * This file contains utilities for making API requests to the backend
 * and also provides a unified interface for database operations
 */

import hostingerService from '@/services/hostinger';

// Use Hostinger database service exclusively
console.log('Using database service: Hostinger');

// Select the Hostinger database service
const dbService = hostingerService;

export { dbService };

// Base URL for API requests - use deployed backend URL
const API_BASE_URL = 'https://cricket-web-ace-academy.onrender.com/api';

console.log('Using API base URL:', API_BASE_URL);

// Default headers for API requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Interface for API response
interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
  errors?: string[];
}

/**
 * Generic function to make API requests
 */
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  customHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get token from localStorage if available
    const token = localStorage.getItem('token');
    
    // Prepare headers
    const headers: HeadersInit = {
      ...DEFAULT_HEADERS,
      ...(customHeaders || {}),
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Prepare request options
    const options: RequestInit = {
      method,
      headers,
      credentials: 'include', // Include cookies in requests
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }
    
    // Make the request
    const response = await fetch(url, options);
    
    // Parse response
    const responseData = await response.json();
    
    // Check if response is successful
    if (!response.ok) {
      throw new Error(responseData.message || 'An error occurred');
    }
    
    return responseData as ApiResponse<T>;
}

/**
 * API service with methods for different endpoints
 */
export const api = {
  // Auth endpoints
  auth: {
    login: (username: string, password: string) => 
      apiRequest<{ user: any; accessToken: string }>('/auth/login', 'POST', { username, password }),
    
    getProfile: () => 
      apiRequest<{ user: any }>('/auth/profile', 'GET'),
    
    changePassword: (currentPassword: string, newPassword: string) => 
      apiRequest<null>('/auth/change-password', 'POST', { currentPassword, newPassword }),
  },
  
  // Achievements endpoints
  achievements: {
    getAll: () => 
      apiRequest<{ achievements: any[] }>('/achievements', 'GET'),
    
    getById: (id: string) => 
      apiRequest<{ achievement: any }>(`/achievements/${id}`, 'GET'),
    
    create: (achievementData: any) => 
      apiRequest<{ achievement: any }>('/achievements', 'POST', achievementData),
    
    update: (id: string, achievementData: any) => 
      apiRequest<{ achievement: any }>(`/achievements/${id}`, 'PUT', achievementData),
    
    delete: (id: string) => 
      apiRequest<null>(`/achievements/${id}`, 'DELETE'),
  },
  
  // Students endpoints
  students: {
    getAll: () => 
      apiRequest<{ students: any[] }>('/students', 'GET'),
    
    getById: (id: string) => 
      apiRequest<{ student: any }>(`/students/${id}`, 'GET'),
    
    create: (studentData: any) => 
      apiRequest<{ student: any }>('/students', 'POST', studentData),
    
    update: (id: string, studentData: any) => 
      apiRequest<{ student: any }>(`/students/${id}`, 'PUT', studentData),
    
    delete: (id: string) => 
      apiRequest<null>(`/students/${id}`, 'DELETE'),
  },
  
  // Programs endpoints
  programs: {
    getAll: () => 
      apiRequest<{ programs: any[] }>('/programs', 'GET'),
    
    getById: (id: string) => 
      apiRequest<{ program: any }>(`/programs/${id}`, 'GET'),
    
    create: (programData: any) => 
      apiRequest<{ program: any }>('/programs', 'POST', programData),
    
    update: (id: string, programData: any) => 
      apiRequest<{ program: any }>(`/programs/${id}`, 'PUT', programData),
    
    delete: (id: string) => 
      apiRequest<null>(`/programs/${id}`, 'DELETE'),
  },
  
  // Contacts endpoints
  contacts: {
    create: (contactData: any) => 
      apiRequest<{ contact: any }>('/contacts', 'POST', contactData),
    
    getAll: () => 
      apiRequest<{ contacts: any[] }>('/contacts', 'GET'),
  },
  
  // Admin endpoints
  admin: {
    // Testimonials
    testimonials: {
      getAll: () => 
        apiRequest<{ testimonials: any[] }>('/admin/testimonials', 'GET'),
      
      getById: (id: string) => 
        apiRequest<{ testimonial: any }>(`/admin/testimonials/${id}`, 'GET'),
      
      create: (testimonialData: any) => 
        apiRequest<{ testimonial: any }>('/admin/testimonials', 'POST', testimonialData),
      
      update: (id: string, testimonialData: any) => 
        apiRequest<{ testimonial: any }>(`/admin/testimonials/${id}`, 'PUT', testimonialData),
      
      delete: (id: string) => 
        apiRequest<null>(`/admin/testimonials/${id}`, 'DELETE'),
    },
    
    // Facilities
    facilities: {
      getAll: () => 
        apiRequest<{ facilities: any[] }>('/admin/facilities', 'GET'),
      
      getById: (id: string) => 
        apiRequest<{ facility: any }>(`/admin/facilities/${id}`, 'GET'),
      
      create: (facilityData: any) => 
        apiRequest<{ facility: any }>('/admin/facilities', 'POST', facilityData),
      
      update: (id: string, facilityData: any) => 
        apiRequest<{ facility: any }>(`/admin/facilities/${id}`, 'PUT', facilityData),
      
      delete: (id: string) => 
        apiRequest<null>(`/admin/facilities/${id}`, 'DELETE'),
    },
    
    // Gallery
    gallery: {
      getAll: () => 
        apiRequest<{ images: any[] }>('/admin/gallery', 'GET'),
      
      getById: (id: string) => 
        apiRequest<{ image: any }>(`/admin/gallery/${id}`, 'GET'),
      
      create: (imageData: any) => 
        apiRequest<{ image: any }>('/admin/gallery', 'POST', imageData),
      
      update: (id: string, imageData: any) => 
        apiRequest<{ image: any }>(`/admin/gallery/${id}`, 'PUT', imageData),
      
      delete: (id: string) => 
        apiRequest<null>(`/admin/gallery/${id}`, 'DELETE'),
    },
  },
  
  // File upload endpoint
  upload: {
    uploadImage: async (file: File, folder: string = 'uploads'): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData
        headers: {
          // Include authorization if available
          ...(localStorage.getItem('token') ? {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.url;
    }
  },
  
  // Health check
  health: {
    check: () => 
      apiRequest<any>('/health', 'GET'),
  },
  
  // Direct database operations (using Hostinger)
  db: dbService,
};

/**
 * Hook to check if the API is available
 * This can be used to verify the connection between frontend and backend
 */
export const checkApiConnection = async (): Promise<boolean> => {
    // Try the health endpoint first
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        // Short timeout to avoid long waits
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) return true;
    } catch (healthError) {
      console.log('Health endpoint check failed, trying login endpoint...');
    }
    
    // If health check fails, try the login endpoint
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ 
        email: 'admin@kalyancricketacademy.com', 
        password: 'wrong-password-just-checking-connection' 
      }),
      // Short timeout to avoid long waits
      signal: AbortSignal.timeout(3000)
    });
    
    // Even a 401 response means the API is available
    return loginResponse.status !== 0;
};

// Check database connection through the server API
export const checkDatabaseConnection = async (): Promise<{connected: boolean, message: string}> => {
    // First try the dedicated check-db endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/check-db`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(3000)
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        return { connected: true, message: 'Connected to database successfully' };
      }
    } catch (e) {
      console.log('First DB check failed, trying auth debug endpoint...');
    }
    
    // If that fails, try the auth debug endpoint
    const response = await fetch(`${API_BASE_URL}/auth/debug`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
      signal: AbortSignal.timeout(3000)
    });
    
    const data = await response.json();
    
    if (response.ok && data.status === 'success') {
      return { connected: true, message: 'Connected to database successfully via auth debug' };
    } else {
      return { 
        connected: false, 
        message: data.message || 'Failed to connect to database' 
      };
    }
};

export default api;
