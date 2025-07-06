/**
 * Test script for the admin client
 * This script tests the admin client functionality by making API requests
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5002/api';

// Test data
const testTestimonial = {
  name: 'Test User',
  role: 'Student',
  content: 'This is a test testimonial created by the test script.',
  rating: 5,
  image_url: 'https://picsum.photos/seed/test/300/300',
  is_featured: true
};

const testFacility = {
  name: 'Test Facility',
  description: 'This is a test facility created by the test script.',
  image_url: 'https://picsum.photos/seed/facility/300/300',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  status: 'active'
};

const testGalleryImage = {
  title: 'Test Image',
  description: 'This is a test gallery image created by the test script.',
  url: 'https://picsum.photos/seed/gallery/300/300',
  category: 'test'
};

// Function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    return {
      status: response.status,
      data: responseData
    };
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    return {
      status: 500,
      error: error.message
    };
  }
}

// Test testimonials
async function testTestimonials() {
  console.log('\n--- Testing Testimonials API ---');
  
  // Get all testimonials
  console.log('\nGetting all testimonials...');
  const getAllResponse = await apiRequest('/admin/testimonials');
  console.log(`Status: ${getAllResponse.status}`);
  console.log(`Testimonials count: ${getAllResponse.data?.data?.testimonials?.length || 0}`);
  
  // Create a testimonial
  console.log('\nCreating a test testimonial...');
  const createResponse = await apiRequest('/admin/testimonials', 'POST', testTestimonial);
  console.log(`Status: ${createResponse.status}`);
  console.log(`Created testimonial ID: ${createResponse.data?.data?.testimonial?.id}`);
  
  if (createResponse.status === 201 && createResponse.data?.data?.testimonial?.id) {
    const testimonialId = createResponse.data.data.testimonial.id;
    
    // Get the testimonial by ID
    console.log(`\nGetting testimonial with ID ${testimonialId}...`);
    const getByIdResponse = await apiRequest(`/admin/testimonials/${testimonialId}`);
    console.log(`Status: ${getByIdResponse.status}`);
    console.log(`Testimonial name: ${getByIdResponse.data?.data?.testimonial?.name}`);
    
    // Update the testimonial
    console.log(`\nUpdating testimonial with ID ${testimonialId}...`);
    const updateResponse = await apiRequest(`/admin/testimonials/${testimonialId}`, 'PUT', {
      ...testTestimonial,
      content: 'This testimonial has been updated by the test script.'
    });
    console.log(`Status: ${updateResponse.status}`);
    console.log(`Updated testimonial content: ${updateResponse.data?.data?.testimonial?.content}`);
    
    // Delete the testimonial
    console.log(`\nDeleting testimonial with ID ${testimonialId}...`);
    const deleteResponse = await apiRequest(`/admin/testimonials/${testimonialId}`, 'DELETE');
    console.log(`Status: ${deleteResponse.status}`);
    console.log(`Delete message: ${deleteResponse.data?.message}`);
  }
}

// Test facilities
async function testFacilities() {
  console.log('\n--- Testing Facilities API ---');
  
  // Get all facilities
  console.log('\nGetting all facilities...');
  const getAllResponse = await apiRequest('/admin/facilities');
  console.log(`Status: ${getAllResponse.status}`);
  console.log(`Facilities count: ${getAllResponse.data?.data?.facilities?.length || 0}`);
  
  // Create a facility
  console.log('\nCreating a test facility...');
  const createResponse = await apiRequest('/admin/facilities', 'POST', testFacility);
  console.log(`Status: ${createResponse.status}`);
  console.log(`Created facility ID: ${createResponse.data?.data?.facility?.id}`);
  
  if (createResponse.status === 201 && createResponse.data?.data?.facility?.id) {
    const facilityId = createResponse.data.data.facility.id;
    
    // Get the facility by ID
    console.log(`\nGetting facility with ID ${facilityId}...`);
    const getByIdResponse = await apiRequest(`/admin/facilities/${facilityId}`);
    console.log(`Status: ${getByIdResponse.status}`);
    console.log(`Facility name: ${getByIdResponse.data?.data?.facility?.name}`);
    
    // Update the facility
    console.log(`\nUpdating facility with ID ${facilityId}...`);
    const updateResponse = await apiRequest(`/admin/facilities/${facilityId}`, 'PUT', {
      ...testFacility,
      description: 'This facility has been updated by the test script.'
    });
    console.log(`Status: ${updateResponse.status}`);
    console.log(`Updated facility description: ${updateResponse.data?.data?.facility?.description}`);
    
    // Delete the facility
    console.log(`\nDeleting facility with ID ${facilityId}...`);
    const deleteResponse = await apiRequest(`/admin/facilities/${facilityId}`, 'DELETE');
    console.log(`Status: ${deleteResponse.status}`);
    console.log(`Delete message: ${deleteResponse.data?.message}`);
  }
}

// Test gallery
async function testGallery() {
  console.log('\n--- Testing Gallery API ---');
  
  // Get all gallery images
  console.log('\nGetting all gallery images...');
  const getAllResponse = await apiRequest('/admin/gallery');
  console.log(`Status: ${getAllResponse.status}`);
  console.log(`Gallery images count: ${getAllResponse.data?.data?.images?.length || 0}`);
  
  // Create a gallery image
  console.log('\nCreating a test gallery image...');
  const createResponse = await apiRequest('/admin/gallery', 'POST', testGalleryImage);
  console.log(`Status: ${createResponse.status}`);
  console.log(`Created gallery image ID: ${createResponse.data?.data?.image?.id}`);
  
  if (createResponse.status === 201 && createResponse.data?.data?.image?.id) {
    const imageId = createResponse.data.data.image.id;
    
    // Get the gallery image by ID
    console.log(`\nGetting gallery image with ID ${imageId}...`);
    const getByIdResponse = await apiRequest(`/admin/gallery/${imageId}`);
    console.log(`Status: ${getByIdResponse.status}`);
    console.log(`Gallery image title: ${getByIdResponse.data?.data?.image?.title}`);
    
    // Update the gallery image
    console.log(`\nUpdating gallery image with ID ${imageId}...`);
    const updateResponse = await apiRequest(`/admin/gallery/${imageId}`, 'PUT', {
      ...testGalleryImage,
      description: 'This gallery image has been updated by the test script.'
    });
    console.log(`Status: ${updateResponse.status}`);
    console.log(`Updated gallery image description: ${updateResponse.data?.data?.image?.description}`);
    
    // Delete the gallery image
    console.log(`\nDeleting gallery image with ID ${imageId}...`);
    const deleteResponse = await apiRequest(`/admin/gallery/${imageId}`, 'DELETE');
    console.log(`Status: ${deleteResponse.status}`);
    console.log(`Delete message: ${deleteResponse.data?.message}`);
  }
}

// Run all tests
async function runTests() {
  console.log('Starting admin client tests...');
  
  // Check if server is running
  try {
    const healthResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    if (!healthResponse.ok) {
      console.error('Server is not running or health check failed. Please start the server first.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Server is not running. Please start the server first.');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  
  // Run tests
  await testTestimonials();
  await testFacilities();
  await testGallery();
  
  console.log('\nAll tests completed!');
}

// Run the tests
runTests();