# Development Setup Guide

This guide explains how to set up the Cricket Academy application for development and testing.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd cricket-web-ace-academy
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Development Environment

The project includes a `.env.development` file with test database credentials. These credentials point to a free MySQL database for development purposes.

### Development Database Credentials

```
Host: sql12.freesqldatabase.com
User: sql12694835
Password: Ej5Nt9Aqzm
Database: sql12694835
Port: 3306
```

> **Note**: These credentials are for development only. The free database has limited storage (5MB) and will be deleted after 30 days of inactivity.

## Step 4: Initialize the Development Database

Run the following command to set up the database schema and sample data:

```bash
npm run init:dev-db
```

This script will:
1. Connect to the development database
2. Create the necessary tables
3. Insert sample data for testing

## Step 5: Start the Development Server

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173.

## Step 6: Start the Backend Server (if needed)

If you need to run the backend server locally:

```bash
cd backend
npm install
npm run dev
```

The backend server will start at http://localhost:5000.

## Testing the Database Connection

When the application starts, it will automatically check the database connection. You can also manually test the connection by:

1. Opening the application in your browser
2. Navigating to the admin panel
3. Checking for any database connection errors

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify that the free database is still active (they expire after 30 days of inactivity)
2. Check if your network allows connections to external databases
3. Try using a different free database service if needed

### Creating a New Free Database

If the provided database has expired, you can create a new one:

1. Visit [Free SQL Database](https://www.freesqldatabase.com/)
2. Sign up for a free account
3. Create a new database
4. Update the credentials in `.env.development`
5. Run the initialization script again

## Additional Development Tools

- **Database Migration**: `npm run migrate:hostinger` (if you need to migrate data from Supabase)
- **Linting**: `npm run lint`
- **Building for Production**: `npm run build`
- **Building for Development**: `npm run build:dev`

## Switching Between Development and Production

- For development: Use the `.env.development` file
- For production: Use the `.env` file with your actual Hostinger credentials