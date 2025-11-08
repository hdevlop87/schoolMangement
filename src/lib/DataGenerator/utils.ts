import { faker } from '@faker-js/faker';
import { maleNames, femaleNames, lastNames, streets, cities, conditions, schoolNames, relationshipType, maritalStatus, sections, classesData, subjectsData, feeTypeData } from './data';
import sectionsData from '@/server/modules/seed/data/sections.json';


// ============================================
// PERSONAL INFO GENERATORS
// ============================================

export function generateGender() {
  return faker.helpers.arrayElement(['M', 'F']);
}

export function generateFirstName(gender) {
  return gender === 'M' 
    ? faker.helpers.arrayElement(maleNames)
    : faker.helpers.arrayElement(femaleNames);
}

export function generateLastName() {
  return faker.helpers.arrayElement(lastNames);
}

export function generateFullName(gender, lastName = null) {
  const firstName = generateFirstName(gender);
  const last = lastName || generateLastName();
  
  return {
    firstName,
    lastName: last,
    fullName: `${firstName} ${last}`
  };
}

// ============================================
// CONTACT INFO GENERATORS
// ============================================

export function generatePhone() {
  const prefix = Math.random() < 0.9 
    ? faker.helpers.arrayElement(['2126', '2127'])
    : '2125';
  return `${prefix}${faker.string.numeric(8)}`;
}

export function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const name = `${cleanFirstName}.${cleanLastName}`;
  return `${name}@${faker.helpers.arrayElement(domains)}`;
}

// ============================================
// LOCATION GENERATORS
// ============================================

export function generateStreet() {
  return faker.helpers.arrayElement(streets);
}

export function generateCity() {
  return faker.helpers.arrayElement(cities);
}

export function generateAddress(street = null, city = null) {
  const selectedStreet = street || generateStreet();
  const selectedCity = city || generateCity();
  const number = faker.number.int({ min: 1, max: 500 });
  return  `${number}, ${selectedStreet}, Casablanca`
}

// ============================================
// MOROCCAN ID GENERATORS
// ============================================

export function generateCIN() {
  const letters = faker.string.alpha({ length: 2, casing: 'upper' });
  const numbers = faker.string.numeric(6);
  return `${letters}${numbers}`;
}

export function generateNationality() {
  return Math.random() < 0.9 ? 'Moroccan' : faker.location.country();
}

// ============================================
// DATE GENERATORS
// ============================================

export function generateBirthdate(minAge, maxAge) {
  return faker.date.birthdate({ min: minAge, max: maxAge, mode: 'age' }).toISOString().split('T')[0];
}

export function generateParentBirthdate() {
  return generateBirthdate(25, 65);
}

export function generateStudentBirthdate() {
  return generateBirthdate(3, 19);
}

// ============================================
// SCHOOL DATA GENERATORS
// ============================================

export function generateStudentCode() {
  return `STU${faker.string.numeric(6)}`;
}

export function generateBloodType() {
  return faker.helpers.arrayElement([
    'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
  ]);
}

export function generateMaritalStatus() {
  return faker.helpers.arrayElement(maritalStatus);
}

export function generateRelationshipType() {
  return faker.helpers.arrayElement(relationshipType);
}

export function generateFinancialResponsibility() {
  return faker.helpers.arrayElement([
    'Full', 'Partial', 'None', 'Shared'
  ]);
}

export function createId(prefix, number, padding = 2) {
  const paddedNumber = String(number).padStart(padding, '0');
  return `${prefix}${paddedNumber}`;
}

export function generateRandomClass() {
  return faker.helpers.arrayElement(classesData);
}

export function generateRandomSubject() {
  return faker.helpers.arrayElement(subjectsData);
}

export function generateRandomeSectionName() {
  const availableSections = sections.slice(0, 3);
  return faker.helpers.arrayElement(availableSections);
}

export function generateEnrollmentDate() {
  return faker.date.past({ years: 5 }).toISOString().split('T')[0];
}

export function generateMedicalConditions() {
  if (Math.random() < 0.2) {
    return faker.helpers.arrayElement(conditions);
  }
  return '';
}

export function generatePreviousSchool() {
    if (Math.random() < 0.3) {
        return '';
    }
    return faker.helpers.arrayElement(schoolNames);
}

export function generateDiscount() {
  if (Math.random() < 0.7) return 0;
  return faker.number.int({ min: 50, max: 200 });
}

export function generateRandomFeeType() {
  return faker.helpers.arrayElement(feeTypeData)
}

export function generateSchedule(paymentType) {
  if (paymentType === 'recurring') {
    const recurringSchedules = ['monthly', 'quarterly', 'semester', 'annually'];
    return faker.helpers.arrayElement(recurringSchedules);
  }
  return 'oneTime';
}

// ============================================
// VEHICLE/DRIVER GENERATORS
// ============================================

export function generateRandomDriver(drivers) {
  if (!drivers || drivers.length === 0) {
    return null;
  }
  //@ts-ignore
  return faker.helpers.arrayElement(drivers)?.id;
}

// ============================================
// TEACHER GENERATORS
// ============================================

export function generateYearsOfExperience(min = 1, max = 25) {
  return faker.number.int({ min, max });
}

export function generateTeacherSalary(yearsOfExperience, baseSalary = 6000, experienceMultiplier = 200) {
  const experienceBonus = yearsOfExperience * experienceMultiplier;
  const randomBonus = faker.number.int({ min: 0, max: 2000 });
  return baseSalary + experienceBonus + randomBonus;
}

export function generateTeacherHireDate(yearsOfExperience) {
  return faker.date.past({ years: yearsOfExperience }).toISOString().split('T')[0];
}

export function generateBankAccount() {
  return faker.string.numeric(24);
}

export function generateTeacherSpecialization() {
  return faker.helpers.arrayElement(subjectsData).name;
}

export function generateTeacherLicenseNumber() {
  const licensePrefix = faker.helpers.arrayElement(['M', 'L', 'D']);
  return `${licensePrefix}${faker.string.numeric(8)}`;
}

export function generateTeacherAssignments(numAssignments = 1) {
  const assignments = [];

  for (let i = 0; i < numAssignments; i++) {
    const randomClass = generateRandomClass();
    const classId = randomClass.id;

    const classSections = sectionsData.filter(section => section.classId === classId);

    const numSections = faker.number.int({ min: 1, max: Math.min(3, classSections.length) });
    const selectedSections = faker.helpers.arrayElements(classSections, numSections);
    const sectionIds = selectedSections.map(section => section.id);

    const numSubjects = faker.number.int({ min: 1, max: 4 });
    const selectedSubjects = faker.helpers.arrayElements(subjectsData, numSubjects);
    const subjectIds = selectedSubjects.map(subject => subject.id);

    assignments.push({
      classId: classId,
      sectionIds: sectionIds,
      subjectIds: subjectIds
    });
  }

  return assignments;
}