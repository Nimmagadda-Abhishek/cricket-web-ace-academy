# Cricket Academy Admin Dashboard

This is the standalone admin dashboard application for the Cricket Academy website, designed to be deployed on a subdomain.

## Features

- **Secure Authentication**: Admin login with role-based access control
- **Dashboard**: Overview of academy statistics and recent activities
- **Student Management**: Add, edit, and manage student records
- **Program Management**: Create and manage cricket programs
- **Coach Management**: Manage coach profiles and assignments
- **Facilities Management**: Track and manage academy facilities
- **Gallery Management**: Upload and organize gallery images
- **Testimonials Management**: Manage student and parent testimonials
- **Contact Management**: Handle contact form submissions
- **Settings**: Configure academy settings and preferences

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Access to the main website's backend API

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your configuration:
   ```env
   # Database Configuration (if using Hostinger)
   VITE_DB_HOST=your_hostinger_db_host
   VITE_DB_USER=your_db_username
   VITE_DB_PASSWORD=your_db_password
   VITE_DB_NAME=your_db_name
   VITE_DB_PORT=3306

   # Supabase Configuration (if using Supabase)
   VITE_USE_SUPABASE=false
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Development

### Default Admin Credentials

For development, you can use these credentials:
- **Email**: `admin@kalyancricketacademy.com`
- **Password**: `Admin@123456`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Subdomain Setup

This admin app is designed to be deployed on a subdomain (e.g., `admin.yourdomain.com`).

#### Option 1: Vercel Deployment

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Set up environment variables in Vercel dashboard
5. Configure custom domain/subdomain in Vercel

#### Option 2: Netlify Deployment

1. Push your code to a GitHub repository
2. Connect your repository to Netlify
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Set up environment variables in Netlify dashboard
5. Configure custom domain/subdomain in Netlify

#### Option 3: Traditional Hosting

1. Build the application:
   ```bash
   npm run build
   ```
2. Upload the contents of the `dist` folder to your subdomain's web root
3. Configure your web server to serve the SPA correctly

### DNS Configuration

1. Add a CNAME record for your subdomain:
   ```
   admin.yourdomain.com CNAME yourdomain.com
   ```
2. Or add an A record pointing to your server's IP address

### SSL Certificate

Ensure your subdomain has a valid SSL certificate for secure access.

## Security Considerations

1. **Environment Variables**: Never commit sensitive information to version control
2. **CORS Configuration**: Ensure your backend API allows requests from the admin subdomain
3. **Rate Limiting**: Implement rate limiting on login attempts
4. **Session Management**: Use secure session tokens with appropriate expiration
5. **HTTPS Only**: Always use HTTPS in production

## API Integration

The admin app connects to the main website's backend API. Ensure the API endpoints are accessible from the subdomain and CORS is properly configured.

### Required API Endpoints

- `POST /api/auth/login` - Admin authentication
- `POST /api/auth/logout` - Admin logout
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/students` - Student management
- `GET /api/admin/programs` - Program management
- `GET /api/admin/coaches` - Coach management
- `GET /api/admin/facilities` - Facilities management
- `GET /api/admin/gallery` - Gallery management
- `GET /api/admin/testimonials` - Testimonials management
- `GET /api/admin/contacts` - Contact management

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend API allows requests from the admin subdomain
2. **Authentication Issues**: Check that the API endpoints are accessible and properly configured
3. **Build Errors**: Verify all dependencies are installed and environment variables are set
4. **Deployment Issues**: Check that the build output is correctly served by your web server

### Support

For technical support, please contact the development team or refer to the main project documentation. 