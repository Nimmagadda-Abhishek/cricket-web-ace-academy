import express from 'express';
import Coach from '../models/Coach';
import Program from '../models/Program';
import Student from '../models/Student';
import { protect, checkPermission, logActivity } from '../middleware/auth';

const router = express.Router();

// Public route - get all active coaches (for website)
router.get('/public', async (req, res): Promise<any> => {
  try {
    const coaches = await Coach.find({ 
      isActive: true,
      'employment.status': 'active'
    })
    .select('name bio specialization experience image rating achievements')
    .sort({ 'rating.average': -1, experience: -1 });

    res.json({
      status: 'success',
      data: { coaches }
    });
  } catch (error) {
    console.error('Error fetching public coaches:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch coaches'
    });
  }
});

// Apply authentication to admin routes
router.use(protect);

// Get all coaches with filtering and pagination
router.get('/',
  checkPermission('coaches.view'),
  logActivity('view_coaches', 'coaches'),
  async (req, res): Promise<any> => {
    try {
      const {
        specialization,
        status,
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query: any = { isActive: true };

      if (specialization && specialization !== 'all') {
        query.specialization = { $in: [specialization] };
      }

      if (status && status !== 'all') {
        query['employment.status'] = status;
      }

      if (search && typeof search === 'string') {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { specialization: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // Calculate pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Execute query with population
      const coaches = await Coach.find(query)
        .populate('programs', 'title currentStudents')
        .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const totalCoaches = await Coach.countDocuments(query);
      const totalPages = Math.ceil(totalCoaches / limitNum);

      res.json({
        status: 'success',
        data: {
          coaches,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalCoaches,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching coaches:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch coaches',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get coach by ID
router.get('/:id',
  checkPermission('coaches.view'),
  logActivity('view_coach', 'coach'),
  async (req, res): Promise<any> => {
    try {
      const coach = await Coach.findById(req.params.id)
        .populate('programs', 'title currentStudents maxStudents category price');

      if (!coach) {
        return res.status(404).json({
          status: 'fail',
          message: 'Coach not found'
        });
      }

      // Get total students taught by this coach
      const totalStudents = await Student.countDocuments({
        program: { $in: coach.programs },
        isActive: true
      });

      // Get recent reviews
      const recentReviews = coach.rating.reviews
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      res.json({
        status: 'success',
        data: {
          coach: {
            ...coach.toObject(),
            totalStudents,
            recentReviews
          }
        }
      });
    } catch (error) {
      console.error('Error fetching coach:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch coach',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Create new coach
router.post('/',
  checkPermission('coaches.create'),
  logActivity('create_coach', 'coach'),
  async (req, res): Promise<any> => {
    try {
      const {
        name,
        email,
        phone,
        specialization,
        experience,
        bio,
        image,
        certifications,
        contactInfo,
        employment,
        qualifications,
        achievements,
        socialMedia,
        availability
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !specialization || !experience || !bio) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide all required fields: name, email, phone, specialization, experience, and bio'
        });
      }

      // Check if email already exists
      const existingCoach = await Coach.findOne({ email: email.toLowerCase() });
      if (existingCoach) {
        return res.status(400).json({
          status: 'fail',
          message: 'A coach with this email already exists'
        });
      }

      // Create coach
      const coach = new Coach({
        name,
        email: email.toLowerCase(),
        phone,
        specialization,
        experience,
        bio,
        image,
        certifications: certifications || [],
        contactInfo: contactInfo || {},
        employment: employment || { 
          joinDate: new Date(),
          employmentType: 'full-time',
          status: 'active'
        },
        qualifications: qualifications || [],
        achievements: achievements || [],
        socialMedia: socialMedia || {},
        availability: availability || { days: [], timeSlots: [] }
      });

      await coach.save();

      res.status(201).json({
        status: 'success',
        message: 'Coach created successfully',
        data: { coach }
      });
    } catch (error: any) {
      console.error('Error creating coach:', error);
      
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
        message: 'Failed to create coach',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Update coach
router.put('/:id',
  checkPermission('coaches.edit'),
  logActivity('update_coach', 'coach'),
  async (req, res): Promise<any> => {
    try {
      const coachId = req.params.id;
      const updates = req.body;

      // Find the coach first
      const coach = await Coach.findById(coachId);
      if (!coach) {
        return res.status(404).json({
          status: 'fail',
          message: 'Coach not found'
        });
      }

      // Update coach
      const updatedCoach = await Coach.findByIdAndUpdate(
        coachId,
        updates,
        { 
          new: true, 
          runValidators: true 
        }
      ).populate('programs', 'title currentStudents');

      res.json({
        status: 'success',
        message: 'Coach updated successfully',
        data: { coach: updatedCoach }
      });
    } catch (error: any) {
      console.error('Error updating coach:', error);
      
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
        message: 'Failed to update coach',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Delete coach (soft delete)
router.delete('/:id',
  checkPermission('coaches.delete'),
  logActivity('delete_coach', 'coach'),
  async (req, res): Promise<any> => {
    try {
      const coach = await Coach.findById(req.params.id);
      if (!coach) {
        return res.status(404).json({
          status: 'fail',
          message: 'Coach not found'
        });
      }

      // Check if coach is assigned to any programs
      const assignedPrograms = await Program.countDocuments({ 
        coach: coach._id, 
        isActive: true 
      });

      if (assignedPrograms > 0) {
        return res.status(400).json({
          status: 'fail',
          message: `Cannot delete coach. They are assigned to ${assignedPrograms} program(s)`
        });
      }

      // Soft delete - mark as inactive
      coach.isActive = false;
      coach.employment.status = 'inactive';
      await coach.save();

      res.json({
        status: 'success',
        message: 'Coach deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting coach:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete coach',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get coach statistics
router.get('/stats/overview',
  checkPermission('coaches.view'),
  logActivity('view_coach_stats', 'coaches'),
  async (req, res): Promise<any> => {
    try {
      const [
        totalCoaches,
        activeCoaches,
        onLeaveCoaches,
        topRatedCoaches,
        specializationStats,
        experienceStats
      ] = await Promise.all([
        Coach.countDocuments({ isActive: true }),
        Coach.countDocuments({ 'employment.status': 'active', isActive: true }),
        Coach.countDocuments({ 'employment.status': 'on-leave', isActive: true }),
        Coach.find({ 
          isActive: true, 
          'employment.status': 'active',
          'rating.count': { $gte: 1 }
        })
        .sort({ 'rating.average': -1 })
        .limit(5)
        .select('name specialization rating programs'),
        Coach.aggregate([
          { $match: { isActive: true } },
          { $unwind: '$specialization' },
          { $group: { _id: '$specialization', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Coach.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: {
                $switch: {
                  branches: [
                    { case: { $lt: ['$experience', 2] }, then: '0-2 years' },
                    { case: { $lt: ['$experience', 5] }, then: '2-5 years' },
                    { case: { $lt: ['$experience', 10] }, then: '5-10 years' },
                    { case: { $gte: ['$experience', 10] }, then: '10+ years' }
                  ],
                  default: 'Unknown'
                }
              },
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      res.json({
        status: 'success',
        data: {
          overview: {
            totalCoaches,
            activeCoaches,
            onLeaveCoaches
          },
          topRatedCoaches,
          specializationStats,
          experienceStats
        }
      });
    } catch (error) {
      console.error('Error fetching coach statistics:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch coach statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get available coaches for program assignment
router.get('/available/assignment',
  checkPermission('coaches.view'),
  async (req, res): Promise<any> => {
    try {
      const { specialization, day, timeSlot } = req.query;

      const query: any = {
        isActive: true,
        'employment.status': 'active'
      };

      if (specialization) {
        query.specialization = { $in: [specialization] };
      }

      if (day) {
        query['availability.days'] = { $in: [day.toString().toLowerCase()] };
      }

      const coaches = await Coach.find(query)
        .select('name email specialization availability programs rating')
        .populate('programs', 'title')
        .sort({ 'rating.average': -1, experience: -1 });

      res.json({
        status: 'success',
        data: { coaches }
      });
    } catch (error) {
      console.error('Error fetching available coaches:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch available coaches',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Add review for coach
router.post('/:id/reviews',
  checkPermission('coaches.view'),
  logActivity('add_coach_review', 'coach'),
  async (req, res): Promise<any> => {
    try {
      const { studentId, rating, comment } = req.body;
      
      if (!studentId || !rating) {
        return res.status(400).json({
          status: 'fail',
          message: 'Student ID and rating are required'
        });
      }

      const coach = await Coach.findById(req.params.id);
      if (!coach) {
        return res.status(404).json({
          status: 'fail',
          message: 'Coach not found'
        });
      }

      // Verify student exists
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          status: 'fail',
          message: 'Student not found'
        });
      }

      // Add review using the instance method
      await coach.addReview(studentId, rating, comment);

      res.json({
        status: 'success',
        message: 'Review added successfully',
        data: { coach }
      });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add review',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get coach's schedule
router.get('/:id/schedule',
  checkPermission('coaches.view'),
  async (req, res): Promise<any> => {
    try {
      const coach = await Coach.findById(req.params.id)
        .populate({
          path: 'programs',
          select: 'title schedule currentStudents maxStudents',
          match: { isActive: true }
        });

      if (!coach) {
        return res.status(404).json({
          status: 'fail',
          message: 'Coach not found'
        });
      }

      // Combine coach availability with program schedules
      const schedule = {
        availability: coach.availability,
        programs: coach.programs.map((program: any) => ({
          id: program._id,
          title: program.title,
          schedule: program.schedule,
          enrollment: `${program.currentStudents}/${program.maxStudents}`
        }))
      };

      res.json({
        status: 'success',
        data: { schedule }
      });
    } catch (error) {
      console.error('Error fetching coach schedule:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch coach schedule',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Update coach availability
router.put('/:id/availability',
  checkPermission('coaches.edit'),
  logActivity('update_coach_availability', 'coach'),
  async (req, res): Promise<any> => {
    try {
      const { days, timeSlots } = req.body;
      
      const coach = await Coach.findById(req.params.id);
      if (!coach) {
        return res.status(404).json({
          status: 'fail',
          message: 'Coach not found'
        });
      }

      coach.availability = { days, timeSlots };
      await coach.save();

      res.json({
        status: 'success',
        message: 'Availability updated successfully',
        data: { coach }
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update availability',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

export default router;