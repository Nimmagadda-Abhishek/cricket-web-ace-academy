# 🏏 Cricket Academy Database Management Guide

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```
Server will run on: https://cricket-web-ace-academy.onrender.com

### 2. Access Admin Dashboard
Open `backend/admin-dashboard.html` in your browser
- **Username:** admin
- **Password:** admin

---

## 📊 Database Operations

### GET DATA FROM DATABASE

#### Using PowerShell/API:
```powershell
# Get Programs (Public)
$response = Invoke-WebRequest -Uri "https://cricket-web-ace-academy.onrender.com/api/programs"
$data = $response.Content | ConvertFrom-Json

# Get Students (Requires Admin Token)
$headers = @{ "Authorization" = "Bearer YOUR_TOKEN_HERE" }
$response = Invoke-WebRequest -Uri "https://cricket-web-ace-academy.onrender.com/api/students" -Headers $headers
```

#### Using Command Line Scripts:
```bash
# Get database statistics
npm run db-script stats

# Get all data from a table
npm run db-script get students
npm run db-script get programs
npm run db-script get coaches
```

### UPLOAD DATA TO DATABASE

#### Method 1: Student Registration (Public API)
```powershell
$studentData = @{
    name = "John Doe"
    email = "john@email.com"
    phone = "1234567890"
    parent_name = "Jane Doe"
    parent_phone = "1234567891"
    address = "123 Main St"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://cricket-web-ace-academy.onrender.com/api/students" -Method POST -Body $studentData -Headers @{"Content-Type"="application/json"}
```

#### Method 2: Bulk Upload via Admin Dashboard
1. Open admin dashboard
2. Login with admin/admin
3. Use "Bulk Upload Students" section
4. Upload JSON file with student array

#### Method 3: Command Line Import
```bash
# Import from JSON file
npm run db-script import students path/to/students.json
npm run db-script import programs path/to/programs.json
```

### MANAGE DATA FROM ADMIN INTERFACE

#### Web Dashboard Features:
- 📊 **Database Statistics:** View counts for all tables
- 👥 **Student Management:** View, add, edit, delete students
- 🎯 **Program Management:** View and manage programs
- 👨‍🏫 **Coach Management:** View coaches
- 📤 **Data Export:** Export any table to JSON
- 📂 **Bulk Import:** Upload JSON files
- 💬 **Testimonials:** Manage testimonials

#### Available API Endpoints:

**Public Endpoints:**
- `GET /api/programs` - Get all programs
- `GET /api/coaches` - Get all coaches  
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/students` - Student registration
- `POST /api/contact` - Contact form submission

**Admin Endpoints (Require Authentication):**
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking

---

## 🛠️ Database Management Scripts

### Available Commands:

```bash
# Database Scripts
npm run db-script stats                           # Show database statistics
npm run db-script get <tableName>                 # Get all data from table
npm run db-script export <tableName> [filePath]   # Export table to JSON
npm run db-script import <tableName> <filePath>   # Import JSON to table

# API Testing Scripts  
npm run api-test test                              # Run all API tests
npm run api-test login                             # Test admin login
npm run api-test upload-students [filePath]       # Bulk upload students
npm run api-test export <endpoint> <filename>     # Export data via API
```

### Example Commands:
```bash
# Export students data
npm run db-script export students

# Import sample students
npm run db-script import students src/scripts/sample-students.json

# Test all API endpoints
npm run api-test test

# Upload students via API
npm run api-test upload-students src/scripts/sample-students.json
```

---

## 📋 Database Tables

### Main Tables:
- **students** - Student registrations
- **programs** - Cricket programs/courses
- **coaches** - Coach information
- **bookings** - Training session bookings
- **testimonials** - Student testimonials
- **contact_messages** - Contact form submissions
- **admin_users** - Admin user accounts
- **settings** - Website settings
- **facilities** - Academy facilities
- **gallery_images** - Gallery photos
- **achievements** - Academy achievements

---

## 🔐 Admin Authentication

### Default Admin Account:
- **Username:** admin
- **Email:** admin@cricketacademy.com  
- **Password:** Default password hash is set in database initialization

### Getting Admin Token:
```javascript
const response = await fetch('https://cricket-web-ace-academy.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin' })
});
const result = await response.json();
const token = result.data.token;
```

---

## 📂 File Locations

- **Backend:** `backend/`
- **Database Config:** `backend/src/config/database.ts`
- **Admin Dashboard:** `backend/admin-dashboard.html`
- **Sample Data:** `backend/src/scripts/sample-*.json`
- **Management Scripts:** `backend/src/scripts/`

---

## 🚨 Troubleshooting

### Common Issues:

1. **Server Not Starting:**
   - Check if port 5000 is available
   - Ensure database credentials are correct in `.env`

2. **Admin Login Failed:**
   - Default password might need to be reset
   - Check if admin user exists in database

3. **Database Connection Failed:**
   - Verify MySQL database is running
   - Check connection details in `backend/.env`

4. **CORS Errors:**
   - Ensure your request origin is in allowed origins
   - Check CORS configuration in `server.ts`

---

## 💡 Tips

1. **Keep Server Running:** The backend server must be running for all operations
2. **Use Admin Dashboard:** Easiest way to manage data visually
3. **Backup Data:** Export data regularly using export commands
4. **Test API:** Use `npm run api-test` to verify all endpoints work
5. **Monitor Logs:** Check server console for error messages

---

## 📞 Support

For issues or questions:
1. Check server logs in the terminal
2. Verify database connection in `.env` file
3. Test API endpoints using the provided scripts
4. Use the admin dashboard for visual management

---

**🎉 You now have complete database management capabilities for your Cricket Academy!**
