# Cricket Web Ace Academy - Full Stack Application

A complete cricket academy management system with frontend website, admin dashboard, and backend API.

## 🏗️ Architecture

- **Backend**: Express.js + TypeScript + MySQL
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Admin Dashboard**: React + TypeScript + Vite + Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)
- Git

### 1. Clone and Setup

```bash
git clone <repository-url>
cd cricket-web-ace-academy
```

### 2. Database Setup

1. Install and start MySQL server
2. Create a database named `cricket_academy`
3. Update database credentials in `backend/.env`

### 3. Start Development Environment

**Windows:**
```bash
./start-dev.bat
```

**Manual Start:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Terminal 3 - Admin Dashboard
cd cricket-admin-dash
npm install
npm run dev
```

## 📍 Access URLs

- **Frontend Website**: https://kalyancricketacademy.in/
- **Admin Dashboard**: http://localhost:4173  
- **Backend API**: https://cricket-web-ace-academy.onrender.com/api
- **API Documentation**: https://cricket-web-ace-academy.onrender.com/

## 🔑 Default Admin Login

- **Username**: `admin`
- **Password**: `password`

## 📁 Project Structure

```
cricket-web-ace-academy/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   ├── config/          # Database config
│   │   └── utils/           # Helper functions
│   ├── uploads/             # File storage
│   └── package.json
├── frontend/                # Public website
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # API client
│   │   └── hooks/           # Custom hooks
│   └── package.json
├── cricket-admin-dash/      # Admin dashboard
│   ├── src/
│   │   ├── components/      # Admin components
│   │   ├── pages/           # Admin pages
│   │   └── lib/             # Admin API client
│   └── package.json
├── start-dev.bat           # Development startup
├── build-all.bat           # Production build
└── README.md
```

## 🛠️ Development

### Backend Development

The backend provides a complete REST API with:

- **Authentication**: JWT-based admin authentication
- **Programs**: CRUD operations for cricket programs
- **Coaches**: Manage coaching staff
- **Students**: Student registration and management
- **Bookings**: Class booking system
- **Testimonials**: Customer testimonials
- **Contact**: Contact form handling
- **File Upload**: Image upload functionality

**API Endpoints:**
- `POST /api/auth/login` - Admin login
- `GET /api/programs` - Get programs (public)
- `GET /api/coaches` - Get coaches (public)  
- `POST /api/students` - Student registration (public)
- `POST /api/bookings` - Create booking (public)
- `POST /api/contact` - Submit contact form (public)
- `GET /api/testimonials` - Get testimonials (public)

### Frontend Development

The public website includes:

- **Home Page**: Hero section, features, testimonials
- **Programs**: Browse available cricket programs
- **Coaches**: Meet the coaching staff
- **About**: Academy information
- **Contact**: Contact form
- **Registration**: Student registration form
- **Booking**: Class booking system

### Admin Dashboard Development

The admin dashboard provides:

- **Dashboard**: Overview statistics
- **Programs Management**: Add/edit/delete programs
- **Coaches Management**: Manage coaching staff
- **Students Management**: View and manage students
- **Bookings Management**: View and manage bookings
- **Testimonials**: Approve and manage testimonials
- **Messages**: View and respond to contact messages
- **File Upload**: Image management

## 🗄️ Database Schema

The system uses MySQL with the following main tables:

- `admin_users` - Admin authentication
- `programs` - Cricket programs
- `coaches` - Coaching staff
- `students` - Student records
- `bookings` - Class bookings
- `testimonials` - Customer reviews
- `contact_messages` - Contact form submissions
- `settings` - System configuration

## 🔒 Authentication & Security

- **JWT Authentication**: Secure admin login
- **Role-based Access**: Super admin and admin roles  
- **Input Validation**: Comprehensive data validation
- **File Upload Security**: Image-only uploads with size limits
- **CORS Protection**: Configurable CORS origins
- **Rate Limiting**: API request rate limiting
- **SQL Injection Prevention**: Parameterized queries

## 🚀 Production Deployment

### Build for Production

```bash
./build-all.bat
```

### Deploy

1. **Database**: Set up production MySQL database
2. **Backend**: Deploy to your server (e.g., DigitalOcean, AWS)
   ```bash
   cd backend
   npm install --production
   npm start
   ```
3. **Frontend**: Deploy static files (e.g., Vercel, Netlify)
   ```bash
   # Frontend dist/ folder
   # Admin dashboard dist/ folder
   ```

### Environment Variables

**Backend (.env):**
```env
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=cricket_academy  
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secure-secret
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-api-domain.com/api
```

**Admin Dashboard (.env):**
```env  
VITE_API_URL=https://your-api-domain.com/api
```

## 🧪 Testing

### API Testing

Test the backend API:

```bash
cd backend
npm test  # If tests are implemented
```

Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl https://cricket-web-ace-academy.onrender.com/health

# Get programs
curl https://cricket-web-ace-academy.onrender.com/api/programs

# Admin login
curl -X POST https://cricket-web-ace-academy.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

## 📈 Monitoring & Logs

- Backend logs to console in development
- Check browser developer tools for frontend issues
- Monitor API responses and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the console logs
2. Verify database connection
3. Ensure all services are running
4. Check environment variables

## 🔄 Updates

To update dependencies:

```bash
# Backend
cd backend && npm update

# Frontend  
cd frontend && npm update

# Admin Dashboard
cd cricket-admin-dash && npm update
```

---

**Happy Coding! 🏏**
