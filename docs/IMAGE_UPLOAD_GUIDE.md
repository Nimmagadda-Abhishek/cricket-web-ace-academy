# Image Upload Guide for Cricket Academy Admin Panel

This guide explains how image uploads work in the Cricket Academy Admin Panel and how they are stored on the Hostinger server.

## How Image Uploads Work

1. **Client-Side Upload**:
   - When an admin uploads an image through the admin panel, the image is sent to the server via a POST request to `/api/upload`.
   - The image is uploaded as a FormData object with the file and folder information.

2. **Server-Side Processing**:
   - The server receives the image and processes it using Multer middleware.
   - The image is validated to ensure it's an actual image file and within the size limit (5MB).
   - A unique filename is generated to prevent conflicts.
   - The image is stored in the appropriate folder within the `public/uploads` directory.

3. **Response**:
   - The server responds with the URL path to the uploaded image.
   - This URL is then stored in the database as part of the achievement, program, or other entity.

4. **Display**:
   - When users visit the website, the images are served directly from the server's static files.

## File Structure

```
public/
  └── uploads/
      ├── achievements/  (Achievement images)
      ├── coaches/       (Coach profile images)
      ├── facilities/    (Facility images)
      ├── gallery/       (Gallery images)
      ├── programs/      (Program images)
      └── testimonials/  (Testimonial images)
```

## Implementation Details

### Server-Side (Node.js)

The server uses Multer to handle file uploads:

```javascript
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the folder from the request body or use 'uploads' as default
    const folder = req.body.folder || 'uploads';
    const uploadPath = join(publicPath, 'uploads', folder);
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.split('.').pop();
    cb(null, uniqueSuffix + '.' + ext);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer with storage and file filter
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
```

### Client-Side (React)

The client uses a custom ImageUpload component:

```tsx
<ImageUpload
  label="Achievement Image"
  folder="achievements"
  currentImageUrl={formData.image_url}
  onImageUploaded={(url) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  }}
/>
```

## Deployment Considerations for Hostinger

When deploying to Hostinger, consider the following:

1. **File Permissions**:
   - Ensure the `public/uploads` directory and its subdirectories have write permissions.
   - You may need to set permissions to 755 for directories and 644 for files.

2. **Storage Limits**:
   - Be aware of your Hostinger plan's storage limits.
   - Consider implementing image compression to reduce file sizes.

3. **Backup Strategy**:
   - Regularly backup your uploaded images along with your database.
   - You can use Hostinger's backup tools or set up automated backups.

4. **Path Configuration**:
   - Update the image URLs in your database if your domain or path structure changes.

## Troubleshooting

If you encounter issues with image uploads, check the following:

1. **Server Logs**:
   - Check the server logs for any errors related to file uploads.

2. **File Permissions**:
   - Ensure the server has write permissions to the upload directories.

3. **File Size**:
   - Verify that the image size is within the 5MB limit.

4. **File Type**:
   - Ensure you're uploading valid image files (JPEG, PNG, GIF, etc.).

5. **Server Configuration**:
   - Check if your server has any limitations on file uploads.

## Best Practices

1. **Image Optimization**:
   - Consider implementing server-side image optimization to reduce file sizes.
   - Use appropriate image formats (JPEG for photos, PNG for graphics with transparency).

2. **Security**:
   - Validate file types on both client and server sides.
   - Sanitize filenames to prevent security issues.

3. **User Experience**:
   - Provide feedback during the upload process.
   - Show a preview of the image before and after upload.

4. **Error Handling**:
   - Implement robust error handling for upload failures.
   - Provide clear error messages to users.