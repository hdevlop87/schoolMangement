import { faker } from '@faker-js/faker';
import {
   createId,
   generateAddress,
   generateCIN,
   generateDiscount,
   generateEmail,
   generateEnrollmentDate,
   generateRandomFeeType,
   generateFinancialResponsibility,
   generateFullName,
   generateGender,
   generateMaritalStatus,
   generateMedicalConditions,
   generateNationality,
   generateParentBirthdate,
   generatePhone,
   generatePreviousSchool,
   generateRandomClass,
   generateRandomDriver,
   generateRandomSubject,
   generateRandomeSectionName,
   generateRelationshipType,
   generateSchedule,
   generateStudentBirthdate,
   generateStudentCode,
   generateYearsOfExperience,
   generateTeacherSalary,
   generateTeacherHireDate,
   generateBankAccount,
   generateTeacherSpecialization,
   generateTeacherLicenseNumber,
   generateTeacherAssignments
} from './utils';
import { nanoid } from 'nanoid';
import { feeTypeData, vehiclesData, subjectsData } from './data';

/**
 * ******************************************************
 * PARENT GENERATOR HELPERS
 * ******************************************************
 */

export function generateParent(options = null) {

   const gender = options?.gender || generateGender();
   const { firstName, lastName, fullName } = generateFullName(gender, options?.lastName);

   return {
      id: options?.id || nanoid(5),
      name: fullName,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      gender,
      address: options?.sharedAddress || generateAddress(),
      dateOfBirth: generateParentBirthdate(),
      cin: generateCIN(),
      occupation: faker.person.jobTitle(),
      nationality: generateNationality(),
      maritalStatus: generateMaritalStatus(),
      relationshipType: generateRelationshipType(),
      isEmergencyContact: faker.datatype.boolean(),
      financialResponsibility: generateFinancialResponsibility()
   };
}

/**
 * ******************************************************
 * STUDENT GENERATOR HELPERS
 * ******************************************************
 */

export function generateStudent(options = null) {
   const gender = options?.gender || generateGender();
   const { firstName, lastName, fullName } = generateFullName(gender, options?.lastName);
   const newClass = options?.classId || generateClass();
   const newSection = options?.sectionId || generateSection(newClass.id);

   return {
      id: options?.id || nanoid(5),
      studentCode: options?.studentCode || generateStudentCode(),
      name: fullName,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      address: options?.sharedAddress || generateAddress(),
      dateOfBirth: generateStudentBirthdate(),
      gender: gender,
      classId: newClass.id,
      sectionId: newSection.id,
      enrollmentDate: options?.enrollmentDate || generateEnrollmentDate(),
      graduationDate: null,
      medicalConditions: generateMedicalConditions(),
      previousSchool: generatePreviousSchool(),
      status: 'active'
   };
}

/**
 * ******************************************************
 * PARENTS GENERATOR (ALWAYS 2 PARENTS: MOTHER & FATHER)
 * ******************************************************
 */

export function generateParents(options = null) {
   const sharedAddress = generateAddress();
   const lastName = options?.lastName || generateFullName('male').lastName;
   
   // Generate father
   const father = generateParent({
      ...options,
      gender: 'M',
      lastName: lastName,
      sharedAddress: sharedAddress
   });
   
   // Generate mother
   const mother = generateParent({
      ...options,
      gender: 'F',
      lastName: lastName,
      sharedAddress: sharedAddress
   });
   
   return [father, mother];
}

/**
 * ******************************************************
 * FEE GENERATOR HELPERS
 * ******************************************************
 */

export function generateFeeType() {
   return generateRandomFeeType();
}

export function generateFee(studentId = null, options) {
   const feeType = options?.feeType || generateRandomFeeType();
   const discountAmount = options?.discountAmount ?? generateDiscount();
   const schedule = generateSchedule(feeType.paymentType)
   return {
      studentId: studentId,
      feeTypeId: feeType.id,
      feeTypeName: feeType.name,
      amount: feeType.amount,
      schedule,
      discountAmount,
      status: 'pending',
      notes: discountAmount > 0 ? 'Discount applied' : '',
   };
}

export function generateFees(studentId = null, options = {}) {
   const numberOfFees = faker.number.int({ min: 1, max: 4 });
   const selectedFeeTypes = faker.helpers.arrayElements(feeTypeData, numberOfFees);

   return selectedFeeTypes.map(feeType =>
      generateFee(studentId, {
         feeType,
         ...options
      })
   );
}
/**
 * ******************************************************
 * CLASS/SECTION/SUBJECT GENERATOR HELPERS
 * ******************************************************
 */

export function generateClass() {
   const randomClass = generateRandomClass();
   return {
      id: randomClass.id,
      name: randomClass.name,
      description: randomClass.description,
      academicYear: "2025-2026",
      level: randomClass.level
   };
}

export function generateSection(classId = null) {
   const selectedClassId = classId || generateClass().id;
   const classNumeric = parseInt(selectedClassId.replace(/\D/g, ''));
   const baseSectionNum = classNumeric * 3;
   const offset = faker.number.int({ min: 0, max: 2 });
   const sectionNum = baseSectionNum + offset;
   const sectionId = createId('SC', sectionNum, 2);
   const sectionName = generateRandomeSectionName();

   return {
      id: sectionId,
      name: sectionName,
      maxStudents: faker.number.int({ min: 20, max: 30 }),
      roomNumber: String(faker.number.int({ min: 1, max: 100 })),
      classId: selectedClassId
   };
}

