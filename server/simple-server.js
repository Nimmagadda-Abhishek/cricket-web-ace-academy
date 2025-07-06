// server/simple-server.js
// A simple Express server for testing

import express from 'express';
import cors from 'cors';

// Create Express app
const app = express();
const PORT = 5001; // Use a different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Simple test server is running',
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple test server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});