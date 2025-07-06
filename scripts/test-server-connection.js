/**
 * Simple script to test if the server is running
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testConnection() {
  try {
    console.log(`Testing connection to ${BASE_URL}/health...`);
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('Response:', data);
    console.log('Server is running!');
  } catch (error) {
    console.error('Error connecting to server:', error);
  }
}

testConnection();