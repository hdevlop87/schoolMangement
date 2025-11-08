import { Injectable, t } from 'najm-api';
import { StudentRepository } from './StudentRepository';
import { parseSchema } from '@/server/shared';
import { UserValidator } from '../users';
import { ClassValidator } from '../classes/ClassValidator';
import { SectionValidator } from '../sections/SectionValidator';
import { studentSchema } from '@/lib/validations';

@Injectable()
export class StudentValidator {
  constructor(
    private studentRepository: StudentRepository,
    private userValidator: UserValidator,
    private classValidator: ClassValidator,
    private sectionValidator: SectionValidator,
  ) { }

  async validateCreate(data) {
    return parseSchema(studentSchema, data);
  }

  async validateUpdate(data) {
    return parseSchema(studentSchema.partial(), data);
  }

  async checkUserIdIsUnique(id: string) {
    await this.userValidator.checkUserIdIsUnique(id);
  }

  async checkIdIsUnique(id: string) {
    const existingStudent = await this.studentRepository.getById(id);
    if (existingStudent) {
      throw new Error(t('students.errors.idExists'));
    }
  }

  async isExists(id) {
    const existingStudent = await this.studentRepository.getById(id);
    return !!existingStudent;
  }

  async isCodeExists(studentCode) {
    if (!studentCode) return false;
    const existingStudent = await this.studentRepository.getByStudentCode(studentCode);
    return !!existingStudent;
  }

  async isEmailExists(email) {
    if (!email) return false;
    const existingStudent = await this.studentRepository.getByEmail(email);
    return !!existingStudent;
  }

  async isPhoneExists(phone) {
    if (!phone) return false;
    const existingStudent = await this.studentRepository.getByPhone(phone);
    return !!existingStudent;
  }

  //======================= Existence Checks (throw errors)

  async checkExists(id) {
    const studentExists = await this.studentRepository.getById(id);
    if (!studentExists) {
      throw new Error(t('students.errors.notFound'));
    }
    return studentExists;
  }

  async checkCodeExists(studentCode) {
    const student = await this.studentRepository.getByStudentCode(studentCode);
    if (!student) {
      throw new Error(t('students.errors.notFound'));
    }
    return student;
  }

  async checkEmailExists(email) {
    const student = await this.studentRepository.getByEmail(email);
    if (!student) {
      throw new Error(t('students.errors.notFound'));
    }
    return student;
  }

  async checkPhoneExists(phone) {
    const student = await this.studentRepository.getByPhone(phone);
    if (!student) {
      throw new Error(t('students.errors.notFound'));
    }
    return student;
  }

  //======================= Uniqueness Checks (throw errors)

  async checkCodeIsUnique(studentCode, excludeId = null) {
    if (!studentCode) return;
    const existingStudent = await this.studentRepository.getByStudentCode(studentCode);
    if (existingStudent && existingStudent.id !== excludeId) {
      throw new Error(t('students.errors.studentCodeExists'));
    }
  }

  async checkEmailIsUnique(email, excludeId = null) {
    if (!email) return;
    const existingStudent = await this.studentRepository.getByEmail(email);
    if (existingStudent && existingStudent.id !== excludeId) {
      throw new Error(t('students.errors.emailExists'));
    }
  }

  async checkPhoneIsUnique(phone, excludeId = null) {
    if (!phone) return;
    const existingStudent = await this.studentRepository.getByPhone(phone);
    if (existingStudent && existingStudent.id !== excludeId) {
      throw new Error(t('students.errors.phoneExists'));
    }
  }

  //======================= Class and Section Validation

  async checkInSection(studentId, sectionId) {
    await this.sectionValidator.checkExists(sectionId);
    await this.checkExists(studentId);
    const student = await this.studentRepository.getById(studentId);
    if (student.sectionId !== sectionId) {
      throw new Error(t('students.errors.notInSection'));
    }
    return true;
  }

  //======================= Unified Validation Method

  async validate(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkExists(excludeId);
    }

    const schema = isUpdate ? studentSchema.partial() : studentSchema;
    const validatedData = parseSchema(schema, data);

    const { id, userId, studentCode, email, phone, classId, className, sectionId, sectionName } = data;

    if (!isUpdate) {
      if (userId) await this.checkUserIdIsUnique(userId);
      if (id) await this.checkIdIsUnique(id);
    }

    if (studentCode) await this.checkCodeIsUnique(studentCode, excludeId);
    if (email) await this.checkEmailIsUnique(email, excludeId);
    if (phone) await this.checkPhoneIsUnique(phone, excludeId);

    if (classId || className) {
      await this.classValidator.validateClass(classId, className);
    }
    if (sectionId || sectionName) {
      await this.sectionValidator.validateSectionInClass(sectionId, sectionName, classId, className);
    }

    return validatedData;
  }

}