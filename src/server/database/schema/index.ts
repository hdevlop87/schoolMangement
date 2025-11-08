import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, pgEnum, integer, numeric, date, time, jsonb } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { alertPriorityEnum, alertStatusEnum, alertTypeEnum, assessmentStatusEnum, assessmentTypeEnum, attendanceStatusEnum, driverStatusEnum, employmentTypeEnum, eventStatusEnum, eventTypeEnum, eventVisibilityEnum, examStatusEnum, examTypeEnum, expenseCategoryEnum, expenseStatusEnum, feeStatusEnum, feeTypeStatusEnum, fileStatusEnum, genderEnum, gradeStatusEnum, languageEnum, maintenanceStatusEnum, maintenanceTypeEnum, maritalStatusEnum, paymentMethodEnum, paymentStatusEnum, paymentTypeEnum, relationshipTypeEnum, scheduleEnum, sectionStatusEnum, studentStatusEnum, teacherStatusEnum, tokenStatusEnum, tokenTypeEnum, userStatusEnum, vehicleStatusEnum, vehicleTypeEnum } from './PgEnum';


//=====================================================================//
// TIMESTAMPS HELPER
//=====================================================================//

const timestamps = {
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
};

//=====================================================================//
// REFERENCE HELPERS
//=====================================================================//

//=====================================================================//
// REFERENCE HELPERS (SMART VERSION)
//=====================================================================//

type OnDeleteAction = 'cascade' | 'restrict' | 'set null' | 'no action' | 'set default';

const userRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('user_id').references(() => users.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const studentRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('student_id').references(() => students.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const teacherRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('teacher_id').references(() => teachers.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const parentRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('parent_id').references(() => parents.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const classRef = (onDelete: OnDeleteAction = 'restrict') => {
  const ref = text('class_id').references(() => classes.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const sectionRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('section_id').references(() => sections.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const subjectRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('subject_id').references(() => subjects.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const roleRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('role_id').references(() => roles.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const permissionRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('permission_id').references(() => permissions.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const feeRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('fee_id').references(() => fees.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const feeTypeRef = (onDelete: OnDeleteAction = 'restrict') => {
  const ref = text('fee_type_id').references(() => feeTypes.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const assessmentRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('assessment_id').references(() => assessments.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const examRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('exam_id').references(() => exams.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const teacherAssignmentRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('teacher_assignment_id').references(() => teacherAssignments.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const eventRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('event_id').references(() => events.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const paymentScheduleRef = (onDelete: OnDeleteAction = 'cascade') => {
  const ref = text('schedule_id').references(() => paymentSchedules.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

const actionByRef = (fieldName: string, onDelete: OnDeleteAction = 'set null') => {
  const ref = text(fieldName).references(() => users.id, { onDelete });
  return onDelete === 'set null' ? ref : ref.notNull();
};

// Convenience functions for common action references
const assignedByRef = () => actionByRef('assigned_by');
const processedByRef = () => actionByRef('processed_by');
const approvedByRef = () => actionByRef('approved_by');
const paidByRef = () => actionByRef('paid_by');
const createdByRef = () => actionByRef('created_by');
const updatedByRef = () => actionByRef('updated_by');
const deletedByRef = () => actionByRef('deleted_by');
const verifiedByRef = () => actionByRef('verified_by');
const reviewedByRef = () => actionByRef('reviewed_by');

//=====================================================================//
// PRIMARY KEY HELPER
//=====================================================================//

const idField = (length = 5) => text('id').primaryKey().notNull().$defaultFn(() => nanoid(length));

//=====================================================================//
// NUMERIC FIELD HELPERS
//=====================================================================//

const numericField = (name, precision = 5, scale = 2) => numeric(name, { precision, scale });
const moneyField = (name) => numeric(name, { precision: 10, scale: 2 });


//=====================================================================//
// CORE SYSTEM TABLES
//=====================================================================//

export const auditLogs = pgTable('audit_logs', {
  id: idField(),
  userId: userRef('no action'),
  userRole: text('user_role').notNull(),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resource_id'),
  status: text('status').notNull(),
  ipAddress: text('ip_address'),
  metadata: jsonb('metadata'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export const roles = pgTable('roles', {
  id: idField(),
  name: text('name').notNull(),
  description: text('description'),
});

export const permissions = pgTable('permissions', {
  id: idField(),
  name: text('name').notNull().unique(),
  description: text('description'),
  resource: text('resource').notNull(),
  action: text('action').notNull(),
  ...timestamps,
});

export const rolePermissions = pgTable('role_permissions', {
  id: idField(),
  roleId: roleRef(),
  permissionId: permissionRef(),
  ...timestamps,
});

export const users = pgTable('users', {
  id: idField(8),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  password: text('password').notNull(),
  image: text('image').default('noavatar.png'),
  status: userStatusEnum('status').default('pending'),
  roleId: text('role_id').references(() => roles.id),
  lastLogin: timestamp('last_login', { mode: 'string' }),
  ...timestamps,
});

export const tokens = pgTable('tokens', {
  id: idField(10),
  userId: userRef().unique(),
  token: text('token').notNull(),
  type: tokenTypeEnum('type').default('refresh'),
  status: tokenStatusEnum('status').default('active'),
  expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
  ...timestamps,
});

export const files = pgTable('files', {
  id: idField(),
  name: text('name').notNull().unique(),
  path: text('path').notNull(),
  absPath: text('abs_path').notNull(),
  size: integer('size').notNull(),
  mimeType: text('mime_type').notNull(),
  type: text('type'),
  category: text('category'),
  entityId: text('entity_id'),
  isPublic: boolean('is_public').default(false),
  status: fileStatusEnum('status').default('active'),
  ...timestamps,
});

//=====================================================================//
// SCHOOL STRUCTURE
//=====================================================================//

// CE1, CE2, CM1, CM2, etc.
export const classes = pgTable('classes', {
  id: idField(),
  name: text('name').notNull().unique(),
  description: text('description'),
  academicYear: text('academic_year').notNull(),
  level: text('level'),
  ...timestamps,
});

// A, B, C within each class
export const sections = pgTable('sections', {
  id: idField(),
  classId: classRef(),
  name: text('name').notNull(), // 'A', 'B', 'C'
  maxStudents: integer('max_students').default(30),
  roomNumber: text('room_number'),
  status: sectionStatusEnum('status').default('active'),
  ...timestamps,
});

// Math, French, Arabic, etc.
export const subjects = pgTable('subjects', {
  id: idField(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  ...timestamps,
});

//=====================================================================//
// PEOPLE
//=====================================================================//

export const students = pgTable('students', {
  id: idField(),
  userId: userRef().unique(),
  classId: classRef(),
  sectionId: sectionRef(),
  studentCode: text('student_code').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  address: text('address'),
  dateOfBirth: date('date_of_birth'),
  age: integer('age'),
  gender: genderEnum('gender'),
  enrollmentDate: date('enrollment_date').notNull(),
  medicalConditions: text('medical_conditions'),
  previousSchool: text('previous_school'),
  status: studentStatusEnum('status').default('active'),
  deletedAt: timestamp('deleted_at', { mode: 'string' }),
  ...timestamps,
});

export const parents = pgTable('parents', {
  id: idField(),
  userId: userRef().unique(),
  name: text('name').notNull(),
  cin: text('cin').unique(),
  phone: text('phone'),
  gender: genderEnum('gender'),
  address: text('address'),
  dateOfBirth: date('date_of_birth'),
  age: integer('age'),
  occupation: text('occupation'),
  relationshipType: relationshipTypeEnum('relationship_type').notNull(),
  nationality: text('nationality'),
  maritalStatus: maritalStatusEnum('marital_status'),
  isEmergencyContact: boolean('is_emergency_contact').default(false),
  financialResponsibility: boolean('financial_responsibility').default(false),
  deletedAt: timestamp('deleted_at', { mode: 'string' }),
  ...timestamps,
});

export const studentParents = pgTable('student_parents', {
  id: idField(),
  studentId: studentRef(),
  parentId: parentRef(),
  ...timestamps,
});

export const teachers = pgTable('teachers', {
  id: idField(),
  userId: userRef().unique(),
  cin: text('cin').unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  address: text('address'),
  gender: genderEnum('gender'),
  specialization: text('specialization'),
  salary: numeric('salary', { precision: 10, scale: 2 }),
  hireDate: date('hire_date').notNull(),
  yearsOfExperience: integer('years_of_experience'),
  bankAccount: text('bank_account'),
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  employmentType: employmentTypeEnum('employment_type'), 
  workloadHours: integer('workload_hours'),
  academicDegrees: text('academic_degrees'),
  status: teacherStatusEnum('status').default('active'),
  deletedAt: timestamp('deleted_at', { mode: 'string' }),
  ...timestamps,
});

export const teacherAssignments = pgTable('teacher_assignments', {
  id: idField(),
  classId: classRef(),
  subjectId: subjectRef(),
  teacherId: teacherRef(),
  sectionId: sectionRef(),
  ...timestamps,
});

//=====================================================================//
// ATTENDANCE & ASSESSMENTS & GRADES
//=====================================================================//

export const attendance = pgTable('attendance', {
  id: idField(),
  studentId: studentRef(),
  teacherAssignmentId: teacherAssignmentRef(),
  date: date('date').notNull(),
  status: attendanceStatusEnum('status').notNull().default('present'),
  notes: text('notes'),
  markedBy: text('marked_by').references(() => users.id),
  ...timestamps,
});

export const assessments = pgTable('assessments', {
  id: idField(),
  teacherAssignmentId: teacherAssignmentRef(),
  title: text('title').notNull(),
  description: text('description'),
  type: assessmentTypeEnum('type').notNull().default('quiz'),
  date: date('date').notNull(),
  duration: integer('duration'),
  totalMarks: numericField('total_marks').notNull(),
  passingMarks: numericField('passing_marks').notNull(),
  instructions: text('instructions'),
  status: assessmentStatusEnum('status').notNull().default('scheduled'),
  ...timestamps,
});

export const exams = pgTable('exams', {
  id: idField(),
  teacherAssignmentId: teacherAssignmentRef(),
  title: text('title').notNull(),
  description: text('description'),
  type: examTypeEnum('type').notNull().default('midterm'),
  date: date('date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  duration: integer('duration').notNull(),
  totalMarks: numericField('total_marks').notNull(),
  passingMarks: numericField('passing_marks').notNull(),
  roomNumber: text('room_number'),
  instructions: text('instructions'),
  status: examStatusEnum('status').notNull().default('scheduled'),
  ...timestamps,
});

export const grades = pgTable('grades', {
  id: idField(),
  studentId: studentRef(),
  assessmentId: assessmentRef(),
  examId: examRef(),
  marksObtained: numericField('marks_obtained').notNull(),
  feedback: text('feedback'),
  status: gradeStatusEnum('status').notNull().default('graded'),
  gradedBy: text('graded_by').references(() => users.id),
  ...timestamps,
});

//=====================================================================//
// FEES & PAYMENTS
//=====================================================================//


export const feeTypes = pgTable('fee_types', {
  id: idField(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  amount: moneyField('amount').notNull(),
  paymentType: paymentTypeEnum('payment_type').notNull().default('recurring'),
  status: feeTypeStatusEnum('status').default('active'),
  ...timestamps,
});

export const fees = pgTable('fees', {
  id: idField(),
  studentId: studentRef(),
  feeTypeId: feeTypeRef(),
  schedule: scheduleEnum('schedule').default('oneTime'),
  academicYear: text('academic_year').notNull(),
  totalAmount: moneyField('total_amount').notNull(),
  paidAmount: moneyField('paid_amount').notNull(),
  discountAmount: moneyField('discount_amount').default('0'),
  status: feeStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  assignedBy: assignedByRef(),
  ...timestamps,
});

export const paymentSchedules = pgTable('payment_schedules', {
  id: idField(),
  feeId: feeRef(),
  installment: integer('installment').notNull(),
  dueDate: date('due_date', { mode: 'date' }).notNull(),
  amount: moneyField('amount').notNull(),
  paidAmount: moneyField('paid_amount').notNull(),
  status: feeStatusEnum('status').default('pending').notNull(),
  ...timestamps,
})

export const payments = pgTable('payments', {
  id: idField(),
  feeId: feeRef(),
  scheduleId: paymentScheduleRef(),
  studentId: studentRef(),
  amount: moneyField('amount').notNull(),
  paymentDate: date('payment_date').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  checkNumber: text('check_number'),
  checkDueDate: date('check_due_date'),
  transactionRef: text('transaction_ref'),
  receiptNumber: text('receipt_number').unique(),
  status: paymentStatusEnum('status').default('completed'),
  processedBy: processedByRef(),
  notes: text('notes'),
  ...timestamps,
});

//=====================================================================//
// EXPENSES
//=====================================================================//

export const expenses = pgTable('expenses', {
  id: idField(),
  category: expenseCategoryEnum('category').notNull(),
  title: text('title').notNull(),
  amount: moneyField('amount').notNull(),
  expenseDate: date('expense_date').notNull(),
  paymentMethod: paymentMethodEnum('payment_method'),
  paymentDate: date('payment_date'),
  vendor: text('vendor'),
  invoiceNumber: text('invoice_number'),
  receiptNumber: text('receipt_number'),
  checkNumber: text('check_number'),
  transactionRef: text('transaction_ref'),
  status: expenseStatusEnum('status').default('pending'),
  approvedBy: approvedByRef(),
  approvedAt: timestamp('approved_at', { mode: 'string' }),
  rejectionReason: text('rejection_reason'),
  paidBy: paidByRef(),
  notes: text('notes'),
  ...timestamps,
});

//=====================================================================//
// COMMUNICATION
//=====================================================================//

export const announcements = pgTable('announcements', {
  id: idField(),
  authorId: userRef('set null'),
  classId: classRef('set null'),
  sectionId: sectionRef('set null'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  targetAudience: text('target_audience').notNull(),
  isPublished: boolean('is_published').default(false),
  publishDate: timestamp('publish_date', { mode: 'string' }),
  expiryDate: timestamp('expiry_date', { mode: 'string' }),
  ...timestamps,
});

export const events = pgTable('events', {
  id: idField(),
  organizerId: userRef('set null'),
  classId: classRef('set null'),
  sectionId: sectionRef('set null'),
  title: text('title').notNull(),
  description: text('description'),
  type: eventTypeEnum('type').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  location: text('location'),
  venue: text('venue'),
  visibility: eventVisibilityEnum('visibility').default('public'),
  status: eventStatusEnum('status').default('scheduled'),
  capacity: integer('capacity'),
  registrationRequired: boolean('registration_required').default(false),
  registrationDeadline: date('registration_deadline'),
  attachments: jsonb('attachments'),
  notes: text('notes'),
  ...timestamps,
});

export const eventParticipants = pgTable('event_participants', {
  id: idField(),
  eventId: eventRef(),
  participantId: text('participant_id').notNull(),
  participantType: text('participant_type').notNull(),
  registrationDate: timestamp('registration_date', { mode: 'string' }).defaultNow(),
  attendanceStatus: attendanceStatusEnum('attendance_status'),
  notes: text('notes'),
  ...timestamps,
});

export const alerts = pgTable('alerts', {
  id: idField(),
  authorId: userRef('set null'),
  studentId: studentRef('set null'),
  teacherId: teacherRef('set null'),
  teacherAssignmentId: teacherAssignmentRef('set null'),
  type: alertTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  priority: alertPriorityEnum('priority').default('medium'),
  status: alertStatusEnum('status').default('active'),
  targetAudience: text('target_audience'),
  isRead: boolean('is_read').default(false),
  ...timestamps,
});

//=====================================================================//
// SYSTEM SETTINGS
//=====================================================================//

export const settings = pgTable('settings', {
  id: idField(),
  userId: userRef().unique(),

  // School Information
  schoolName: text('school_name').notNull(),
  schoolAddress: text('school_address'),
  schoolPhone: text('school_phone'),
  schoolEmail: text('school_email'),
  currentAcademicYear: text('current_academic_year').notNull(),

  // Academic Settings
  gradingScale: jsonb('grading_scale'),
  attendanceRequirement: numeric('attendance_requirement', { precision: 5, scale: 2 }).default('75.00'),
  maxClassSize: integer('max_class_size').default(34),

  // Notification Settings
  academicAlerts: boolean('academic_alerts').default(true),
  attendanceAlerts: boolean('attendance_alerts').default(true),
  eventAlerts: boolean('event_alerts').default(true),
  homeworkAlerts: boolean('homework_alerts').default(true),
  feesReminder: boolean('fees_reminder').default(true),
  emailNotifications: boolean('email_notifications').default(true),
  smsNotifications: boolean('sms_notifications').default(false),
  parentNotifications: boolean('parent_notifications').default(true),

  // Security Settings
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  sessionTimeout: text('session_timeout').default('60'),
  passwordRequireSymbols: boolean('password_require_symbols').default(true),
  loginNotifications: boolean('login_notifications').default(true),
  parentAccessEnabled: boolean('parent_access_enabled').default(true),

  // System Preferences
  timeZone: text('time_zone').default('UTC'),
  language: languageEnum('language').default('en'),
  theme: text('theme').default('system'),
  dateFormat: text('date_format').default('MM/DD/YYYY'),
  timeFormat: text('time_format').default('12'),
  currency: text('currency').default('USD'),

  // Academic Calendar Settings
  gradingPeriods: integer('grading_periods').default(4),
  schoolStartTime: text('school_start_time').default('08:00'),
  schoolEndTime: text('school_end_time').default('15:00'),
  lunchBreakDuration: integer('lunch_break_duration').default(30),

  ...timestamps,
});

//=====================================================================//
// TRANSPORT MANAGEMENT
//=====================================================================//

export const drivers = pgTable('drivers', {
  id: idField(),
  userId: userRef().unique(),
  name: text('name').notNull(),
  cin: text('cin').unique(),
  licenseNumber: text('license_number').notNull().unique(),
  licenseType: text('license_type').notNull(),
  licenseExpiry: date('license_expiry').notNull(),
  hireDate: date('hire_date').notNull(),
  phone: text('phone'),
  address: text('address'),
  gender: genderEnum('gender'),
  yearsOfExperience: integer('years_of_experience'),
  salary: numeric('salary', { precision: 10, scale: 2 }),
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  status: driverStatusEnum('status').notNull().default('active'),
  notes: text('notes'),
  deletedAt: timestamp('deleted_at', { mode: 'string' }),
  ...timestamps,
});

export const vehicles = pgTable('vehicles', {
  id: idField(),
  name: text('name').notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  type: vehicleTypeEnum('type').notNull().default('fullbus'),
  capacity: integer('capacity').notNull(),
  licensePlate: text('license_plate').notNull().unique(),
  driverId: text('driver_id').references(() => drivers.id, { onDelete: 'set null' }).unique(),
  purchaseDate: date('purchase_date').default(sql`CURRENT_DATE`),
  purchasePrice: numeric('purchase_price', { precision: 12, scale: 2 }).default('0'),
  initialMileage: numeric('initial_mileage', { precision: 10, scale: 2 }).default('0'),
  currentMileage: numeric('current_mileage', { precision: 10, scale: 2 }).default('0'),
  status: vehicleStatusEnum('status').notNull().default('active'),
  notes: text('notes'),
  ...timestamps,
});

export const refuels = pgTable('refuels', {
  id: idField(),
  vehicleId: text('vehicle_id').references(() => vehicles.id).notNull(),
  drivers: text('operator_id').references(() => drivers.id, { onDelete: 'cascade' }).notNull(),
  datetime: timestamp('datetime', { mode: 'string' }).notNull(),
  voucherNumber: text('voucher_number'),
  liters: numeric('liters', { precision: 8, scale: 2 }).notNull(),
  costPerLiter: numeric('cost_per_liter', { precision: 6, scale: 2 }),
  totalCost: numeric('total_cost', { precision: 10, scale: 2 }),
  mileageAtRefuel: numeric('mileage_at_refuel', { precision: 10, scale: 2 }),
  fuelLevelAfter: numeric('fuel_level_after', { precision: 5, scale: 1 }).default('100'),
  attendant: text('attendant'),
  notes: text('notes'),
  ...timestamps,
})

export const maintenance = pgTable('maintenance', {
  id: idField(),
  vehicleId: text('vehicle_id').references(() => vehicles.id).notNull(),
  type: maintenanceTypeEnum('type').notNull(),
  title: text('title').notNull(),
  status: maintenanceStatusEnum('status').default('scheduled'),
  dueHours: numeric('due_hours', { precision: 10, scale: 2 }),
  cost: numeric('cost', { precision: 8, scale: 2 }),
  scheduledDate: date('scheduled_date'),
  completedAt: timestamp('completed_at', { mode: 'string' }),
  priority: text('priority').default('normal'),
  partsUsed: text('parts_used'),
  assignedTo: text('assigned_to'),
  notes: text('notes'),
  ...timestamps,
});