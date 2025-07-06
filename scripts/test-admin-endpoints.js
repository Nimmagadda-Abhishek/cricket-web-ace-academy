/**
 * Script to test the admin API endpoints
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000/api';

// Test endpoints
const endpoints = [
  { name: 'Health Check', url: '/health', method: 'GET' },
  { name: 'Auth Debug', url: '/auth/debug', method: 'GET' },
  { name: 'DB Check', url: '/check-db', method: 'GET' },
  { name: 'Achievements', url: '/achievements', method: 'GET' },
  { name: 'Auth Login', url: '/auth/login', method: 'POST', body: { email: 'admin@kalyancricketacademy.com', password: 'Admin@123456' } },
  
  // Admin endpoints
  { name: 'Admin Debug', url: '/admin/debug', method: 'GET' },
  { name: 'Admin Testimonials', url: '/admin/testimonials', method: 'GET' },
  { name: 'Admin Facilities', url: '/admin/facilities', method: 'GET' },
  { name: 'Admin Gallery', url: '/admin/gallery', method: 'GET' },
  
  // Test creating a testimonial
  { 
    name: 'Create Testimonial', 
    url: '/admin/testimonials', 
    method: 'POST', 
    body: { 
      name: 'Test User',
      role: 'Student',
      content: 'This is a test testimonial created by the test script.',
      rating: 5,
      image_url: 'https://picsum.photos/seed/test/300/300',
      is_featured: true
    } 
  },
  
  // Test creating a facility
  { 
    name: 'Create Facility', 
    url: '/admin/facilities', 
    method: 'POST', 
    body: { 
      name: 'Test Facility',
      description: 'This is a test facility created by the test script.',
      image_url: 'https://picsum.photos/seed/facility/300/300',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      status: 'available'
    } 
  },
  
  // Test creating a gallery image
  { 
    name: 'Create Gallery Image', 
    url: '/admin/gallery', 
    method: 'POST', 
    body: { 
      title: 'Test Image',
      description: 'This is a test gallery image created by the test script.',
      url: 'https://picsum.photos/seed/gallery/300/300',
      category: 'test'
    } 
  }
];

// Function to test an endpoint
async function testEndpoint(endpoint) {
  try {
    console.log(`Testing ${endpoint.name} (${endpoint.method} ${endpoint.url})...`);
    
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (endpoint.method !== 'GET' && endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint.url}`, options);
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('-----------------------------------');
    
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    console.error(`Error testing ${endpoint.name}:`, error);
    console.log('-----------------------------------');
    return { success: false, error: error.message };
  }
}

// Main function to test all endpoints
async function testAllEndpoints() {
  console.log('Testing API endpoints...');
  
  const results = {};
  
  for (const endpoint of endpoints) {
    results[endpoint.name] = await testEndpoint(endpoint);
  }
  
  console.log('\nSummary:');
  for (const [name, result] of Object.entries(results)) {
    console.log(`${name}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
  }
}

// Run the tests
testAllEndpoints();