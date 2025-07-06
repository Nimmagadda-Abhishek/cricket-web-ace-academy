# Admin Dashboard Setup and Usage Guide

This guide explains how to set up and use the admin dashboard for managing the Cricket Academy website content.

## Features

The admin dashboard allows you to:

1. **Manage Gallery Images**
   - Upload new images with titles, descriptions, and categories
   - View, edit, and delete existing images
   - Filter images by category

2. **Manage Facilities**
   - Add new facilities with details, features, and status
   - Edit and update existing facilities
   - Delete facilities
   - Filter facilities by status (Available, Under Maintenance, Upcoming)

3. **Manage Testimonials**
   - Add new testimonials with ratings and profile images
   - Mark testimonials as featured to display them prominently
   - Edit and delete testimonials
   - View all testimonials or only featured ones

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Set up the required tables using the SQL script in `src/scripts/setup-database.sql`
3. Create a storage bucket named `images` with the following folders:
   - `gallery/`
   - `facilities/`
   - `testimonials/`
4. Configure storage permissions to allow authenticated uploads

### 2. Environment Configuration

1. Update your `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Admin Authentication

1. Create an admin user in your Supabase authentication system
2. Use this account to log in to the admin dashboard

## Using the Admin Dashboard

### Accessing the Dashboard

1. Navigate to `/admin` in your browser
2. Log in with your admin credentials

### Managing Gallery Images

1. Go to the "Gallery" section in the admin dashboard
2. Click "Add New Image" to upload a new image
3. Fill in the required details:
   - Title
   - Description (optional)
   - Category (General, Training, Matches, Events, Facilities)
   - Upload an image file
4. Click "Upload Image" to save
5. To edit or delete an image, use the options available on each image card

### Managing Facilities

1. Go to the "Facilities" section in the admin dashboard
2. Click "Add New Facility" to create a new facility
3. Fill in the required details:
   - Facility Name
   - Description
   - Status (Available, Under Maintenance, Coming Soon)
   - Features (add as many as needed)
   - Upload a facility image
4. Click "Add Facility" to save
5. To edit a facility, click the "Edit" button on the facility card
6. To view details or delete a facility, use the options on each facility card

### Managing Testimonials

1. Go to the "Testimonials" section in the admin dashboard
2. Click "Add New Testimonial" to create a new testimonial
3. Fill in the required details:
   - Name
   - Role/Position
   - Testimonial Content
   - Rating (1-5 stars)
   - Featured status
   - Upload a profile image
4. Click "Add Testimonial" to save
5. To feature/unfeature a testimonial, use the toggle switch
6. To edit or delete a testimonial, use the options on each testimonial card

## Troubleshooting

### Image Upload Issues

- Ensure your Supabase storage buckets are properly configured
- Check that the image file size is not too large (recommended: under 2MB)
- Verify that the file format is supported (JPG, PNG, GIF)

### Authentication Issues

- Make sure your Supabase URL and anon key are correct in the .env file
- Check that your admin user has the correct permissions
- Try clearing your browser cache and cookies

### Content Not Appearing on Website

- Verify that the content was successfully saved to the database
- Check that the dynamic components are properly connected to the database
- Ensure that the RLS policies are correctly set up to allow public read access

## Support

For additional help or to report issues, please contact the website administrator.