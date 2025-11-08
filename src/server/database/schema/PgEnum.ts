// --- Drizzle pgEnum Generation ---


import { getEnumConfig } from "@/lib/ENUMS";
import { pgEnum } from "drizzle-orm/pg-core";

const createPgEnum = (enumKey) => {
  const config = getEnumConfig(enumKey)
  if (!config) throw new Error(`Enum ${enumKey} not found`)
  const enumName = config.name || enumKey
  return pgEnum(enumName, config.values)
}

// Generate and export all Drizzle pgEnums
export const userTypeEnum = createPgEnum('userType');
export const userStatusEnum = createPgEnum('userStatus');
export const tokenStatusEnum = createPgEnum('tokenStatus');
export const tokenTypeEnum = createPgEnum('tokenType');
export const fileStatusEnum = createPgEnum('fileStatus');
export const genderEnum = createPgEnum('gender');
export const studentStatusEnum = createPgEnum('studentStatus');
export const teacherStatusEnum = createPgEnum('teacherStatus');
export const employmentTypeEnum = createPgEnum('employmentType');
export const relationshipTypeEnum = createPgEnum('relationshipType');
export const semesterEnum = createPgEnum('semester');
export const classStatusEnum = createPgEnum('classStatus');
export const sectionStatusEnum = createPgEnum('sectionStatus');
export const languageEnum = createPgEnum('language');
export const enrollmentStatusEnum = createPgEnum('enrollmentStatus');
export const assignmentStatusEnum = createPgEnum('assignmentStatus');
export const assessmentTypeEnum = createPgEnum('assessmentType');
export const assessmentStatusEnum = createPgEnum('assessmentStatus');
export const submissionTypeEnum = createPgEnum('submissionType');
export const examTypeEnum = createPgEnum('examType');
export const examSecurityEnum = createPgEnum('examSecurity');
export const examStatusEnum = createPgEnum('examStatus');
export const gradeStatusEnum = createPgEnum('gradeStatus');
export const attendanceStatusEnum = createPgEnum('attendanceStatus');
export const proficiencyLevelEnum = createPgEnum('proficiencyLevel');
export const dayOfWeekEnum = createPgEnum('dayOfWeek');
export const alertTypeEnum = createPgEnum('alertType');
export const alertPriorityEnum = createPgEnum('alertPriority');
export const alertStatusEnum = createPgEnum('alertStatus');
export const feeTypeStatusEnum = createPgEnum('feeTypeStatus');
export const paymentTypeEnum = createPgEnum('paymentType');
export const scheduleEnum = createPgEnum('schedule');
export const feeStatusEnum = createPgEnum('feeStatus');
export const paymentMethodEnum = createPgEnum('paymentMethod');
export const paymentStatusEnum = createPgEnum('paymentStatus');
export const eventTypeEnum = createPgEnum('eventType');
export const eventStatusEnum = createPgEnum('eventStatus');
export const eventVisibilityEnum = createPgEnum('eventVisibility');
export const participantTypeEnum = createPgEnum('participantType');
export const expenseCategoryEnum = createPgEnum('expenseCategory');
export const expenseStatusEnum = createPgEnum('expenseStatus');
export const trackerModeEnum = createPgEnum('trackerMode');
export const driverStatusEnum = createPgEnum('driverStatus');
export const vehicleStatusEnum = createPgEnum('vehicleStatus');
export const vehicleTypeEnum = createPgEnum('vehicleType');
export const vehicleDocumentTypeEnum = createPgEnum('vehicleDocumentType');
export const busStatusEnum = createPgEnum('busStatus');
export const refuelStatusEnum = createPgEnum('refuelStatus');
export const fuelTypeEnum = createPgEnum('fuelType');
export const maintenanceTypeEnum = createPgEnum('maintenanceType');
export const maintenanceStatusEnum = createPgEnum('maintenanceStatus');
export const maritalStatusEnum = createPgEnum('maritalStatus');