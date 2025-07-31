import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import programRoutes from './routes/programs';
import coachRoutes from './routes/coaches';
import contactRoutes from './routes/contacts';
import adminRoutes from './routes/adminRoutes';
import achievementsRoutes from './routes/achievements';
import checkDbRoutes from './routes/checkDb';

// Import middleware
import { enforceHTTPS } from './middleware/auth';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Trust proxy (important for rate limiting and getting real IP addresses)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// HTTPS enforcement in production
if (process.env.NODE_ENV === 'production') {
  app.use(enforceHTTPS);
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for certain IPs (e.g., internal services)
  skip: (req) => {
    const skipIPs = process.env.RATE_LIMIT_SKIP_IPS?.split(',') || [];
    return skipIPs.includes(req.ip || '');
  }
});

// Apply rate limiting to all routes
app.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.'
  },
  skipSuccessfulRequests: true
});

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002', // Added for admin-app
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'https://cricket-academy.com', // Add your production domain
      'https://admin.cricket-academy.com', // Admin subdomain
      'https://admin.kalyancricketacademy.com', // Alternative admin subdomain
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Check for subdomain patterns
      const domainPatterns = [
        /^https:\/\/admin\.(cricket-academy\.com|kalyancricketacademy\.com)$/,
        /^https:\/\/admin\.(localhost|127\.0\.0\.1):\d+$/,
      ];
      
      const isAllowedSubdomain = domainPatterns.some(pattern => pattern.test(origin));
      
      if (isAllowedSubdomain) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint (before auth middleware)
app.get('/health', async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Cricket Academy API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/check-db', checkDbRoutes);
app.use('/api/check-db/', checkDbRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Cricket Academy API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      programs: '/api/programs',
      coaches: '/api/coaches',
      contacts: '/api/contacts',
      admin: '/api/admin',
      achievements: '/api/achievements'
    },
    documentation: 'https://api-docs.cricket-academy.com', // Replace with actual docs URL
    support: 'support@kalyancricketacademy.com'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void => {
  console.error('Global error handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    if (field) {
      return res.status(400).json({
        status: 'fail',
        message: `${field?.charAt(0).toUpperCase() + field?.slice(1)} already exists`
      });
    }
    return res.status(400).json({
      status: 'fail',
      message: 'Duplicate key error'
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid ID format'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Token expired'
    });
  }

  // CORS error
  if (error.message && error.message.includes('CORS')) {
    return res.status(403).json({
      status: 'fail',
      message: 'CORS policy violation'
    });
  }

  // Default error response
  return res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Something went wrong',
    ...((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) && { stack: error.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

// Start server
const PORT = process.env.PORT || 5002; // Changed to 5002 to avoid conflict

let server: any;

const startServer = async () => {
  try {
    // Start server
    server = app.listen(PORT, () => {
      console.log('🚀 Cricket Academy API Server Started');
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log(`💊 Health check: http://localhost:${PORT}/health`);
      
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
        console.log('\n🔐 Test Credentials:');
        console.log('📧 Email: admin@kalyancricketacademy.com');
        console.log('🔑 Password: Admin@123456');
      }
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

      if (error.code === 'EACCES') {
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
      } else if (error.code === 'EADDRINUSE') {
        console.error(`${bind} is already in use`);
        process.exit(1);
      } else {
        throw error;
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;