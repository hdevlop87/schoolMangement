import { Injectable, t } from 'najm-api';
import { TeacherRepository } from './TeacherRepository';
import { parseSchema, isEmpty } from '@/server/shared';
import { UserValidator } from '../users';
import { teacherSchema } from '@/lib/validations';
import { SectionValidator } from '../sections';
import { ClassValidator } from '../classes';
import { SubjectValidator } from '../subjects';

@Injectable()
export class TeacherValidator {
  constructor(
    private teacherRepository: TeacherRepository,
    private sectionValidator: SectionValidator,
    private userValidator: UserValidator,
    private classValidator: ClassValidator,
    private subjectValidator: SubjectValidator,
  ) { }

  // ========== SCHEMA VALIDATION ==========

  async validateCreate(data) {
    return parseSchema(teacherSchema, data);
  }

  async validateUpdate(data) {
    return parseSchema(teacherSchema.partial(), data);
  }

  // ========== UNIQUENESS CHECKS ==========

  async checkUserIdIsUnique(id) {
    await this.userValidator.checkUserIdIsUnique(id);
  }

  async checkIdIsUnique(id) {
    const existingTeacher = await this.teacherRepository.getById(id);
    if (existingTeacher) {
      throw new Error(t('teachers.errors.idExists'));
    }
  }

  async checkCinIsUnique(cin, excludeId = null) {
    if (!cin) return;
    const existingTeacher = await this.teacherRepository.getByCin(cin);
    if (existingTeacher && existingTeacher.id !== excludeId) {
      throw new Error(t('teachers.errors.cinExists'));
    }
  }

  async checkEmailIsUnique(email, excludeId = null) {
    if (!email) return;
    const existingTeacher = await this.teacherRepository.getByEmail(email);
    if (existingTeacher && existingTeacher.id !== excludeId) {
      throw new Error(t('teachers.errors.emailExists'));
    }
  }

  async checkPhoneIsUnique(phone, excludeId = null) {
    if (!phone) return;
    const existingTeacher = await this.teacherRepository.getByPhone(phone);
    if (existingTeacher && existingTeacher.id !== excludeId) {
      throw new Error(t('teachers.errors.phoneExists'));
    }
  }

  // ========== EXISTENCE CHECKS ==========

  async isExists(id) {
    const existingTeacher = await this.teacherRepository.getById(id);
    return !!existingTeacher;
  }

  async isCinExists(cin) {
    if (!cin) return false;
    const existingTeacher = await this.teacherRepository.getByCin(cin);
    return !!existingTeacher;
  }

  async isEmailExists(email) {
    if (!email) return false;
    const existingTeacher = await this.teacherRepository.getByEmail(email);
    return !!existingTeacher;
  }

  async isPhoneExists(phone) {
    if (!phone) return false;
    const existingTeacher = await this.teacherRepository.getByPhone(phone);
    return !!existingTeacher;
  }

  async checkExists(id) {
    const teacherExists = await this.isExists(id);
    if (!teacherExists) {
      throw new Error(t('teachers.errors.notFound'));
    }
    return true;
  }

  async checkCinExists(cin) {
    const teacher = await this.teacherRepository.getByCin(cin);
    if (!teacher) {
      throw new Error(t('teachers.errors.notFound'));
    }
    return teacher;
  }

  async checkEmailExists(email) {
    const teacher = await this.teacherRepository.getByEmail(email);
    if (!teacher) {
      throw new Error(t('teachers.errors.notFound'));
    }
    return teacher;
  }

  async checkPhoneExists(phone) {
    const teacher = await this.teacherRepository.getByPhone(phone);
    if (!teacher) {
      throw new Error(t('teachers.errors.notFound'));
    }
    return teacher;
  }

  // ========== UNIFIED VALIDATION ==========

  async validate(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkExists(excludeId);
    }

    const schema = isUpdate ? teacherSchema.partial() : teacherSchema;
    const validatedData = parseSchema(schema, data);

    const { id, userId, cin, email, phone, assignments } = data;

    if (!isUpdate) {
      
      if (userId) await this.checkUserIdIsUnique(userId);
      if (id) await this.checkIdIsUnique(id);
    }
    
    if (cin) await this.checkCinIsUnique(cin, excludeId);
    if (email) await this.checkEmailIsUnique(email, excludeId);
    if (phone) await this.checkPhoneIsUnique(phone, excludeId);
    
    if (!isEmpty(assignments)) {
      await this.validateAssignments(assignments);
    }

    return validatedData;
  }

  // ========== ASSIGNMENT VALIDATION ==========

  async validateAssignments(assignments) {
    if (isEmpty(assignments)) return;

    for (const assignment of assignments) {
      const { classId, sectionIds, subjectIds } = assignment;

      await this.classValidator.checkExists(classId);

      if (!isEmpty(subjectIds)) {
        for (const subjectId of subjectIds) {
          await this.subjectValidator.checkExists(subjectId);
        }
      }

      if (!isEmpty(sectionIds)) {
        for (const sectionId of sectionIds) {
          await this.sectionValidator.validateSectionInClass(sectionId, null, classId, null);
        }
      }
    }
  }

  // ========== SECTION & ASSIGNMENT VALIDATION ==========

  async checkInSection(teacherId, sectionId) {
    await this.sectionValidator.checkExists(sectionId);
    await this.checkExists(teacherId);
    const isInSection = await this.teacherRepository.checkInSection(teacherId, sectionId);
    if (!isInSection) {
      throw new Error(t('teachers.errors.notInSection'));
    }
    return true;
  }

  async checkAssignmentExists(teacherId, subjectId, sectionId) {
    const assignment = await this.teacherRepository.getTeacherAssignment(
      teacherId,
      subjectId,
      sectionId
    );

    if (!assignment) {
      throw new Error(t('teachers.errors.assignmentNotFound'));
    }

    return true;
  }

  async checkAssignmentExistsById(assignmentId) {
    const assignment = await this.teacherRepository.getTeacherAssignmentById(assignmentId);

    if (!assignment) {
      throw new Error(t('teachers.errors.assignmentNotFound'));
    }

    return true;
  }

}