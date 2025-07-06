// server/index.js
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import achievementsRoutes from './routes/achievements.js';

// Load environment variables
dotenv.config();

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Set up error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Keep the server running despite the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  // Keep the server running despite the error
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://kalyancricketacademy.com', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the public directory
const publicPath = join(__dirname, '..', 'public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}
app.use(express.static(publicPath));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the folder from the request body or use 'uploads' as default
    const folder = req.body.folder || 'uploads';
    const uploadPath = join(publicPath, 'uploads', folder);
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    console.log(`Uploading to: ${uploadPath}`);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Get original filename and sanitize it
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
    const ext = originalName.split('.').pop();
    const filename = `${uniqueSuffix}.${ext}`;
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer with storage and file filter
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Route for file uploads
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: err.message || 'Error uploading file' });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Get the folder from the request body or use 'uploads' as default
      const folder = req.body.folder || 'uploads';
      
      // Create the URL for the uploaded file
      const fileUrl = `/uploads/${folder}/${req.file.filename}`;
      console.log(`File uploaded successfully: ${fileUrl}`);
      
      // Return the URL of the uploaded file
      res.json({
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      res.status(500).json({ error: 'Failed to process uploaded file' });
    }
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/achievements', achievementsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  res.json({ 
    status: 'success', 
    message: 'Cricket Academy API is running',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Database connection check endpoint
app.get('/api/check-db', async (req, res) => {
  try {
    // Import mysql2 dynamically
    const mysql = await import('mysql2/promise');
    
    // Database configuration
    const dbConfig = {
      host: process.env.VITE_DB_HOST,
      user: process.env.VITE_DB_USER,
      password: process.env.VITE_DB_PASSWORD,
      database: process.env.VITE_DB_NAME,
      port: process.env.VITE_DB_PORT || 3306
    };
    
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    
    // Test the connection
    await connection.query('SELECT 1');
    
    // Close the connection
    await connection.end();
    
    res.json({
      status: 'success',
      message: 'Database connection successful',
      dbConfig: {
        host: dbConfig.host,
        database: dbConfig.database,
        user: dbConfig.user,
        port: dbConfig.port
      }
    });
  } catch (error) {
    console.error('Database connection check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;