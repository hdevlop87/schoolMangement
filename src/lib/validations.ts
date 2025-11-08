import { z } from 'zod';
import { alertPriorityEnum, alertStatusEnum, alertTypeEnum, assessmentStatusEnum, assessmentTypeEnum, attendanceStatusEnum, driverStatusEnum, employmentTypeEnum, eventStatusEnum, eventTypeEnum, eventVisibilityEnum, examStatusEnum, examTypeEnum, expenseCategoryEnum, expenseStatusEnum, feeStatusEnum, feeTypeStatusEnum, fuelTypeEnum, genderEnum, gradeStatusEnum, languageEnum, participantTypeEnum, paymentMethodEnum, paymentStatusEnum, paymentTypeEnum, refuelStatusEnum, relationshipTypeEnum, scheduleEnum, sectionStatusEnum, studentStatusEnum, teacherStatusEnum, userStatusEnum, vehicleStatusEnum, vehicleTypeEnum } from './ZodEnum';

const idField = z.string().min(1, "ID must be at least 5 characters").nullish();
const emailField = z.string().email('Invalid email format').or(z.literal(""));
const phoneField = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number');
const nameField = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long');
const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');
const optionalDateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').nullable().optional();
const timeField = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format').optional().nullable();
const cinField = z.string().min(8, 'CIN must be at least 8 characters').max(20, 'CIN too long');
const addressField = z.string().max(500, 'Address too long').optional();
const academicYearField = z.string().min(9, 'Academic year is required').regex(/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format');

//=====================================================================//
// USER-ROLE VALIDATION SCHEMA
//=====================================================================//

export const userSchema = z.object({
  id: idField,
  username: nameField.max(50).optional(),
  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleId: idField.optional(),
  roleName: nameField.max(50).optional(),
  lastLogin: optionalDateField,
  image: z.union([z.string(), z.instanceof(File), z.undefined()]).optional(),
  emailVerified: z.boolean().default(false),
  status: userStatusEnum,
  createdAt: optionalDateField,
});

export const roleSchema = z.object({
  id: idField,
  name: nameField.max(50),
  description: z.string().max(255, "Description too long").optional(),
  createdAt: optionalDateField,
});

//=====================================================================//
// PEOPLE VALIDATION SCHEMAS
//=====================================================================//

export const studentSchema = z.object({
  id: idField,
  classId: idField,
  sectionId: idField,
  studentCode: z.string(),
  name: nameField,
  email: emailField,
  phone: phoneField.nullish(),
  address: addressField,
  dateOfBirth: optionalDateField,
  gender: genderEnum,
  enrollmentDate: dateField,
  medicalConditions: z.string().max(1000, 'Medical conditions description too long').nullish().optional(),
  previousSchool: z.string().max(500, 'Previous school name too long').optional().nullable(),
  status: studentStatusEnum.default('active'),
});

export const parentSchema = z.object({
  id: idField,
  name: nameField,
  email: emailField.optional(),
  phone: phoneField,
  gender: genderEnum.optional(),
  address: addressField,
  dateOfBirth: optionalDateField,
  cin: cinField,
  occupation: z.string().max(100, 'Occupation too long').optional(),
  nationality: z.string().max(100, 'Nationality too long').optional(),
  maritalStatus: z.string().max(50, 'Marital status too long').optional(),
  relationshipType: relationshipTypeEnum,
  isEmergencyContact: z.boolean().optional().default(false),
  financialResponsibility: z.string().optional().default(''),
});

export const driverSchema = z.object({
  id: idField,
  name: nameField,
  email: emailField,
  cin: cinField,
  phone: phoneField,
  address: addressField,
  gender: genderEnum.optional(),
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters').max(20, 'License number too long'),
  licenseType: z.string().max(10, 'License type too long'),
  licenseExpiry: dateField,
  hireDate: dateField,
  salary: z.coerce.number().positive('Salary must be positive').optional(),
  yearsOfExperience: z.coerce.number().int().min(0, 'Years of experience must be non-negative').optional(),
  emergencyContact: nameField.optional(),
  emergencyPhone: phoneField.optional(),
  status: driverStatusEnum.default('active'),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
});

export const teacherPersonalSchema = z.object({
  id: idField,
  name: nameField,
  cin: cinField,
  email: emailField,
  phone: phoneField,
  address: addressField,
  gender: genderEnum.optional(),
  emergencyContact: nameField.optional(),
  emergencyPhone: phoneField,
  status: teacherStatusEnum.default('active'),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export const teacherProfessionalSchema = z.object({
  specialization: z.string().max(100, 'Specialization too long').optional(),
  yearsOfExperience: z.coerce.number().int().min(0, 'Years of experience must be non-negative').optional(),
  salary: z.coerce.number().positive('Salary must be positive').optional(),
  hireDate: dateField,
  bankAccount: z.string().max(50, 'Bank account too long').optional(),
  employmentType: employmentTypeEnum.optional(),
  workloadHours: z.coerce.number().int().min(0, 'Workload hours must be non-negative').max(60, 'Workload hours cannot exceed 60').optional(),
  academicDegrees: z.string().max(500, 'Academic degrees description too long').optional(),
});

export const assignmentsSchema = z.object({
  assignments: z.array(
    z.object({
      classId: z.string().min(1, 'Class is required'),
      sectionIds: z.array(z.string()).min(1, 'At least one section is required'),
      subjectIds: z.array(z.string()).min(1, 'At least one subject is required'),
      academicYear: z.string().optional()
    })
  ).min(1, 'At least one assignment is required')
});

export const teacherSchema = z.object({
  ...teacherPersonalSchema.shape,
  ...teacherProfessionalSchema.shape,
  ...assignmentsSchema.shape,
});

export const studentParentSchema = z.object({
  studentId: idField,
  parentId: idField,
  isPrimaryContact: z.boolean().default(false),
  financialResponsibility: z.boolean().default(false),
});

//=====================================================================//
// FEES VALIDATION SCHEMAS
//=====================================================================//

export const feeTypeSchema = z.object({
  id: idField,
  name: z.string().min(2, 'Fee type name must be at least 2 characters').max(100, 'Fee type name too long'),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  category: z.string(),
  amount: z.coerce.number().positive('Amount must be greater than 0').max(1_000_00, 'Amount too large'),
  paymentType: paymentTypeEnum.default('recurring'),
  status: feeTypeStatusEnum.default('active').optional(),
});

export const feeSchema = z.object({
  id: idField,
  studentId: idField,
  feeTypeId: idField,
  academicYear: academicYearField.optional(),
  status: feeStatusEnum.optional(),
  schedule: scheduleEnum,
  amount: z.union([z.string(), z.coerce.number()]),
  totalAmount: z.union([z.string(), z.coerce.number()]).optional(),
  discountAmount: z.union([z.string(), z.coerce.number()]).default('0'),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
})

export const bulkFeeFormSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  fees: z.array(feeSchema).min(1, 'At least one fee is required')
});

export const paymentScheduleSchema = z.object({
  feeId: idField,
  installment: z.coerce.number().int().min(1, 'Installment must be at least 1').max(100, 'Installment too large'),
  dueDate: dateField,
  amount: z.coerce.number().positive('Amount must be greater than 0').max(1_000_00, 'Amount too large'),
});

export const feePaymentSchema = z.object({
  feeId: idField,
  scheduleId: idField.optional().nullable(),
  studentId: idField,
  amount: z.coerce.number().positive('Amount must be greater than 0').max(1_000_00, 'Amount too large'),
  paymentMethod: paymentMethodEnum,
  paymentDate: dateField,
  checkNumber: z.string().max(50, 'Check number too long').optional().nullable(),
  checkDueDate: optionalDateField.nullable(),
  transactionRef: z.string().max(100, 'Transaction reference too long').optional().nullable(),
  receiptNumber: z.string().max(50, 'Receipt number too long').optional().nullable(),
  status: paymentStatusEnum.default('completed'),
  processedBy: idField.optional(),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
})

export const parentsSchema = z.object({
  parents: z.array(parentSchema).min(1, 'At least one parent is required')
})

export const feesSchema = z.object({
  fees:z.array(feeSchema).min(1, 'At least one parent is required')
})

export const fullStudentSchema = z.object({
  student: studentSchema,
  parents: parentsSchema,
  fees: feesSchema
})

//=====================================================================//
// SCHOOL STRUCTURE VALIDATION SCHEMAS
//=====================================================================//

export const subjectSchema = z.object({
  id: idField.optional(),
  code: z.string().min(2, 'Subject code must be at least 2 characters').max(10, 'Subject code too long'),
  name: z.string().min(2, 'Subject name must be at least 2 characters').max(100, 'Subject name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  gradeLevel: z.number().int().min(1).max(12).optional(),
});

export const sectionSchema = z.object({
  id: idField.optional(),
  classId: idField,
  name: z.string().min(1, 'Section name is required').max(10, 'Section name too long'),
  maxStudents: z.number().int().min(1, 'Max students must be at least 1').max(100, 'Max students cannot exceed 100').default(30),
  roomNumber: z.string().max(20, 'Room number too long').optional(),
  status: sectionStatusEnum.default('active'),
});

export const classSchema = z.object({
  id: idField.optional(),
  name: z.string().min(1, 'Class name is required').max(50, 'Class name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  academicYear: academicYearField,
  level: z.string().min(1, 'Class level is required'),
});

export const attendanceSchema = z.object({
  studentId: idField,
  teacherId: idField,
  subjectId: idField,
  sectionId: idField,
  date: dateField,
  status: attendanceStatusEnum.default('present'),
  notes: z.string().max(500, 'Notes too long').optional(),
})

export const assessmentSchema = z.object({
  classId: idField.optional(),
  sectionId: idField.optional(),
  subjectId: idField.optional(),
  teacherId: idField.optional(),
  teacherAssignmentId: idField.optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional().nullable(),
  type: assessmentTypeEnum.default('quiz'),
  date: dateField,
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').max(480, 'Duration cannot exceed 8 hours').optional().nullable(),
  totalMarks: z.number().positive('Total marks must be greater than 0').max(1000, 'Total marks cannot exceed 1000'),
  passingMarks: z.number().min(0, 'Passing marks must be non-negative').max(1000, 'Passing marks cannot exceed 1000'),
  instructions: z.string().max(2000, 'Instructions too long').optional().nullable(),
  status: assessmentStatusEnum.default('scheduled'),
  assessmentId: idField.optional(),
})

export const bulkAssessmentSchema = z.object({
  assessments: z.array(assessmentSchema)
    .min(1, 'At least one assessment is required')
    .max(50, 'Cannot create more than 50 assessments at once'),
})

export const gradeSchema = z.object({
  assessmentId: idField.optional(),
  teacherId: idField.optional(),
  subjectId: idField.optional(),
  sectionId: idField.optional(),
  assessmentTitle: z.string().min(3, 'Assessment title must be at least 3 characters').max(200, 'Assessment title too long').optional(),
  studentId: idField,
  marksObtained: z.number().min(0, 'Marks obtained must be non-negative').max(1000, 'Marks obtained cannot exceed 1000'),
  feedback: z.string().max(1000, 'Feedback too long').optional().nullable(),
  status: gradeStatusEnum.default('graded'),
  gradeId: idField.optional(),
})

export const examSchema = z.object({
  classId: idField.optional(),
  sectionId: idField.optional(),
  subjectId: idField.optional(),
  teacherId: idField.optional(),
  teacherAssignmentId: idField.optional(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional().nullable(),
  type: examTypeEnum.default('midterm'),
  date: dateField,
  startTime: timeField,
  endTime: timeField,
  duration: z.number().int().min(30, 'Exam duration must be at least 30 minutes').max(480, 'Duration cannot exceed 8 hours'),
  totalMarks: z.number().positive('Total marks must be greater than 0').max(1000, 'Total marks cannot exceed 1000'),
  passingMarks: z.number().min(0, 'Passing marks must be non-negative').max(1000, 'Passing marks cannot exceed 1000'),
  roomNumber: z.string().max(50, 'Room number too long').optional().nullable(),
  allowedMaterials: z.string().max(500, 'Allowed materials description too long').optional().nullable(),
  instructions: z.string().max(2000, 'Instructions too long').optional().nullable(),
  status: examStatusEnum.default('scheduled'),
  examId: idField.optional(),
})

//=====================================================================//
// ANNOUNCEMENT VALIDATION SCHEMA
//=====================================================================//

export const announcementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000, 'Content too long'),
  authorId: idField,
  targetAudience: z.enum(['all', 'students', 'teachers', 'parents', 'class']),
  classId: idField.optional(),
  isPublished: z.boolean().default(false),
  publishDate: z.string().datetime('Invalid publish date').optional(),
  expiryDate: z.string().datetime('Invalid expiry date').optional(),
})

//=====================================================================//
// ALERT VALIDATION SCHEMA
//=====================================================================//

export const alertSchema = z.object({
  type: alertTypeEnum,
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  priority: alertPriorityEnum.default('medium'),
  status: alertStatusEnum.default('active'),
  studentId: idField.optional(),
  teacherId: idField.optional(),
  classId: idField.optional(),
  subjectId: idField.optional(),
  targetAudience: z.enum(['all', 'students', 'teachers', 'parents']).optional(),
  authorId: idField,
  isRead: z.boolean().default(false),
});

//=====================================================================//
// EVENTS VALIDATION SCHEMAS
//=====================================================================//

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().max(5000, 'Description too long').optional().nullable(),
  type: eventTypeEnum,
  startDate: dateField,
  endDate: dateField,
  startTime: timeField,
  endTime: timeField,
  location: z.string().max(200, 'Location too long').optional().nullable(),
  venue: z.string().max(200, 'Venue too long').optional().nullable(),
  organizerId: idField,
  classId: idField.optional().nullable(),
  sectionId: idField.optional().nullable(),
  visibility: eventVisibilityEnum.default('public'),
  status: eventStatusEnum.default('scheduled'),
  capacity: z.number().int().positive('Capacity must be positive').optional().nullable(),
  registrationRequired: z.boolean().default(false),
  registrationDeadline: optionalDateField.nullable(),
  attachments: z.any().optional().nullable(),
  notes: z.string().max(2000, 'Notes too long').optional().nullable(),
})

