# Cricket Academy Admin Panel - Subdomain Setup Guide

This guide provides step-by-step instructions for deploying the Cricket Academy admin panel on a subdomain (e.g., `admin.yourdomain.com`).

## Overview

The admin panel has been separated into a standalone application that can be deployed independently on a subdomain. This provides:

- **Better Security**: Isolated admin interface
- **Cleaner URLs**: `admin.yourdomain.com` instead of `yourdomain.com/admin`
- **Independent Scaling**: Admin panel can be scaled separately
- **Better Organization**: Clear separation between public and admin interfaces

## Prerequisites

- Domain name with DNS access
- Web hosting service (Vercel, Netlify, or traditional hosting)
- SSL certificate for the subdomain
- Access to the main website's backend API

## Step 1: DNS Configuration

### Option A: CNAME Record (Recommended)

Add a CNAME record in your DNS settings:

```
Type: CNAME
Name: admin
Value: yourdomain.com
TTL: 3600 (or default)
```

This will create `admin.yourdomain.com` pointing to your main domain.

### Option B: A Record

If you're hosting the admin panel on a different server:

```
Type: A
Name: admin
Value: [Your Server IP Address]
TTL: 3600 (or default)
```

## Step 2: Choose Your Deployment Platform

### Option 1: Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   cd admin-app
   git init
   git add .
   git commit -m "Initial admin app commit"
   git remote add origin https://github.com/yourusername/cricket-admin.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add your environment variables (see Environment Configuration section)

4. **Configure Custom Domain**:
   - Go to Project Settings → Domains
   - Add `admin.yourdomain.com`
   - Follow Vercel's DNS configuration instructions

### Option 2: Netlify

1. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository
   - Configure build settings:
     - **Build Command**: `npm run build`
     - **Publish Directory**: `dist`

2. **Set Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add your environment variables

3. **Configure Custom Domain**:
   - Go to Site Settings → Domain Management
   - Add custom domain: `admin.yourdomain.com`

### Option 3: Traditional Hosting

1. **Build the Application**:
   ```bash
   cd admin-app
   npm install
   npm run build
   ```

2. **Upload Files**:
   - Upload all contents of the `dist/` folder to your subdomain's web root
   - Ensure your web server is configured to serve SPAs correctly

3. **Configure Web Server**:
   - For Apache, create `.htaccess` file:
     ```apache
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
     ```
   - For Nginx, add to your server block:
     ```nginx
     location / {
         try_files $uri $uri/ /index.html;
     }
     ```

## Step 3: Environment Configuration

Create a `.env` file in the `admin-app` directory:

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

# API Configuration
VITE_API_BASE_URL=https://yourdomain.com/api
```

## Step 4: Backend API Configuration

### Update CORS Settings

The backend has been updated to allow requests from admin subdomains. Ensure your backend is running with the latest CORS configuration.

### Environment Variables for Backend

Add these to your backend `.env` file:

```env
# Frontend URLs (including admin subdomain)
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

## Step 5: SSL Certificate

### Automatic SSL (Vercel/Netlify)

Vercel and Netlify provide automatic SSL certificates for custom domains.

### Manual SSL Setup

If using traditional hosting:

1. **Let's Encrypt** (Free):
   ```bash
   sudo certbot --nginx -d admin.yourdomain.com
   ```

2. **Commercial SSL**: Purchase and install through your hosting provider

## Step 6: Testing

1. **Access the Admin Panel**:
   - Visit `https://admin.yourdomain.com`
   - You should see the admin login page

2. **Test Authentication**:
   - Use default credentials:
     - Email: `admin@kalyancricketacademy.com`
     - Password: `Admin@123456`

3. **Test API Connection**:
   - Check browser console for any CORS errors
   - Verify that admin functions work correctly

## Step 7: Security Hardening

### 1. Change Default Credentials

After first login, change the default admin password through the admin panel.

### 2. Enable Two-Factor Authentication

Consider implementing 2FA for additional security.

### 3. Rate Limiting

Ensure your backend has proper rate limiting for admin endpoints.

### 4. IP Whitelisting (Optional)

For additional security, you can whitelist specific IP addresses for admin access.

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check that your backend CORS configuration includes the admin subdomain
   - Verify the subdomain URL is correct in the CORS allowed origins

2. **SSL Certificate Issues**:
   - Ensure your SSL certificate is valid for the subdomain
   - Check that HTTPS is properly configured

3. **DNS Propagation**:
   - DNS changes can take up to 48 hours to propagate
   - Use tools like `nslookup` or `dig` to check DNS resolution

4. **Build Errors**:
   - Check that all dependencies are installed
   - Verify environment variables are set correctly
   - Check the build logs for specific error messages

### Debug Commands

```bash
# Check DNS resolution
nslookup admin.yourdomain.com

# Test SSL certificate
openssl s_client -connect admin.yourdomain.com:443 -servername admin.yourdomain.com

# Check CORS headers
curl -H "Origin: https://admin.yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://yourdomain.com/api/auth/login
```

## Maintenance

### Regular Updates

1. **Keep Dependencies Updated**:
   ```bash
   cd admin-app
   npm update
   ```

2. **Monitor Logs**: Check application logs for errors or security issues

3. **Backup Configuration**: Keep backups of your environment configuration

### Monitoring

Consider setting up monitoring for:
- Uptime monitoring
- Error tracking
- Performance monitoring
- Security monitoring

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Check the backend server logs
4. Contact the development team with specific error details

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 