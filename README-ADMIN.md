# Cricket Academy Admin Dashboard

This document provides instructions for setting up and using the admin dashboard for the Cricket Academy website.

## Overview

The admin dashboard allows you to manage various aspects of the website content, including:

- Gallery images
- Facilities
- Testimonials
- Programs
- Coaches
- Students
- Contact requests

## Setup Instructions

### 1. Supabase Setup

The admin dashboard uses Supabase as its backend. Follow these steps to set up Supabase:

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Set up the required tables using the SQL script in `src/scripts/setup-database.sql`
4. Create a storage bucket named `images` with the following folders:
   - `gallery/`
   - `facilities/`
   - `testimonials/`
5. Configure storage permissions to allow authenticated uploads

### 2. Environment Configuration

1. Create a `.env` file in the project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with the values from your Supabase project settings.

### 3. Admin User Setup

1. In your Supabase project, go to Authentication > Users
2. Create a new user with email and password
3. This user will be used to log in to the admin dashboard

## Using the Admin Dashboard

### Accessing the Dashboard

1. Start the development server:
   ```
   npm run dev
   ```
2. Navigate to `/admin` in your browser
3. Log in with the admin credentials you created

### Managing Gallery Images

The Gallery Management section allows you to:

- Upload new images with titles, descriptions, and categories
- View all uploaded images
- Filter images by category
- Delete images

To add a new image:
1. Click "Add New Image"
2. Fill in the title, description, and select a category
3. Upload an image file
4. Click "Upload Image"

### Managing Facilities

The Facilities Management section allows you to:

- Add new facilities with details, features, and status
- Edit existing facilities
- Delete facilities
- Filter facilities by status

To add a new facility:
1. Click "Add New Facility"
2. Fill in the name, description, and select a status
3. Add features (one per line)
4. Upload a facility image
5. Click "Add Facility"

### Managing Testimonials

The Testimonials Management section allows you to:

- Add new testimonials with ratings and profile images
- Mark testimonials as featured to display them prominently
- Edit and delete testimonials
- View all testimonials or only featured ones

To add a new testimonial:
1. Click "Add New Testimonial"
2. Fill in the name, role, and testimonial content
3. Set the rating and featured status
4. Upload a profile image
5. Click "Add Testimonial"

## Troubleshooting

### Connection Issues

If you're having trouble connecting to Supabase:

1. Check that your Supabase URL and API key are correct in the `.env` file
2. Ensure your Supabase project is active and not in maintenance mode
3. Verify that the database tables have been created
4. Check browser console for detailed error messages

### Image Upload Issues

If you're having trouble uploading images:

1. Ensure your Supabase storage buckets are properly configured
2. Check that the image file size is not too large (recommended: under 2MB)
3. Verify that the file format is supported (JPG, PNG, GIF)

### Authentication Issues

If you're having trouble logging in:

1. Make sure your Supabase URL and anon key are correct in the .env file
2. Check that your admin user has the correct permissions
3. Try clearing your browser cache and cookies

## Support

For additional help or to report issues, please contact the website administrator.