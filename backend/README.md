# Cricket Academy Backend API

A comprehensive MongoDB-based backend API for managing cricket academy operations including students, programs, coaches, and communications.

## 🚀 Features

- **Student Management**: Complete student lifecycle management with enrollment, progress tracking, and payment history
- **Program Management**: Cricket programs with different categories, levels, and scheduling
- **Coach Management**: Coach profiles, specializations, availability, and performance ratings
- **Contact Management**: Inquiry handling, response tracking, and communication management
- **Authentication & Authorization**: Role-based access control with JWT tokens
- **Real-time Data**: MongoDB integration with complex queries and aggregations
- **Security**: Rate limiting, CORS, helmet security, input validation
- **Comprehensive Logging**: Activity tracking and audit trails

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone and Navigate
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/cricket-academy?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random-123456789
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Academy Information
ACADEMY_NAME=Kalyan Cricket Academy
ACADEMY_EMAIL=info@kalyancricketacademy.com
ACADEMY_PHONE=+91-98765-43210
```

### 4. MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Get your connection string
6. Update `MONGODB_URI` in `.env`

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/cricket-academy`

### 5. Build TypeScript
```bash
npm run build
```

### 6. Seed Database (Optional)
```bash
npm run seed
```

This will create sample data including:
- Admin users with different roles
- Cricket coaches with specializations
- Training programs
- Sample students
- Contact inquiries

### 7. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## 🔐 Default Login Credentials

After seeding, you can use these credentials:

**Super Admin:**
- Email: `admin@kalyancricketacademy.com`
- Password: `Admin@123456`

**Manager:**
- Email: `manager@kalyancricketacademy.com`
- Password: `Manager@123`

**Staff:**
- Email: `staff@kalyancricketacademy.com`
- Password: `Staff@123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password

### Students
- `GET /api/students` - Get all students (with filters)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/stats/overview` - Get student statistics
- `POST /api/students/:id/payments` - Add payment record
- `GET /api/students/export/data` - Export students data

### Programs
- `GET /api/programs/public` - Get public programs (no auth)
- `GET /api/programs` - Get all programs (with filters)
- `GET /api/programs/:id` - Get program by ID
- `POST /api/programs` - Create new program
- `PUT /api/programs/:id` - Update program
- `DELETE /api/programs/:id` - Delete program
- `GET /api/programs/stats/overview` - Get program statistics
- `GET /api/programs/available/enrollment` - Get available programs
- `POST /api/programs/:id/duplicate` - Duplicate program

### Coaches
- `GET /api/coaches/public` - Get public coaches (no auth)
- `GET /api/coaches` - Get all coaches (with filters)
- `GET /api/coaches/:id` - Get coach by ID
- `POST /api/coaches` - Create new coach
- `PUT /api/coaches/:id` - Update coach
- `DELETE /api/coaches/:id` - Delete coach
- `GET /api/coaches/stats/overview` - Get coach statistics
- `GET /api/coaches/available/assignment` - Get available coaches
- `POST /api/coaches/:id/reviews` - Add coach review
- `GET /api/coaches/:id/schedule` - Get coach schedule
- `PUT /api/coaches/:id/availability` - Update availability

### Contacts
- `POST /api/contacts/public` - Create contact (no auth)
- `GET /api/contacts` - Get all contacts (with filters)
- `GET /api/contacts/:id` - Get contact by ID
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Archive contact
- `POST /api/contacts/:id/responses` - Add response
- `PUT /api/contacts/:id/assign` - Assign to admin
- `PUT /api/contacts/:id/follow-up` - Set follow-up date
- `PUT /api/contacts/:id/close` - Close contact
- `GET /api/contacts/stats/overview` - Get contact statistics
- `POST /api/contacts/bulk/actions` - Bulk operations

### Health Check
- `GET /health` - Server health status
- `GET /api` - API information

## 🏗️ Database Schema

### Collections:
- **admins** - Admin users with roles and permissions
- **students** - Student profiles, enrollment, and payment history
- **programs** - Cricket programs with schedules and pricing
- **coaches** - Coach profiles, specializations, and ratings
- **contacts** - Customer inquiries and communications

### Key Features:
- **Relationships**: Proper MongoDB references between collections
- **Validation**: Comprehensive data validation with Mongoose schemas
- **Indexing**: Optimized queries with strategic indexes
- **Aggregation**: Complex statistical queries and reporting
- **Soft Deletes**: Data preservation with isActive flags

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permission levels (super-admin, admin, manager, staff)
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Controlled cross-origin requests
- **Input Validation**: Comprehensive request validation
- **Password Security**: Bcrypt hashing with salt rounds
- **Activity Logging**: User action tracking and audit trails

## 🛡️ Error Handling

- **Global Error Handler**: Centralized error processing
- **Validation Errors**: User-friendly validation messages
- **Database Errors**: Mongoose error handling
- **Authentication Errors**: JWT and auth-specific errors
- **Rate Limit Errors**: Clear rate limiting messages

## 📊 Performance Features

- **Database Indexing**: Optimized query performance
- **Pagination**: Efficient data loading for large datasets
- **Aggregation Pipelines**: Complex statistical calculations
- **Lean Queries**: Memory-efficient data retrieval
- **Connection Pooling**: MongoDB connection optimization

## 🚀 Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-domain.com
```

### Build and Start:
```bash
npm run build
npm start
```

## 📝 Development

### Available Scripts:
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Populate database with sample data

### File Structure:
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── models/
│   │   ├── Admin.ts
│   │   ├── Student.ts
│   │   ├── Program.ts
│   │   ├── Coach.ts
│   │   └── Contact.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── students.ts
│   │   ├── programs.ts
│   │   ├── coaches.ts
│   │   └── contacts.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── utils/
│   │   └── seed.ts
│   └── server.ts
├── dist/ (generated)
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check MONGODB_URI in .env
   - Verify MongoDB Atlas IP whitelist
   - Ensure database user has proper permissions

2. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

3. **CORS Issues**
   - Update FRONTEND_URL in .env
   - Check allowed origins in server.ts
   - Verify request headers

4. **Port Already in Use**
   - Change PORT in .env
   - Kill existing process: `lsof -ti:5000 | xargs kill -9`

## 📞 Support

For support and questions:
- Email: support@kalyancricketacademy.com
- Documentation: Check API endpoints above
- Issues: Create GitHub issues for bugs

## 📄 License

MIT License - see LICENSE file for details.