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
   # Database Configuration (for Hostinger)
   VITE_DB_HOST=your_hostinger_db_host
   VITE_DB_USER=your_db_username
   VITE_DB_PASSWORD=your_db_password
   VITE_DB_NAME=your_db_name
   VITE_DB_PORT=3306
   ```

3. Start the development server:
   ```