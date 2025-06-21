import express from 'express';
import Contact from '../models/Contact';
import { protect, checkPermission, logActivity, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Public route - create new contact (from website contact form)
router.post('/public', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      category = 'inquiry',
      source = 'website',
      contactPreference = 'both'
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields: name, email, phone, subject, and message'
      });
    }

    // Create contact
    const contact = new Contact({
      name,
      email: email.toLowerCase(),
      phone,
      subject,
      message,
      category,
      source,
      contactPreference
    });

    await contact.save();

    res.status(201).json({
      status: 'success',
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        contact: {
          id: contact._id,
          name: contact.name,
          subject: contact.subject,
          createdAt: contact.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    
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
      message: 'Failed to submit contact form. Please try again later.'
    });
  }
});

// Apply authentication to admin routes
router.use(protect);

// Get all contacts with filtering and pagination
router.get('/',
  checkPermission('contacts.view'),
  logActivity('view_contacts', 'contacts'),
  async (req, res) => {
    try {
      const {
        category,
        status,
        priority,
        isRead,
        assignedTo,
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query: any = { isArchived: false };

      if (category && category !== 'all') {
        query.category = category;
      }

      if (status && status !== 'all') {
        query.status = status;
      }

      if (priority && priority !== 'all') {
        query.priority = priority;
      }

      if (isRead !== undefined) {
        query.isRead = isRead === 'true';
      }

      if (assignedTo && assignedTo !== 'all') {
        query.assignedTo = assignedTo;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Execute query with population
      const contacts = await Contact.find(query)
        .populate('assignedTo', 'name email')
        .populate('responses.from', 'name email')
        .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const totalContacts = await Contact.countDocuments(query);
      const totalPages = Math.ceil(totalContacts / limitNum);

      res.json({
        status: 'success',
        data: {
          contacts,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalContacts,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch contacts',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get contact by ID
router.get('/:id',
  checkPermission('contacts.view'),
  logActivity('view_contact', 'contact'),
  async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id)
        .populate('assignedTo', 'name email avatar')
        .populate('responses.from', 'name email avatar');

      if (!contact) {
        return res.status(404).json({
          status: 'fail',
          message: 'Contact not found'
        });
      }

      // Mark as read if it wasn't already
      if (!contact.isRead) {
        await contact.markAsRead();
      }

      res.json({
        status: 'success',
        data: { contact }
      });
    } catch (error) {
      console.error('Error fetching contact:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch contact',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Create new contact (admin)
router.post('/',
  checkPermission('contacts.view'),
  logActivity('create_contact', 'contact'),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        subject,
        message,
        category,
        priority,
        source,
        tags,
        contactPreference
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide all required fields'
        });
      }

      // Create contact
      const contact = new Contact({
        name,
        email: email.toLowerCase(),
        phone,
        subject,
        message,
        category: category || 'inquiry',
        priority: priority || 'medium',
        source: source || 'phone',
        tags: tags || [],
        contactPreference: contactPreference || 'both'
      });

      await contact.save();

      res.status(201).json({
        status: 'success',
        message: 'Contact created successfully',
        data: { contact }
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      
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
        message: 'Failed to create contact',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Update contact
router.put('/:id',
  checkPermission('contacts.view'),
  logActivity('update_contact', 'contact'),
  async (req, res) => {
    try {
      const contactId = req.params.id;
      const updates = req.body;

      const contact = await Contact.findById(contactId);
      if (!contact) {
        return res.status(404).json({
          status: 'fail',
          message: 'Contact not found'
        });
      }

      // Update contact
      const updatedContact = await Contact.findByIdAndUpdate(
        contactId,
        updates,
        { 
          new: true, 
          runValidators: true 
        }
      ).populate('assignedTo', 'name email');

      res.json({
        status: 'success',
        message: 'Contact updated successfully',
        data: { contact: updatedContact }
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      
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
        message: 'Failed to update contact',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Delete contact (soft delete - archive)
router.delete('/:id',
  checkPermission('contacts.delete'),
  logActivity('delete_contact', 'contact'),
  async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          status: 'fail',
          message: 'Contact not found'
        });
      }

      // Archive the contact
      contact.isArchived = true;
      await contact.save();

      res.json({
        status: 'success',
        message: 'Contact archived successfully'
      });
    } catch (error) {
      console.error('Error archiving contact:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to archive contact',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Add response to contact
router.post('/:id/responses',
  checkPermission('contacts.respond'),
  logActivity('respond_to_contact', 'contact'),
  async (req, res) => {
    try {
      const { message, isInternal = false } = req.body;
      
      if (!message) {
        return res.status(400).json({
          status: 'fail',
          message: 'Response message is required'
        });
      }

      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          status: 'fail',
          message: 'Contact not found'
        });
      }

      // Add response
      await contact.addResponse(req.user._id, message, isInternal);

      // Populate the response for return
      await contact.populate('responses.from', 'name email');

      res.json({
        status: 'success',
        message: 'Response added successfully',
        data: { contact }
      });
    } catch (error) {
      console.error('Error adding response:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add response',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Assign contact to admin
router.put('/:id/assign',
  checkPermission('contacts.assign'),
  logActivity('assign_contact', 'contact'),
  async (req, res) => {
    try {
      const { adminId } = req.body;
      
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          status: 'fail',
          message: 'Contact not found'
        });
      }

      // Assign contact
      await contact.assignTo(adminId);
      await contact.populate('assignedTo', 'name email');

      res.json({
        status: 'success',
        message: 'Contact assigned successfully',
        data: { contact }
      });
    } catch (error) {
      console.error('Error assigning contact:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to assign contact',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Set follow-up date
router.put('/:id/follow-up',
  checkPermission('contacts.view'),
  logActivity('set_follow_up', 'contact'),
  async (req, res) => {
    try {
      const { followUpDate } = req.body;
      
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          status: 'fail',
          message: 'Contact not found'
        });
      }

      await contact.setFollowUpDate(new Date(followUpDate));

      res.json({
        status: 'success',
        message: 'Follow-up date set successfully',
        data: { contact }
      });
    } catch (error) {
      console.error('Error setting follow-up date:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to set follow-up date',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Close contact
router.put('/:id/close',
  checkPermission('contacts.respond'),
  logActivity('close_contact', 'contact'),
  async (req, res) => {
    try {
      const { resolution } = req.body;
      
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          status: 'fail',
          message: 'Contact not found'
        });
      }

      await contact.close(resolution);

      res.json({
        status: 'success',
        message: 'Contact closed successfully',
        data: { contact }
      });
    } catch (error) {
      console.error('Error closing contact:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to close contact',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Get contact statistics
router.get('/stats/overview',
  checkPermission('contacts.view'),
  logActivity('view_contact_stats', 'contacts'),
  async (req, res) => {
    try {
      const [
        totalContacts,
        newContacts,
        inProgressContacts,
        resolvedContacts,
        unreadContacts,
        overdueContacts,
        categoryStats,
        priorityStats,
        sourceStats,
        recentContacts
      ] = await Promise.all([
        Contact.countDocuments({ isArchived: false }),
        Contact.countDocuments({ status: 'new', isArchived: false }),
        Contact.countDocuments({ status: 'in-progress', isArchived: false }),
        Contact.countDocuments({ status: 'resolved', isArchived: false }),
        Contact.countDocuments({ isRead: false, isArchived: false }),
        Contact.countDocuments({
          followUpDate: { $lt: new Date() },
          status: { $nin: ['resolved', 'closed'] },
          isArchived: false
        }),
        Contact.aggregate([
          { $match: { isArchived: false } },
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ]),
        Contact.aggregate([
          { $match: { isArchived: false } },
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]),
        Contact.aggregate([
          { $match: { isArchived: false } },
          { $group: { _id: '$source', count: { $sum: 1 } } }
        ]),
        Contact.find({ isArchived: false })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name email subject category status priority createdAt')
      ]);

      res.json({
        status: 'success',
        data: {
          overview: {
            totalContacts,
            newContacts,
            inProgressContacts,
            resolvedContacts,
            unreadContacts,
            overdueContacts
          },
          categoryStats,
          priorityStats,
          sourceStats,
          recentContacts
        }
      });
    } catch (error) {
      console.error('Error fetching contact statistics:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch contact statistics',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

// Bulk operations
router.post('/bulk/actions',
  checkPermission('contacts.view'),
  logActivity('bulk_contact_actions', 'contacts'),
  async (req, res) => {
    try {
      const { contactIds, action, data } = req.body;
      
      if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide valid contact IDs'
        });
      }

      let updateQuery: any = {};
      let message = '';

      switch (action) {
        case 'mark-read':
          updateQuery = { isRead: true };
          message = 'Contacts marked as read';
          break;
        case 'mark-unread':
          updateQuery = { isRead: false };
          message = 'Contacts marked as unread';
          break;
        case 'assign':
          if (!data.adminId) {
            return res.status(400).json({
              status: 'fail',
              message: 'Admin ID is required for assignment'
            });
          }
          updateQuery = { assignedTo: data.adminId };
          message = 'Contacts assigned successfully';
          break;
        case 'set-priority':
          if (!data.priority) {
            return res.status(400).json({
              status: 'fail',
              message: 'Priority is required'
            });
          }
          updateQuery = { priority: data.priority };
          message = 'Priority updated for contacts';
          break;
        case 'archive':
          updateQuery = { isArchived: true };
          message = 'Contacts archived';
          break;
        default:
          return res.status(400).json({
            status: 'fail',
            message: 'Invalid action'
          });
      }

      await Contact.updateMany(
        { _id: { $in: contactIds }, isArchived: false },
        updateQuery
      );

      res.json({
        status: 'success',
        message
      });
    } catch (error) {
      console.error('Error performing bulk action:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to perform bulk action',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }
);

export default router;