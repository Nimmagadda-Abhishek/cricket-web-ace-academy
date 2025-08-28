import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';

export class UploadController {
  // Upload single image
  static async uploadImage(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
        }
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({
        success: false,
        message: 'File upload failed'
      });
    }
  }

  // Upload multiple images
  static async uploadImages(req: AuthRequest, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const uploadedFiles = files.map(file => {
        const fileUrl = `/uploads/${file.filename}`;
        return {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
        };
      });

      res.json({
        success: true,
        message: `${files.length} files uploaded successfully`,
        data: {
          files: uploadedFiles
        }
      });
    } catch (error) {
      console.error('Upload images error:', error);
      res.status(500).json({
        success: false,
        message: 'File upload failed'
      });
    }
  }

  // Delete uploaded file
  static async deleteFile(req: AuthRequest, res: Response) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename is required'
        });
      }

      const filePath = path.join('uploads', filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Delete file
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        message: 'File deletion failed'
      });
    }
  }

  // Get file info
  static async getFileInfo(req: AuthRequest, res: Response) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename is required'
        });
      }

      const filePath = path.join('uploads', filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      const stats = fs.statSync(filePath);
      const fileUrl = `/uploads/${filename}`;

      res.json({
        success: true,
        data: {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
        }
      });
    } catch (error) {
      console.error('Get file info error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get file information'
      });
    }
  }

  // List uploaded files (admin only)
  static async listFiles(req: AuthRequest, res: Response) {
    try {
      const uploadsDir = 'uploads';
      
      if (!fs.existsSync(uploadsDir)) {
        return res.json({
          success: true,
          data: { files: [] }
        });
      }

      const files = fs.readdirSync(uploadsDir).map(filename => {
        const filePath = path.join(uploadsDir, filename);
        const stats = fs.statSync(filePath);
        const fileUrl = `/uploads/${filename}`;
        
        return {
          filename,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          url: fileUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
        };
      });

      res.json({
        success: true,
        data: {
          files: files.sort((a, b) => 
            new Date(b.created).getTime() - new Date(a.created).getTime()
          )
        }
      });
    } catch (error) {
      console.error('List files error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list files'
      });
    }
  }
}
