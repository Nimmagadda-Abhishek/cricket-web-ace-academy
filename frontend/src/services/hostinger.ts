// Hostinger service for database operations
import { db } from '@/integrations/hostinger/client';
import adminService from './admin-client';

// Programs service
export const programsService = {
  // Get all public programs
  getPrograms: async () => {
    try {
      const programs = await db.query(
        'SELECT * FROM programs WHERE status = ? ORDER BY price',
        ['active']
      );
      
      return {
        data: {
          programs: programs.map(transformProgramFromDb),
        },
      };
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },
  
  // Get program details by ID
  getProgramById: async (id: string) => {
    try {
      const program = await db.queryOne(
        'SELECT * FROM programs WHERE id = ?',
        [id]
      );
      
      if (!program) {
        throw new Error(`Program with ID ${id} not found`);
      }
      
      return {
        data: {
          program: transformProgramFromDb(program),
        },
      };
    } catch (error) {
      console.error(`Error fetching program with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new program (admin only)
  createProgram: async (program: any) => {
    try {
      const now = new Date().toISOString();
      const dbProgram = {
        ...transformProgramToDb(program),
        current_students: program.current_students || 0,
        status: program.status || 'active',
        created_at: now,
        updated_at: now,
      };
      
      const id = await db.insert('programs', dbProgram);
      const newProgram = await db.queryOne('SELECT * FROM programs WHERE id = ?', [id]);
      
      return {
        data: {
          program: transformProgramFromDb(newProgram),
        },
      };
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },

  // Update an existing program (admin only)
  updateProgram: async (id: string, updates: any) => {
    try {
      const dbUpdates = {
        ...transformProgramToDb(updates),
        updated_at: new Date().toISOString(),
      };
      
      await db.update('programs', dbUpdates, 'id = ?', [id]);
      const updatedProgram = await db.queryOne('SELECT * FROM programs WHERE id = ?', [id]);
      
      if (!updatedProgram) {
        throw new Error(`Program with ID ${id} not found after update`);
      }
      
      return {
        data: {
          program: transformProgramFromDb(updatedProgram),
        },
      };
    } catch (error) {
      console.error(`Error updating program with ID ${id}:`, error);
      throw error;
    }
  },
};

// Contacts service
export const contactsService = {
  // Submit contact form
  submitContact: async (contactData: { name: string; email: string; phone: string; message: string }) => {
    try {
      const dbContact = {
        ...contactData,
        status: 'new',
        created_at: new Date().toISOString(),
      };
      
      const id = await db.insert('contacts', dbContact);
      
      return {
        data: {
          message: 'Contact form submitted successfully',
          id: id,
        },
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
};

// Payments service
export const paymentsService = {
  // Create a new enrollment record
  createEnrollment: async (enrollmentData: { 
    program_id: string; 
    student_info: any; 
    payment_intent_id: string;
    amount_paid: number;
    payment_status?: string;
  }) => {
    try {
      const now = new Date().toISOString();
      const dbEnrollment = {
        ...enrollmentData,
        student_info: JSON.stringify(enrollmentData.student_info),
        payment_status: enrollmentData.payment_status || 'pending',
        created_at: now,
        updated_at: now,
      };
      
      const id = await db.insert('enrollments', dbEnrollment);
      const enrollment = await db.queryOne('SELECT * FROM enrollments WHERE id = ?', [id]);
      
      if (enrollment) {
        // Parse the JSON string back to an object
        (enrollment as any).student_info = JSON.parse((enrollment as any).student_info);
      }
      
      return {
        data: {
          enrollment: enrollment,
        },
      };
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  },

  // Update enrollment payment status
  updateEnrollmentStatus: async (paymentIntentId: string, status: string) => {
    try {
      await db.update(
        'enrollments',
        {
          payment_status: status,
          updated_at: new Date().toISOString(),
        },
        'payment_intent_id = ?',
        [paymentIntentId]
      );
      
      const enrollment = await db.queryOne('SELECT * FROM enrollments WHERE payment_intent_id = ?', [paymentIntentId]);
      
      if (!enrollment) {
        throw new Error(`Enrollment with payment intent ID ${paymentIntentId} not found`);
      }
      
      return {
        data: {
          status: (enrollment as any).payment_status,
          enrollmentId: (enrollment as any).id,
        },
      };
    } catch (error) {
      console.error(`Error updating enrollment with payment intent ID ${paymentIntentId}:`, error);
      throw error;
    }
  },
};

// Helper function to transform program data from database format to application format
function transformProgramFromDb(dbProgram: any): any {
  return {
    _id: dbProgram.id,
    title: dbProgram.title,
    description: dbProgram.description,
    ageGroup: dbProgram.age_group,
    duration: dbProgram.duration,
    price: dbProgram.price,
    maxStudents: dbProgram.max_students,
    currentStudents: dbProgram.current_students,
    features: dbProgram.features ? JSON.parse(dbProgram.features) : [],
    status: dbProgram.status,
    coach: dbProgram.coach,
    schedule: dbProgram.schedule,
    equipment: dbProgram.equipment,
    level: dbProgram.level,
    category: dbProgram.category,
    startDate: dbProgram.start_date,
    icon: dbProgram.icon,
    color: dbProgram.color,
    image: dbProgram.image,
    prerequisites: dbProgram.prerequisites ? JSON.parse(dbProgram.prerequisites) : [],
    certificationProvided: dbProgram.certification_provided,
    discount: dbProgram.discount,
  };
}

// Helper function to transform program data from application format to database format
export function transformProgramToDb(appProgram: any): any {
  return {
    title: appProgram.title,
    description: appProgram.description,
    age_group: appProgram.ageGroup,
    duration: appProgram.duration,
    price: appProgram.price,
    max_students: appProgram.maxStudents,
    current_students: appProgram.currentStudents,
    features: appProgram.features ? JSON.stringify(appProgram.features) : null,
    status: appProgram.status,
    coach: appProgram.coach,
    schedule: appProgram.schedule,
    equipment: appProgram.equipment,
    level: appProgram.level,
    category: appProgram.category,
    start_date: appProgram.startDate,
    icon: appProgram.icon,
    color: appProgram.color,
    image: appProgram.image,
    prerequisites: appProgram.prerequisites ? JSON.stringify(appProgram.prerequisites) : null,
    certification_provided: appProgram.certificationProvided,
    discount: appProgram.discount,
  };
}

export default {
  programs: programsService,
  contacts: contactsService,
  payments: paymentsService,
  testimonials: adminService.testimonials,
  facilities: adminService.facilities,
  gallery: adminService.gallery,
};