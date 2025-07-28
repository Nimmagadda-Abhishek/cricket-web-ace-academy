# Cricket Academy Web Application Deployment Guide

This guide provides instructions for deploying the Cricket Academy web application to a production environment.

## Prerequisites

- Node.js (v16 or higher)
- MySQL database (Hostinger or similar)
- Web hosting service (Hostinger, Vercel, Netlify, etc.)

## Deployment Steps

### 1. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Hostinger Database Configuration
VITE_DB_HOST=your_hostinger_db_host
VITE_DB_USER=your_hostinger_db_username
VITE_DB_PASSWORD=your_hostinger_db_password
VITE_DB_NAME=your_hostinger_db_name
VITE_DB_PORT=3306

# Disable Supabase
VITE_USE_SUPABASE=false
```

Replace the placeholder values with your actual database credentials.

### 2. Set Up the Database

1. Create a MySQL database on your hosting provider.
2. Run the database setup script:

```bash
npm run check:db
```

This will check if all required tables exist and create any missing tables.

### 3. Build the Application

Run the production build script:

```bash
npm run build:prod
```

This will:
- Check the database tables
- Build the frontend
- Prepare the server for production
- Create a production-ready `dist` folder

### 4. Deploy to Hosting Provider

#### Option 1: Hostinger or Similar Shared Hosting

1. Upload the contents of the `dist` folder to your hosting provider's web root directory.
2. Set up a Node.js environment if required by your hosting provider.
3. Install dependencies:

```bash
cd /path/to/web/root
npm install
```

4. Start the server:

```bash
npm start
```

#### Option 2: Vercel (Frontend Only)

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Set up the environment variables in the Vercel dashboard.
5. Deploy the application.

#### Option 3: Separate Frontend and Backend Deployment

**Frontend:**
1. Build the frontend:

```bash
npm run build
```

2. Upload the contents of the `dist` folder to your static hosting provider.

**Backend:**
1. Upload the `server` folder to your Node.js hosting provider.
2. Install dependencies:

```bash
npm install express cors multer dotenv mysql2
```

3. Start the server:

```bash
node fixed-server.js
```

### 5. Configure Domain and SSL

1. Set up your domain to point to your hosting provider.
2. Configure SSL certificates for secure HTTPS connections.

### 6. Test the Deployment

1. Visit your website to ensure it loads correctly.
2. Test the admin login functionality.
3. Verify that all features are working as expected.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify your database credentials in the `.env` file.
2. Check if your hosting provider allows external database connections.
3. Ensure your database user has the necessary permissions.

### Server Not Starting

If the server fails to start:

1. Check the server logs for error messages.
2. Verify that all required dependencies are installed.
3. Ensure the server port is available and not blocked by a firewall.

### Admin Dashboard Not Working

If the admin dashboard is not working:

1. Check if you can log in with the default credentials:
   - Email: `admin@kalyancricketacademy.com`
   - Password: `Admin@123456`
2. Verify that the admin API endpoints are accessible.
3. Check the browser console for any error messages.

## Maintenance

### Updating the Application

To update the application:

1. Pull the latest changes from the repository.
2. Run the build script:

```bash
npm run build:prod
```

3. Upload the updated files to your hosting provider.

### Database Backups

Regularly back up your database to prevent data loss:

1. Use your hosting provider's backup tools.
2. Set up automated backups if available.
3. Store backups in a secure location.

## Security Considerations

1. Keep your environment variables secure and never commit them to version control.
2. Regularly update dependencies to patch security vulnerabilities.
3. Use strong passwords for admin accounts.
4. Implement rate limiting to prevent brute force attacks.
5. Configure CORS settings to restrict access to trusted domains.

## Support

If you encounter any issues during deployment, please contact the development team for assistance.