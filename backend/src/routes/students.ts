import express from 'express';
import Student from '../models/Student';
import Program from '../models/Program';
import { protect, checkPermission, logActivity } from '../middleware/auth';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Get all students with filtering and pagination
router.get('/', 
  checkPermission('students.view'),
  logActivity('view_students', 'students'),
  async (req, res) => {
    try {
      const {
        program,
        status,
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query: any = { isActive: true };

      if (program && program !== 'all') {
        query.program = program;
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Execute query with population
      const students = await Student.find(query)
        .populate('program', 'title price category')
        .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      // Get total count for pagination
      const totalStudents = await Student.countDocuments(query);
      const totalPages = Math.ceil(totalStudents / limitNum);

      res.json({
        status: 'success',
        data: {
          students,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalStudents,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch students',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get student by ID
router.get('/:id',
  checkPermission('students.view'),
  logActivity('view_student', 'student'),
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id)
        .populate('program', 'title price category coach')
        .populate({
          path: 'program',
          populate: {
            path: 'coach',
            select: 'name email specialization'
          }
        });

      if (!student) {
        return res.status(404).json({
          status: 'fail',
          message: 'Student not found'
        });
      }

      res.json({
        status: 'success',
        data: { student }
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch student',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Create new student
router.post('/',
  checkPermission('students.create'),
  logActivity('create_student', 'student'),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        age,
        program,
        emergencyContact,
        medicalInfo,
        performance
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !age || !program || !emergencyContact) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide all required fields: name, email, phone, age, program, and emergency contact'
        });
      }

      // Check if program exists and has capacity
      const selectedProgram = await Program.findById(program);
      if (!selectedProgram) {
        return res.status(400).json({
          status: 'fail',
          message: 'Selected program does not exist'
        });
      }

      if (!selectedProgram.canEnroll()) {
        return res.status(400).json({
          status: 'fail',
          message: 'Selected program is full or not available for enrollment'
        });
      }

      // Check if email already exists
      const existingStudent = await Student.findOne({ email: email.toLowerCase() });
      if (existingStudent) {
        return res.status(400).json({
          status: 'fail',
          message: 'A student with this email already exists'
        });
      }

      // Create student
      const student = new Student({
        name,
        email: email.toLowerCase(),
        phone,
        age,
        program,
        fees: selectedProgram.price,
        emergencyContact,
        medicalInfo,
        performance,
        status: 'pending' // Default status
      });

      await student.save();

      // Update program enrollment count
      await selectedProgram.enrollStudent();

      // Populate program details for response
      await student.populate('program', 'title price category');

      res.status(201).json({
        status: 'success',
        message: 'Student created successfully',
        data: { student }
      });
    } catch (error) {
      console.error('Error creating student:', error);
      
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
        message: 'Failed to create student',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Update student
router.put('/:id',
  checkPermission('students.edit'),
  logActivity('update_student', 'student'),
  async (req, res) => {
    try {
      const studentId = req.params.id;
      const updates = req.body;

      // Find the student first
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          status: 'fail',
          message: 'Student not found'
        });
      }

      // If program is being changed, validate the new program
      if (updates.program && updates.program !== student.program.toString()) {
        const newProgram = await Program.findById(updates.program);
        if (!newProgram) {
          return res.status(400).json({
            status: 'fail',
            message: 'Selected program does not exist'
          });
        }

        if (!newProgram.canEnroll()) {
          return res.status(400).json({
            status: 'fail',
            message: 'Selected program is full or not available'
          });
        }

        // Update program enrollment counts
        await Program.findById(student.program).then(oldProgram => {
          if (oldProgram) oldProgram.unenrollStudent();
        });
        await newProgram.enrollStudent();

        // Update fees to match new program
        updates.fees = newProgram.price;
      }

      // Update student
      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        updates,
        { 
          new: true, 
          runValidators: true 
        }
      ).populate('program', 'title price category');

      res.json({
        status: 'success',
        message: 'Student updated successfully',
        data: { student: updatedStudent }
      });
    } catch (error) {
      console.error('Error updating student:', error);
      
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
        message: 'Failed to update student',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Delete student (soft delete)
router.delete('/:id',
  checkPermission('students.delete'),
  logActivity('delete_student', 'student'),
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({
          status: 'fail',
          message: 'Student not found'
        });
      }

      // Soft delete - mark as inactive
      student.isActive = false;
      student.status = 'inactive';
      await student.save();

      // Update program enrollment count
      await Program.findById(student.program).then(program => {
        if (program) program.unenrollStudent();
      });

      res.json({
        status: 'success',
        message: 'Student deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete student',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get student statistics
router.get('/stats/overview',
  checkPermission('students.view'),
  logActivity('view_student_stats', 'students'),
  async (req, res) => {
    try {
      const [
        totalStudents,
        activeStudents,
        pendingStudents,
        inactiveStudents,
        revenueData,
        programStats,
        recentEnrollments
      ] = await Promise.all([
        Student.countDocuments({ isActive: true }),
        Student.countDocuments({ status: 'active', isActive: true }),
        Student.countDocuments({ status: 'pending', isActive: true }),
        Student.countDocuments({ status: 'inactive', isActive: true }),
        Student.aggregate([
          { $match: { status: 'active', isActive: true } },
          { $group: { _id: null, totalRevenue: { $sum: '$fees' } } }
        ]),
        Student.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$program', count: { $sum: 1 } } },
          { $lookup: { from: 'programs', localField: '_id', foreignField: '_id', as: 'program' } },
          { $unwind: '$program' },
          { $project: { name: '$program.title', count: 1, _id: 0 } }
        ]),
        Student.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('program', 'title')
          .select('name email program createdAt')
      ]);

      const totalRevenue = revenueData[0]?.totalRevenue || 0;

      res.json({
        status: 'success',
        data: {
          overview: {
            totalStudents,
            activeStudents,
            pendingStudents,
            inactiveStudents,
            totalRevenue
          },
          programStats,
          recentEnrollments
        }
      });
    } catch (error) {
      console.error('Error fetching student statistics:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch student statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Add payment for student
router.post('/:id/payments',
  checkPermission('students.edit'),
  logActivity('add_payment', 'student'),
  async (req, res) => {
    try {
      const { month, year, amount, paymentMethod, transactionId } = req.body;
      
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({
          status: 'fail',
          message: 'Student not found'
        });
      }

      // Check if payment for this month already exists
      const existingPayment = student.paymentHistory.find(
        payment => payment.month === month && payment.year === year
      );

      if (existingPayment) {
        return res.status(400).json({
          status: 'fail',
          message: 'Payment for this month already exists'
        });
      }

      // Add payment
      student.paymentHistory.push({
        month,
        year,
        amount,
        paidDate: new Date(),
        status: 'paid',
        paymentMethod,
        transactionId
      });

      await student.save();

      res.json({
        status: 'success',
        message: 'Payment added successfully',
        data: { student }
      });
    } catch (error) {
      console.error('Error adding payment:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add payment',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Export students data
router.get('/export/data',
  checkPermission('students.export'),
  logActivity('export_students', 'students'),
  async (req, res) => {
    try {
      const { format = 'json', program, status } = req.query;

      const query: any = { isActive: true };
      if (program && program !== 'all') query.program = program;
      if (status && status !== 'all') query.status = status;

      const students = await Student.find(query)
        .populate('program', 'title category')
        .select('-__v -paymentHistory -documents')
        .lean();

      if (format === 'csv') {
        // Convert to CSV format
        const csvData = students.map(student => ({
          Name: student.name,
          Email: student.email,
          Phone: student.phone,
          Age: student.age,
          Program: student.program?.title || 'N/A',
          Status: student.status,
          Fees: student.fees,
          'Join Date': new Date(student.joinDate).toLocaleDateString(),
          'Emergency Contact': student.emergencyContact?.name || 'N/A',
          'Emergency Phone': student.emergencyContact?.phone || 'N/A'
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
        
        // Simple CSV conversion (in production, use a proper CSV library)
        const csvHeaders = Object.keys(csvData[0] || {}).join(',');
        const csvRows = csvData.map(row => Object.values(row).join(','));
        const csvContent = [csvHeaders, ...csvRows].join('\n');
        
        res.send(csvContent);
      } else {
        res.json({
          status: 'success',
          data: { students },
          exportedAt: new Date().toISOString(),
          count: students.length
        });
      }
    } catch (error) {
      console.error('Error exporting students:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to export students data',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

export default router;