/**
 * API Service for Cricket Academy
 * This file contains utilities for making API requests to the backend
 */

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000/api';

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
  try {
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
      return {
        status: responseData.status || 'error',
        message: responseData.message || 'An error occurred',
        errors: responseData.errors,
      };
    }
    
    return responseData as ApiResponse<T>;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * API service with methods for different endpoints
 */
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => 
      apiRequest<{ user: any; token: string }>('/auth/login', 'POST', { email, password }),
    
    register: (userData: any) => 
      apiRequest<{ user: any; token: string }>('/auth/register', 'POST', userData),
    
    logout: () => 
      apiRequest<null>('/auth/logout', 'POST'),
    
    getCurrentUser: () => 
      apiRequest<{ user: any }>('/auth/me', 'GET'),
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
  
  // Coaches endpoints
  coaches: {
    getAll: () => 
      apiRequest<{ coaches: any[] }>('/coaches', 'GET'),
    
    getById: (id: string) => 
      apiRequest<{ coach: any }>(`/coaches/${id}`, 'GET'),
    
    create: (coachData: any) => 
      apiRequest<{ coach: any }>('/coaches', 'POST', coachData),
    
    update: (id: string, coachData: any) => 
      apiRequest<{ coach: any }>(`/coaches/${id}`, 'PUT', coachData),
    
    delete: (id: string) => 
      apiRequest<null>(`/coaches/${id}`, 'DELETE'),
  },
  
  // Contacts endpoints
  contacts: {
    create: (contactData: any) => 
      apiRequest<{ contact: any }>('/contacts', 'POST', contactData),
    
    getAll: () => 
      apiRequest<{ contacts: any[] }>('/contacts', 'GET'),
  },
  
  // Health check
  health: {
    check: () => 
      apiRequest<any>('/health', 'GET'),
  },
};

/**
 * Hook to check if the API is available
 * This can be used to verify the connection between frontend and backend
 */
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};

export default api;