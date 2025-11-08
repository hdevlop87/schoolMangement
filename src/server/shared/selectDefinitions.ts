import {
  students,
  users,
  classes,
  sections,
  parents,
  teachers,
  subjects,
  grades,
  assessments,
  attendance,
  teacherAssignments,
  fees,
  feeTypes,
  payments,
  expenses,
  announcements,
  events,
  eventParticipants,
  drivers,
  vehicles,
  refuels
} from '@/server/database/schema';

// ============================================
// HELPER UTILITIES
// ============================================

export const nestSelect = (selectDef: Record<string, any>): Record<string, any> => {
  return Object.entries(selectDef).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, any>);
};

// ============================================
// CORE ENTITIES
// ============================================

export const userSelect = {
  id: users.id,
  email: users.email,
  roleId: users.roleId,
  image: users.image,
  status: users.status,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export const studentSelect = {
  id: students.id,
  userId: students.userId,
  studentCode: students.studentCode,
  name: students.name,
  email: users.email,
  phone: students.phone,
  address: students.address,
  dateOfBirth: students.dateOfBirth,
  age: students.age,
  gender: students.gender,
  classId: students.classId,
  sectionId: students.sectionId,
  enrollmentDate: students.enrollmentDate,
  medicalConditions: students.medicalConditions,
  status: students.status,
  image: users.image,
  createdAt: students.createdAt,
  updatedAt: students.updatedAt,
};

export const teacherSelect = {
  id: teachers.id,
  userId: teachers.userId,
  cin: teachers.cin,
  name: teachers.name,
  email: users.email,
  phone: teachers.phone,
  address: teachers.address,
  gender: teachers.gender,
  specialization: teachers.specialization,
  salary: teachers.salary,
  hireDate: teachers.hireDate,
  yearsOfExperience: teachers.yearsOfExperience,
  bankAccount: teachers.bankAccount,
  emergencyContact: teachers.emergencyContact,
  emergencyPhone: teachers.emergencyPhone,
  status: teachers.status,
  employmentType: teachers.employmentType, // Added
  workloadHours: teachers.workloadHours,     // Added
  academicDegrees: teachers.academicDegrees, // Added
  image: users.image,
  createdAt: teachers.createdAt,
  updatedAt: teachers.updatedAt,
};

export const parentSelect = {
  id: parents.id,
  userId: parents.userId,
  name: parents.name,
  email: users.email,
  cin: parents.cin,
  phone: parents.phone,
  gender: parents.gender,
  address: parents.address,
  dateOfBirth: parents.dateOfBirth,
  age: parents.age,
  occupation: parents.occupation,
  nationality: parents.nationality,
  maritalStatus: parents.maritalStatus,
  relationshipType: parents.relationshipType,
  isEmergencyContact: parents.isEmergencyContact,
  financialResponsibility: parents.financialResponsibility,
  image: users.image,
  createdAt: parents.createdAt,
  updatedAt: parents.updatedAt,
};

// ============================================
// ACADEMIC STRUCTURE
// ============================================

export const classSelect = {
  id: classes.id,
  name: classes.name,
  description: classes.description,
  academicYear: classes.academicYear,
  level: classes.level,
  createdAt: classes.createdAt,
  updatedAt: classes.updatedAt,
};

export const sectionSelect = {
  id: sections.id,
  name: sections.name,
  classId: sections.classId,
  maxStudents: sections.maxStudents,
  roomNumber: sections.roomNumber,
  status: sections.status,
  createdAt: sections.createdAt,
  updatedAt: sections.updatedAt,
};

export const subjectSelect = {
  id: subjects.id,
  name: subjects.name,
  code: subjects.code,
  description: subjects.description,
  createdAt: subjects.createdAt,
  updatedAt: subjects.updatedAt,
};

// ============================================
// ASSESSMENTS & GRADES
// ============================================

export const assessmentSelect = {
  id: assessments.id,
  teacherAssignmentId: assessments.teacherAssignmentId,
  title: assessments.title,
  description: assessments.description,
  type: assessments.type,
  totalMarks: assessments.totalMarks,
  passingMarks: assessments.passingMarks,
  date: assessments.date,
  duration: assessments.duration,
  instructions: assessments.instructions,
  status: assessments.status,
  createdAt: assessments.createdAt,
  updatedAt: assessments.updatedAt,
};

export const gradeSelect = {
  id: grades.id,
  assessmentId: grades.assessmentId,
  studentId: grades.studentId,
  marksObtained: grades.marksObtained,
  feedback: grades.feedback,
  status: grades.status,
  gradedBy: grades.gradedBy,
  createdAt: grades.createdAt,
  updatedAt: grades.updatedAt,
};

// ============================================
// ATTENDANCE
// ============================================

export const attendanceSelect = {
  id: attendance.id,
  studentId: attendance.studentId,
  teacherAssignmentId: attendance.teacherAssignmentId,
  date: attendance.date,
  status: attendance.status,
  notes: attendance.notes,
  markedBy: attendance.markedBy,
  createdAt: attendance.createdAt,
  updatedAt: attendance.updatedAt,
};

// ============================================
// FEES & PAYMENTS
// ============================================

export const feeTypeSelect = {
  id: feeTypes.id,
  name: feeTypes.name,
  description: feeTypes.description,
  category: feeTypes.category,
  amount: feeTypes.amount,
  status: feeTypes.status,
  paymentType: feeTypes.paymentType,
  createdAt: feeTypes.createdAt,
  updatedAt: feeTypes.updatedAt,
};

export const feeSelect = {
  id: fees.id,
  studentId: fees.studentId,
  feeTypeId: fees.feeTypeId,
  schedule: fees.schedule,
  academicYear: fees.academicYear,
  totalAmount: fees.totalAmount,
  paidAmount: fees.paidAmount,
  discountAmount: fees.discountAmount,
  status: fees.status,
  notes: fees.notes,
  assignedBy: fees.assignedBy,
  createdAt: fees.createdAt,
  updatedAt: fees.updatedAt,
};

export const paymentSelect = {
  id: payments.id,
  feeId: payments.feeId,
  scheduleId: payments.scheduleId,
  studentId: payments.studentId,
  amount: payments.amount,
  paymentMethod: payments.paymentMethod,
  paymentDate: payments.paymentDate,
  checkNumber: payments.checkNumber,
  checkDueDate: payments.checkDueDate,
  transactionRef: payments.transactionRef,
  receiptNumber: payments.receiptNumber,
  status: payments.status,
  processedBy: payments.processedBy,
  notes: payments.notes,
  createdAt: payments.createdAt,
  updatedAt: payments.updatedAt,
};

// ============================================
// EXPENSES
// ============================================

export const expenseSelect = {
  id: expenses.id,
  category: expenses.category,
  title: expenses.title,
  amount: expenses.amount,
  expenseDate: expenses.expenseDate,
  paymentMethod: expenses.paymentMethod,
  paymentDate: expenses.paymentDate,
  vendor: expenses.vendor,
  invoiceNumber: expenses.invoiceNumber,
  receiptNumber: expenses.receiptNumber,
  checkNumber: expenses.checkNumber,
  transactionRef: expenses.transactionRef,
  status: expenses.status,
  approvedBy: expenses.approvedBy,
  approvedAt: expenses.approvedAt,
  rejectionReason: expenses.rejectionReason,
  paidBy: expenses.paidBy,
  notes: expenses.notes,
  createdAt: expenses.createdAt,
  updatedAt: expenses.updatedAt,
};

// ============================================
// ANNOUNCEMENTS
// ============================================

export const announcementSelect = {
  id: announcements.id,
  title: announcements.title,
  content: announcements.content,
  authorId: announcements.authorId,
  targetAudience: announcements.targetAudience,
  classId: announcements.classId,
  sectionId: announcements.sectionId,
  isPublished: announcements.isPublished,
  publishDate: announcements.publishDate,
  expiryDate: announcements.expiryDate,
  createdAt: announcements.createdAt,
  updatedAt: announcements.updatedAt,
};

// ============================================
// EVENTS
// ============================================

export const eventSelect = {
  id: events.id,
  title: events.title,
  description: events.description,
  type: events.type,
  startDate: events.startDate,
  endDate: events.endDate,
  startTime: events.startTime,
  endTime: events.endTime,
  location: events.location,
  venue: events.venue,
  organizerId: events.organizerId,
  classId: events.classId,
  sectionId: events.sectionId,
  visibility: events.visibility,
  status: events.status,
  capacity: events.capacity,
  registrationRequired: events.registrationRequired,
  registrationDeadline: events.registrationDeadline,
  attachments: events.attachments,
  notes: events.notes,
  createdAt: events.createdAt,
  updatedAt: events.updatedAt,
};

export const eventParticipantSelect = {
  id: eventParticipants.id,
  eventId: eventParticipants.eventId,
  participantId: eventParticipants.participantId,
  participantType: eventParticipants.participantType,
  registrationDate: eventParticipants.registrationDate,
  attendanceStatus: eventParticipants.attendanceStatus,
  notes: eventParticipants.notes,
  createdAt: eventParticipants.createdAt,
  updatedAt: eventParticipants.updatedAt,
};

// ============================================
// TRANSPORT ENTITIES
// ============================================

export const driverSelect = {
  id: drivers.id,
  userId: drivers.userId,
  name: drivers.name,
  cin: drivers.cin,
  licenseNumber: drivers.licenseNumber,
  licenseType: drivers.licenseType,
  licenseExpiry: drivers.licenseExpiry,
  hireDate: drivers.hireDate,
  phone: drivers.phone,
  email: users.email,
  address: drivers.address,
  gender: drivers.gender,
  yearsOfExperience: drivers.yearsOfExperience,
  salary: drivers.salary,
  emergencyContact: drivers.emergencyContact,
  emergencyPhone: drivers.emergencyPhone,
  status: drivers.status,
  notes: drivers.notes,
  image: users.image,
  createdAt: drivers.createdAt,
  updatedAt: drivers.updatedAt,
};

export const vehicleSelect = {
  id: vehicles.id,
  name: vehicles.name,
  brand: vehicles.brand,
  model: vehicles.model,
  year: vehicles.year,
  type: vehicles.type,
  capacity: vehicles.capacity,
  licensePlate: vehicles.licensePlate,
  driverId: vehicles.driverId,
  purchaseDate: vehicles.purchaseDate,
  purchasePrice: vehicles.purchasePrice,
  initialMileage: vehicles.initialMileage,
  currentMileage: vehicles.currentMileage,
  status: vehicles.status,
  notes: vehicles.notes,
  createdAt: vehicles.createdAt,
  updatedAt: vehicles.updatedAt,
};

export const refuelSelect = {
  id: refuels.id,
  vehicleId: refuels.vehicleId,
  driverId: refuels.drivers,
  datetime: refuels.datetime,
  voucherNumber: refuels.voucherNumber,
  liters: refuels.liters,
  costPerLiter: refuels.costPerLiter,
  totalCost: refuels.totalCost,
  mileageAtRefuel: refuels.mileageAtRefuel,
  fuelLevelAfter: refuels.fuelLevelAfter,
  attendant: refuels.attendant,
  notes: refuels.notes,
  createdAt: refuels.createdAt,
  updatedAt: refuels.updatedAt,
};