export const eventParticipantSchema = z.object({
  eventId: idField,
  participantId: idField,
  participantType: participantTypeEnum,
  attendanceStatus: attendanceStatusEnum.optional().nullable(),
  notes: z.string().max(500, 'Notes too long').optional().nullable(),
});

//=====================================================================//
// EXPENSES VALIDATION SCHEMAS
//=====================================================================//

export const expenseSchema = z.object({
  category: expenseCategoryEnum,
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  amount: z.number().positive('Amount must be greater than 0').max(10000000, 'Amount too large'),
  expenseDate: dateField,
  paymentMethod: paymentMethodEnum.optional().nullable(),
  paymentDate: optionalDateField.nullable(),
  vendor: z.string().max(200, 'Vendor name too long').optional().nullable(),
  invoiceNumber: z.string().max(100, 'Invoice number too long').optional().nullable(),
  receiptNumber: z.string().max(100, 'Receipt number too long').optional().nullable(),
  checkNumber: z.string().max(50, 'Check number too long').optional().nullable(),
  transactionRef: z.string().max(100, 'Transaction reference too long').optional().nullable(),
  status: expenseStatusEnum.default('pending'),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
});

export const expenseApprovalSchema = z.object({
  action: z.enum(['approve', 'reject']),
  rejectionReason: z.string().min(10, 'Rejection reason must be at least 10 characters').max(1000, 'Rejection reason too long').optional().nullable(),
})

