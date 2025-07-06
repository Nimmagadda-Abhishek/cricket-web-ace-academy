# Hostinger Database Setup Guide

This guide explains how to set up and configure the Hostinger MySQL database for the Cricket Academy application.

## Prerequisites

- A Hostinger hosting account with MySQL database access
- MySQL client or phpMyAdmin access
- Basic knowledge of SQL and database management

## Step 1: Create a MySQL Database in Hostinger

1. Log in to your Hostinger control panel
2. Navigate to the "Databases" section
3. Click "Create a new database"
4. Enter a name for your database (e.g., `cricket_academy`)
5. Create a database user with a strong password
6. Assign all privileges to the user for the database
7. Note down the database name, username, password, and host

## Step 2: Import the Database Schema

### Option 1: Using phpMyAdmin

1. In your Hostinger control panel, open phpMyAdmin for your database
2. Select your database from the left sidebar
3. Go to the "Import" tab
4. Click "Choose File" and select the `scripts/hostinger-schema.sql` file
5. Click "Go" to import the schema

### Option 2: Using MySQL Command Line

```bash
mysql -h your_hostinger_db_host -u your_username -p your_database_name < scripts/hostinger-schema.sql
```

When prompted, enter your database password.

## Step 3: Configure Environment Variables

1. Open the `.env` file in the project root
2. Update the following variables with your Hostinger database credentials:

```
VITE_DB_HOST=your_hostinger_db_host
VITE_DB_USER=your_hostinger_db_username
VITE_DB_PASSWORD=your_hostinger_db_password
VITE_DB_NAME=your_hostinger_db_name
VITE_DB_PORT=3306

# Set this to false to use Hostinger instead of Supabase
VITE_USE_SUPABASE=false
```

### Development Credentials for Testing

For development and testing purposes, you can use the following free database credentials:

```
VITE_DB_HOST=sql12.freesqldatabase.com
VITE_DB_USER=sql12694835
VITE_DB_PASSWORD=Ej5Nt9Aqzm
VITE_DB_NAME=sql12694835
VITE_DB_PORT=3306
```

These credentials are connected to a free MySQL database hosted on freesqldatabase.com. Note that:
- This database has limited storage (5MB)
- It may be slower than a production database
- The database will be deleted after 30 days of inactivity
- It's intended for testing only, not for production use

## Step 4: Migrate Data (Optional)

If you have existing data in Supabase that you want to migrate to Hostinger:

1. Make sure both your Supabase and Hostinger credentials are in the `.env` file
2. Run the migration script:

```bash
node scripts/migrate-to-hostinger.js
```

## Step 5: Test the Connection

1. Start the application:

```bash
npm run dev
```

2. Navigate to the admin panel
3. If you see a database connection error, check your credentials in the `.env` file

## Troubleshooting

### Connection Issues

- Verify that your Hostinger database allows remote connections
- Check if your IP address is whitelisted in Hostinger's database settings
- Ensure the database user has the correct permissions

### Data Migration Issues

- Check if the schema in Hostinger matches the expected structure
- Verify that your Supabase service key has the necessary permissions
- For large datasets, consider migrating tables individually

## Database Schema

The application uses the following tables:

- `users`: Authentication and user management
- `students`: Student profiles and information
- `coaches`: Coach profiles and information
- `programs`: Training programs and courses
- `contacts`: Contact form submissions
- `enrollments`: Program enrollments and payments

For the complete schema, refer to the `scripts/hostinger-schema.sql` file.

## Backup and Maintenance

Regularly backup your Hostinger database using:

1. phpMyAdmin export feature
2. Hostinger's built-in backup tools
3. Scheduled database dumps using cron jobs

## Support

For additional help, contact:
- Technical support: support@kalyancricketacademy.com
- Database administrator: admin@kalyancricketacademy.com