import express from 'express';
import Program from '../models/Program';
import Student from '../models/Student';
import Coach from '../models/Coach';
import { protect, checkPermission, logActivity, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Public route - get all active programs (for website)
router.get('/public', async (req, res) => {
  try {
    const programs = await Program.find({ 
      status: 'active', 
      isActive: true,
      startDate: { $lte: new Date() }
    })
    .populate('coach', 'name specialization rating')
    .select('-createdAt -updatedAt -__v')
    .sort({ category: 1, price: 1 });

    res.json({
      status: 'success',
      data: { programs }
    });
  } catch (error) {
    console.error('Error fetching public programs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch programs'
    });
  }
});

// Apply authentication to admin routes
router.use(protect);

// Get all programs with filtering and pagination
router.get('/',
  checkPermission('programs.view'),
  logActivity('view_programs', 'programs'),
  async (req, res): Promise<any> => {
    try {
      const {
        category,
        level,
        status,
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query: any = { isActive: true };

      if (category && category !== 'all') {
        query.category = category;
      }

      if (level && level !== 'all') {
        query.level = level;
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search && typeof search === 'string') {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { ageGroup: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Execute query with population
      const programs = await Program.find(query)
        .populate('coach', 'name email specialization')
        .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const totalPrograms = await Program.countDocuments(query);
      const totalPages = Math.ceil(totalPrograms / limitNum);

      res.json({
        status: 'success',
        data: {
          programs,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalPrograms,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching programs:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch programs',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get program by ID
router.get('/:id',
  checkPermission('programs.view'),
  logActivity('view_program', 'program'),
  async (req, res): Promise<any> => {
    try {
      const program = await Program.findById(req.params.id)
        .populate('coach', 'name email specialization experience rating');

      if (!program) {
        return res.status(404).json({
          status: 'fail',
          message: 'Program not found'
        });
      }

      // Get enrolled students count
      const enrolledStudents = await Student.countDocuments({
        program: program._id,
        isActive: true
      });

      res.json({
        status: 'success',
        data: {
          program: {
            ...program.toObject(),
            enrolledStudents
          }
        }
      });
    } catch (error) {
      console.error('Error fetching program:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch program',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Create new program
router.post('/',
  checkPermission('programs.create'),
  logActivity('create_program', 'program'),
  async (req, res): Promise<any> => {
    try {
      const {
        title,
        description,
        ageGroup,
        duration,
        price,
        maxStudents,
        features,
        coach,
        schedule,
        equipment,
        level,
        category,
        startDate,
        endDate,
        icon,
        image,
        prerequisites,
        certificationProvided,
        discount
      } = req.body;

      // Validate required fields
      if (!title || !description || !ageGroup || !duration || !price || !maxStudents || !features) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide all required fields: title, description, ageGroup, duration, price, maxStudents, and features'
        });
      }

      // Check if title already exists
      const existingProgram = await Program.findOne({ title });
      if (existingProgram) {
        return res.status(400).json({
          status: 'fail',
          message: 'A program with this title already exists'
        });
      }

      // Create program
      const program = new Program({
        title,
        description,
        ageGroup,
        duration,
        price,
        maxStudents,
        currentStudents: 0,
        features,
        coach,
        schedule: schedule || { days: [], time: '', venue: '' },
        equipment: equipment || { provided: [], required: [] },
        level: level || 'beginner',
        category: category || 'junior',
        startDate: startDate || new Date(),
        endDate,
        icon: icon || '🏏',
        image,
        prerequisites: prerequisites || [],
        certificationProvided: certificationProvided || false,
        discount
      });

      await program.save();

      res.status(201).json({
        status: 'success',
        message: 'Program created successfully',
        data: { program }
      });
    } catch (error: any) {
      console.error('Error creating program:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        status: 'error',
        message: 'Failed to create program',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Update program
router.put('/:id',
  checkPermission('programs.edit'),
  logActivity('update_program', 'program'),
  async (req, res): Promise<any> => {
    try {
      const programId = req.params.id;
      const updates = req.body;

      // Find the program first
      const program = await Program.findById(programId);
      if (!program) {
        return res.status(404).json({
          status: 'fail',
          message: 'Program not found'
        });
      }

      // Update program
      const updatedProgram = await Program.findByIdAndUpdate(
        programId,
        updates,
        { 
          new: true, 
          runValidators: true 
        }
      ).populate('coach', 'name email specialization');

      res.json({
        status: 'success',
        message: 'Program updated successfully',
        data: { program: updatedProgram }
      });
    } catch (error: any) {
      console.error('Error updating program:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        status: 'error',
        message: 'Failed to update program',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Delete program (soft delete)
router.delete('/:id',
  checkPermission('programs.delete'),
  logActivity('delete_program', 'program'),
  async (req, res): Promise<any> => {
    try {
      const program = await Program.findById(req.params.id);
      if (!program) {
        return res.status(404).json({
          status: 'fail',
          message: 'Program not found'
        });
      }

      // Check if program has enrolled students
      const enrolledStudents = await Student.countDocuments({
        program: program._id, 
        isActive: true 
      });

      if (enrolledStudents > 0) {
        return res.status(400).json({
          status: 'fail',
          message: `Cannot delete program. It has ${enrolledStudents} enrolled student(s)`
        });
      }

      // Soft delete - mark as inactive
      program.isActive = false;
      program.status = 'inactive';
      await program.save();

      // Remove from coach's programs array
      if (program.coach) {
        await Coach.findByIdAndUpdate(program.coach, {
          $pull: { programs: program._id }
        });
      }

      res.json({
        status: 'success',
        message: 'Program deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting program:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete program',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get program statistics
router.get('/stats/overview',
  checkPermission('programs.view'),
  logActivity('view_program_stats', 'programs'),
  async (req, res): Promise<any> => {
    try {
      const [
        totalPrograms,
        activePrograms,
        fullPrograms,
        programStats,
        revenueByProgram,
        categoryStats
      ] = await Promise.all([
        Program.countDocuments({ isActive: true }),
        Program.countDocuments({ status: 'active', isActive: true }),
        Program.countDocuments({ status: 'full', isActive: true }),
        Program.aggregate([
          { $match: { isActive: true } },
          {
            $project: {
              title: 1,
              currentStudents: 1,
              maxStudents: 1,
              price: 1,
              revenue: { $multiply: ['$currentStudents', '$price'] },
              occupancyRate: {
                $cond: {
                  if: { $eq: ['$maxStudents', 0] },
                  then: 0,
                  else: { $multiply: [{ $divide: ['$currentStudents', '$maxStudents'] }, 100] }
                }
              }
            }
          }
        ]),
        Program.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: '$title',
              students: { $first: '$currentStudents' },
              revenue: { $first: { $multiply: ['$currentStudents', '$price'] } },
              maxStudents: { $first: '$maxStudents' }
            }
          }
        ]),
        Program.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              totalStudents: { $sum: '$currentStudents' },
              totalRevenue: { $sum: { $multiply: ['$currentStudents', '$price'] } }
            }
          }
        ])
      ]);

      const totalRevenue = programStats.reduce((sum, program) => sum + (program.revenue || 0), 0);
      const avgOccupancyRate = programStats.length > 0 ? 
        programStats.reduce((sum, program) => sum + program.occupancyRate, 0) / programStats.length : 0;

      res.json({
        status: 'success',
        data: {
          overview: {
            totalPrograms,
            activePrograms,
            fullPrograms,
            totalRevenue,
            avgOccupancyRate: Math.round(avgOccupancyRate * 100) / 100
          },
          programStats,
          revenueByProgram,
          categoryStats
        }
      });
    } catch (error) {
      console.error('Error fetching program statistics:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch program statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get available programs for enrollment
router.get('/available/enrollment',
  checkPermission('programs.view'),
  async (req, res) => {
    try {
      const availablePrograms = await Program.find({
        status: 'active',
        isActive: true,
        $expr: { $lt: ['$currentStudents', '$maxStudents'] }
      })
      .select('title ageGroup price maxStudents currentStudents category level')
      .sort({ category: 1, title: 1 });

      res.json({
        status: 'success',
        data: { programs: availablePrograms }
      });
    } catch (error) {
      console.error('Error fetching available programs:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch available programs',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Duplicate program
router.post('/:id/duplicate',
  checkPermission('programs.create'),
  logActivity('duplicate_program', 'program'),
  async (req, res): Promise<any> => {
    try {
      const originalProgram = await Program.findById(req.params.id);
      if (!originalProgram) {
        return res.status(404).json({
          status: 'fail',
          message: 'Program not found'
        });
      }

      // Create duplicate with modified title
      const duplicateData = originalProgram.toObject();
      // Remove fields that should not be duplicated
      const { _id, createdAt, updatedAt, ...programData } = duplicateData;
      
      programData.title = `${programData.title} (Copy)`;
      programData.currentStudents = 0;
      programData.status = 'active';

      const duplicatedProgram = new Program(programData);
      await duplicatedProgram.save();

      res.status(201).json({
        status: 'success',
        message: 'Program duplicated successfully',
        data: { program: duplicatedProgram }
      });
    } catch (error) {
      console.error('Error duplicating program:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to duplicate program',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

export default router;