export const expensePaymentSchema = z.object({
  paymentMethod: paymentMethodEnum,
  paymentDate: dateField,
  checkNumber: z.string().max(50, 'Check number too long').optional().nullable(),
  transactionRef: z.string().max(100, 'Transaction reference too long').optional().nullable(),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
})

//=====================================================================//
// TRANSPORT VALIDATION SCHEMAS
//=====================================================================//

export const vehicleSchema = z.object({
  id: idField.optional(),
  name: z.string().min(2, 'Vehicle name must be at least 2 characters').max(100, 'Vehicle name too long'),
  brand: z.string().min(2, 'Brand must be at least 2 characters').max(100, 'Brand too long'),
  model: z.string().min(2, 'Model must be at least 2 characters').max(100, 'Model too long'),
  year: z.coerce.number().int().min(1900, 'Year must be after 1900').max(new Date().getFullYear() + 1, 'Year cannot be in future'),
  type: vehicleTypeEnum.default('fullbus'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1').max(200, 'Capacity cannot exceed 200'),
  licensePlate: z.string().min(2, 'License plate must be at least 2 characters').max(50, 'License plate too long'),
  driverId: idField.optional().nullable(),
  image: z.string().max(500, 'Image path too long').optional().nullable().default('novehicle.png'),
  purchaseDate: optionalDateField.nullable(),
  purchasePrice: z.coerce.number().min(0, 'Purchase price must be non-negative').max(10000000, 'Purchase price too large').optional().nullable(),
  initialMileage: z.coerce.number().min(0, 'Initial mileage must be non-negative').max(10000000, 'Initial mileage too large').optional().nullable(),
  currentMileage: z.coerce.number().min(0, 'Current mileage must be non-negative').max(10000000, 'Current mileage too large').optional().nullable(),
  status: vehicleStatusEnum.default('active'),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
});

export const refuelSchema = z.object({
  id: idField.optional(),
  busId: idField,
  refuelDate: dateField,
  quantity: z.coerce.number().positive('Quantity must be greater than 0').max(10000, 'Quantity too large'),
  unitPrice: z.coerce.number().positive('Unit price must be greater than 0').max(100000, 'Unit price too large'),
  totalCost: z.coerce.number().positive('Total cost must be greater than 0').max(10000000, 'Total cost too large').optional(),
  fuelType: fuelTypeEnum.default('diesel'),
  odometer: z.coerce.number().min(0, 'Odometer must be non-negative').max(10000000, 'Odometer value too large').optional().nullable(),
  fuelStation: z.string().max(200, 'Fuel station name too long').optional().nullable(),
  invoiceNumber: z.string().max(100, 'Invoice number too long').optional().nullable(),
  paymentMethod: paymentMethodEnum.optional().nullable(),
  paidBy: idField.optional().nullable(),
  status: refuelStatusEnum.default('completed'),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
});

//=====================================================================//
// SETTINGS VALIDATION SCHEMA
//=====================================================================//

export const settingsSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters').max(200, 'School name too long'),
  schoolAddress: z.string().max(500, 'School address too long').optional(),
  schoolPhone: z.string().min(10, 'School phone must be at least 10 characters').max(20, 'School phone too long').optional(),
  schoolEmail: z.string().email('Invalid school email format').optional(),
  currentAcademicYear: academicYearField,
  gradingScale: z.any(),
  attendanceRequirement: z.number().min(0, 'Attendance requirement must be non-negative').max(100, 'Attendance requirement cannot exceed 100').default(75.00),
  lateSubmissionPenalty: z.number().min(0, 'Late submission penalty must be non-negative').max(100, 'Late submission penalty cannot exceed 100').default(10.00),
  maxClassSize: z.number().int().min(1, 'Max class size must be at least 1').max(200, 'Max class size cannot exceed 200').default(30),
  academicAlerts: z.boolean().default(true),
  attendanceAlerts: z.boolean().default(true),
  gradeUpdates: z.boolean().default(true),
  behavioralAlerts: z.boolean().default(true),
  healthAlerts: z.boolean().default(true),
  systemNotifications: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  parentNotifications: z.boolean().default(true),
  twoFactorEnabled: z.boolean().default(false),
  sessionTimeout: z.string().regex(/^\d{1,4}$/, 'Session timeout must be a number').default('60'),
  passwordRequireSymbols: z.boolean().default(true),
  loginNotifications: z.boolean().default(true),
  parentAccessEnabled: z.boolean().default(true),
  timeZone: z.string().min(1, 'Time zone is required').default('UTC'),
  language: languageEnum.default('en'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).default('MM/DD/YYYY'),
  timeFormat: z.enum(['12', '24']).default('12'),
  semesterSystem: z.boolean().default(true),
  gradingPeriods: z.number().int().min(1, 'Grading periods must be at least 1').max(12, 'Grading periods cannot exceed 12').default(4),
  schoolStartTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid school start time format (HH:MM)').default('08:00'),
  schoolEndTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid school end time format (HH:MM)').default('15:00'),
  lunchBreakDuration: z.number().int().min(15, 'Lunch break must be at least 15 minutes').max(120, 'Lunch break cannot exceed 120 minutes').default(30),
})

export const settingsQuerySchema = z.object({
  userId: idField.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

//=====================================================================//
// UTILITY SCHEMAS
//=====================================================================//

export const idParamSchema = z.object({
  id: idField,
});

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const dateRangeSchema = z.object({
  dateFrom: dateField,
  dateTo: dateField,
})

