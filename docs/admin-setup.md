# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard for the Kalyan Cricket Academy website.

## Database Setup

The admin dashboard uses a MySQL database hosted on Hostinger. Follow these steps to set up the database:

1. Log in to your Hostinger account and access the MySQL Databases section.
2. Create a new database and user with appropriate permissions.
3. Run the SQL script located at `src/scripts/setup-hostinger.sql` to create the necessary tables and sample data.

## Environment Configuration

1. Create or update the `.env` file in the project root with the following variables:

```
# Hostinger Database Configuration
VITE_DB_HOST=your-hostinger-db-host
VITE_DB_USER=your-db-username
VITE_DB_PASSWORD=your-db-password
VITE_DB_NAME=your-db-name
VITE_DB_PORT=3306

# Disable Supabase
VITE_USE_SUPABASE=false
```

2. Replace the placeholder values with your actual Hostinger database credentials.

## Image Upload Configuration

For image uploads to work properly, you need to set up an API endpoint to handle file uploads. The admin dashboard is configured to use `/api/upload` for this purpose.

### Option 1: Set up a Node.js backend

1. Create a simple Express server with multer for file uploads.
2. Configure it to save uploaded files to a directory and return the URL.
3. Make sure the server is running when you use the admin dashboard.

### Option 2: Use a third-party service

You can use services like Cloudinary, Imgix, or Firebase Storage for image uploads.

## Accessing the Admin Dashboard

1. Start the development server:
   ```
   npm run dev
   ```

2. Navigate to `/admin` in your browser.

3. Log in with the following credentials:
   - Email: `admin@kalyancricketacademy.com`
   - Password: `Admin@123456`

## Using the Admin Dashboard

### Managing Testimonials

1. Go to the Testimonials section in the admin dashboard.
2. Add new testimonials with name, role, content, rating, and image.
3. Edit or delete existing testimonials.
4. Toggle the "Featured" status to show testimonials on the homepage.

### Managing Facilities

1. Go to the Facilities section in the admin dashboard.
2. Add new facilities with name, description, features, status, and image.
3. Edit or delete existing facilities.
4. Set the status (Available, Under Maintenance, or Upcoming) for each facility.

### Managing Gallery

1. Go to the Gallery section in the admin dashboard.
2. Upload new images with title, description, and category.
3. Delete existing images.
4. Filter images by category.

## Troubleshooting

- If you encounter database connection issues, check your database credentials in the `.env` file.
- For image upload problems, check the network tab in your browser's developer tools to see the response from the upload endpoint.
- If the admin dashboard is not loading, make sure the development server is running and check the console for errors.

## Security Considerations

- The admin dashboard uses a simple authentication mechanism for development purposes.
- For production, implement a more secure authentication system with JWT tokens and proper user management.
- Secure your API endpoints with proper authentication and authorization.
- Consider implementing rate limiting and other security measures to prevent abuse.