export function generateSubject() {
   return generateRandomSubject();
}

/**
 * ******************************************************
 * VEHICLE GENERATOR HELPERS
 * ******************************************************
 */

export function generateVehicle(options = null) {
   const baseVehicle = faker.helpers.arrayElement(vehiclesData);

   const driverId = options?.driverId !== undefined
      ? options.driverId
      : generateRandomDriver(options?.drivers);

   return {
      id: options?.id || nanoid(5),
      name: baseVehicle.name,
      brand: baseVehicle.brand,
      model: baseVehicle.model,
      year: baseVehicle.year,
      type: baseVehicle.type,
      capacity: baseVehicle.capacity,
      licensePlate: options?.licensePlate || baseVehicle.licensePlate,
      driverId,
      purchaseDate: baseVehicle.purchaseDate,
      purchasePrice: baseVehicle.purchasePrice,
      initialMileage: baseVehicle.initialMileage,
      currentMileage: baseVehicle.currentMileage,
      status: options?.status || baseVehicle.status,
      notes: options?.notes !== undefined ? options.notes : baseVehicle.notes
   };
}

/**
 * ******************************************************
 * DRIVER GENERATOR HELPERS
 * ******************************************************
 */

export function generateDriver(options = null) {
   const gender = options?.gender || generateGender();
   const { firstName, lastName, fullName } = generateFullName(gender, options?.lastName);

   const licenseTypes = ['B', 'C', 'D'];
   const licenseType = faker.helpers.arrayElement(licenseTypes);
   const licensePrefix = faker.helpers.arrayElement(['M', 'L', 'D']);
   const licenseNumber = `${licensePrefix}${faker.string.numeric(8)}`;

   const yearsOfExperience = options?.yearsOfExperience ?? faker.number.int({ min: 2, max: 30 });
   const hireDate = options?.hireDate || faker.date.past({ years: 10 }).toISOString().split('T')[0];
   const licenseExpiry = options?.licenseExpiry || faker.date.future({ years: faker.number.int({ min: 1, max: 5 }) }).toISOString().split('T')[0];

   const baseSalary = 4500;
   const experienceBonus = yearsOfExperience * 150;
   const salary = options?.salary ?? baseSalary + experienceBonus + faker.number.int({ min: 0, max: 1000 });

   const emergencyGender = generateGender();
   const emergencyName = generateFullName(emergencyGender);

   return {
      id: options?.id || nanoid(5),
      name: fullName,
      email: generateEmail(firstName, lastName),
      cin: generateCIN(),
      phone: generatePhone(),
      address: options?.sharedAddress || generateAddress(),
      gender: gender,
      licenseNumber: licenseNumber,
      licenseType: licenseType,
      licenseExpiry: licenseExpiry,
      hireDate: hireDate,
      salary: salary,
      yearsOfExperience: yearsOfExperience,
      emergencyContact: emergencyName.fullName,
      emergencyPhone: generatePhone(),
      status: options?.status || 'active',
      notes: options?.notes || (Math.random() < 0.3 ? faker.lorem.sentence() : null)
   };
}

export function generateTeacher(options = null) {
   const gender = options?.gender || generateGender();
   const { firstName, lastName, fullName } = generateFullName(gender, options?.lastName);

   const yearsOfExperience = options?.yearsOfExperience ?? generateYearsOfExperience();
   const salary = options?.salary ?? generateTeacherSalary(yearsOfExperience);

   const hireDate = options?.hireDate || generateTeacherHireDate(yearsOfExperience);
   const bankAccount = options?.bankAccount || generateBankAccount();

   const emergencyGender = generateGender();
   const emergencyName = generateFullName(emergencyGender);

   const specialization = options?.specialization || generateTeacherSpecialization();

   let assignments = null;
   if (options?.assignments !== undefined) {
      assignments = options.assignments;
   } else if (options?.generateAssignments !== false) {
      const numAssignments = faker.number.int({ min: 1, max: 3 });
      assignments = generateTeacherAssignments(numAssignments);
   }

   const employmentTypes = ['fullTime', 'partTime', 'contract', 'temporary'];
   const employmentType = options?.employmentType || faker.helpers.arrayElement(employmentTypes);

   const academicDegreesList = ['Bachelor', 'Master', 'PhD', 'Diploma'];
   const academicDegrees = options?.academicDegrees || faker.helpers.arrayElement(academicDegreesList);

   const workloadHours = options?.workloadHours ?? faker.number.int({ min: 20, max: 40 });

   return {
      id: options?.id || nanoid(5),
      cin: generateCIN(),
      name: fullName,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      address: options?.sharedAddress || generateAddress(),
      gender: gender,
      specialization: specialization,
      yearsOfExperience: yearsOfExperience,
      salary: salary,
      hireDate: hireDate,
      bankAccount: bankAccount,
      employmentType: employmentType,
      workloadHours: workloadHours,
      academicDegrees: academicDegrees,
      emergencyContact: emergencyName.fullName,
      emergencyPhone: generatePhone(),
      status: options?.status || 'active',
      assignments: assignments
   };
}