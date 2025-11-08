import { z } from 'zod';
import { studentSchema, parentSchema } from '@/lib/validations';

export const fullStudentValidationSchema = z.object({
  // Student fields
  studentCode: studentSchema.shape.studentCode,
  name: studentSchema.shape.name,
  email: studentSchema.shape.email.optional(),
  phone: studentSchema.shape.phone.optional(),
  address: studentSchema.shape.address,
  dateOfBirth: studentSchema.shape.dateOfBirth,
  gender: studentSchema.shape.gender,
  classId: studentSchema.shape.classId,
  sectionId: studentSchema.shape.sectionId,
  enrollmentDate: studentSchema.shape.enrollmentDate,
  medicalConditions: studentSchema.shape.medicalConditions,
  previousSchool: z.string().optional(),
  image: z.any().optional(),
  password: z.string().optional(),
  id: z.string().optional(),

  // Father fields
  fatherName: parentSchema.shape.name.optional(),
  fatherCin: parentSchema.shape.cin,
  fatherEmail: parentSchema.shape.email,
  fatherPhone: parentSchema.shape.phone,
  fatherGender: parentSchema.shape.gender,
  fatherNationality: parentSchema.shape.nationality,
  fatherMaritalStatus: z.string().optional(),
  fatherAddress: parentSchema.shape.address,
  fatherDateOfBirth: parentSchema.shape.dateOfBirth,
  fatherOccupation: parentSchema.shape.occupation,
  fatherImage: z.any().optional(),

  // Mother fields
  motherName: parentSchema.shape.name.optional(),
  motherCin: parentSchema.shape.cin,
  motherEmail: parentSchema.shape.email,
  motherPhone: parentSchema.shape.phone,
  motherGender: parentSchema.shape.gender,
  motherNationality: parentSchema.shape.nationality,
  motherMaritalStatus: z.string().optional(),
  motherAddress: parentSchema.shape.address,
  motherDateOfBirth: parentSchema.shape.dateOfBirth,
  motherOccupation: parentSchema.shape.occupation,
  motherImage: z.any().optional(),

  // Fees array
  fees: z.array(z.object({
    feeTypeId: z.string(),
    schedule: z.enum(['monthly', 'quarterly', 'semester', 'annually', 'oneTime']),
    totalAmount: z.union([z.string(), z.coerce.number()]).optional(),
    discountAmount: z.union([z.string(), z.coerce.number()]).optional(),
    notes: z.string().optional(),
  })).optional(),
}).partial(); // Make most fields optional to allow progressive filling