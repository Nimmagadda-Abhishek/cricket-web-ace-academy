import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase, initializeDatabase } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import programRoutes from './routes/programs.js';
import coachRoutes from './routes/coaches.js';
import studentRoutes from './routes/students.js';
import bookingRoutes from './routes/bookings.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contact.js';
import uploadRoutes from './routes/upload.js';
import facilitiesRoutes from './routes/facilities.js';
import achievementsRoutes from './routes/achievements.js';
import galleryRoutes from './routes/gallery.js';
import settingsRoutes from './routes/settings.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - Allow all origins
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow all origins - you can customize this to whitelist specific origins
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle OPTIONS preflight requests explicitly
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use(limiter);

// Compression and parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cricket Academy API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      programs: '/api/programs',
      coaches: '/api/coaches',
      students: '/api/students',
      bookings: '/api/bookings',
      testimonials: '/api/testimonials',
      contact: '/api/contact',
      upload: '/api/upload',
      facilities: '/api/facilities',
      achievements: '/api/achievements',
      gallery: '/api/gallery',
      settings: '/api/settings'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files uploaded'
    });
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed'
    });
  }

  // CORS errors
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Origin not allowed'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const isConnected = await connectDatabase();
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();

    // Start listening
    app.listen(PORT, () => {
      console.log('\n🚀 Cricket Academy API Server Started Successfully!');
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API documentation: http://localhost:${PORT}/`);
      console.log('\n🔧 Available endpoints:');
      console.log('  • POST /api/auth/login - Admin login');
      console.log('  • GET  /api/programs - Get programs');
      console.log('  • GET  /api/coaches - Get coaches');
      console.log('  • POST /api/contact - Submit contact form');
      console.log('  • POST /api/students - Student registration');
      console.log('  • POST /api/bookings - Create booking');
      console.log('  • GET  /api/testimonials - Get testimonials');
      console.log('\n✅ Server ready to handle requests!\n');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Server terminated');
  process.exit(0);
});

// Start the server
startServer();
