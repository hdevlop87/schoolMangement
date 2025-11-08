import { Injectable, t } from 'najm-api';
import { ParentRepository } from './ParentRepository';
import { parseSchema } from '@/server/shared';
import { UserValidator } from '../users';
import { parentSchema } from '@/lib/validations';

@Injectable()
export class ParentValidator {
  constructor(
    private parentRepository: ParentRepository,
    private userValidator: UserValidator,
  ) { }

  // ========== SCHEMA VALIDATION ==========

  async validateCreate(data) {
    return parseSchema(parentSchema, data);
  }

  async validateUpdate(data) {
    return parseSchema(parentSchema.partial(), data);
  }

  // ========== UNIQUENESS CHECKS ==========

  async checkUserIdIsUnique(id: string) {
    return await this.userValidator.checkUserIdIsUnique(id);
  }

  async checkIdIsUnique(id: string) {
    const existingParent = await this.parentRepository.getById(id);
    if (existingParent) {
      throw new Error(t('parents.errors.idExists'));
    }
  }

  async checkEmailIsUnique(email: string, excludeId: string = null) {
    if (!email) return;

    const existingParent = await this.parentRepository.getByEmail(email);
    if (existingParent && existingParent.id !== excludeId) {
      throw new Error(t('parents.errors.emailExists'));
    }
  }

  async checkCinIsUnique(cin: string, excludeId: string = null) {
    if (!cin) return;

    const existingParent = await this.parentRepository.getByCin(cin);
    if (existingParent && existingParent.id !== excludeId) {
      throw new Error(t('parents.errors.cinExists'));
    }
  }

  async checkPhoneIsUnique(phone: string, excludeId: string = null) {
    if (!phone) return;

    const existingParent = await this.parentRepository.getByPhone(phone);
    if (existingParent && existingParent.id !== excludeId) {
      throw new Error(t('parents.errors.phoneExists'));
    }
  }

  // ========== EXISTENCE CHECKS ==========

  async isExists(id: string) {
    const existingParent = await this.parentRepository.getById(id);
    return !!existingParent;
  }

  async isEmailExists(email: string) {
    if (!email) return false;
    const existingParent = await this.parentRepository.getByEmail(email);
    return !!existingParent;
  }

  async isPhoneExists(phone: string) {
    if (!phone) return false;
    const existingParent = await this.parentRepository.getByPhone(phone);
    return !!existingParent;
  }

  async isParentLinkedToStudents(parentId: string) {
    return await this.parentRepository.checkLinkedToStudents(parentId);
  }

  // ========== EXISTENCE CHECKS (THROWING) ==========

  async checkExists(id: string) {
    const parentExists = await this.isExists(id);
    if (!parentExists) {
      throw new Error(t('parents.errors.notFound'));
    }
    return true;
  }

  async checkEmailExists(email: string) {
    const parent = await this.parentRepository.getByEmail(email);
    if (!parent) {
      throw new Error(t('parents.errors.notFound'));
    }
    return parent;
  }

  async checkCinExists(cin: string) {
    const parent = await this.parentRepository.getByCin(cin);
    if (!parent) {
      throw new Error(t('parents.errors.notFound'));
    }
    return parent;
  }

  async checkPhoneExists(phone: string) {
    const parent = await this.parentRepository.getByPhone(phone);
    if (!parent) {
      throw new Error(t('parents.errors.notFound'));
    }
    return parent;
  }

  // ========== FIELD VALIDATION ==========

  async validateGender(gender: string) {
    const validGenders = ['M', 'F', 'Other'];
    if (!validGenders.includes(gender)) {
      throw new Error(t('parents.errors.invalidGender'));
    }
    return true;
  }

  async validateRelationshipType(relationshipType: string) {
    const validTypes = ['father', 'mother', 'guardian', 'stepparent', 'grandparent', 'other'];
    if (!validTypes.includes(relationshipType)) {
      throw new Error(t('parents.errors.invalidRelationshipType'));
    }
    return true;
  }

  async validateMaritalStatus(maritalStatus: string) {
    const validStatuses = ['single', 'married', 'divorced', 'widowed', 'separated'];
    if (!validStatuses.includes(maritalStatus)) {
      throw new Error(t('parents.errors.invalidMaritalStatus'));
    }
    return true;
  }

  // ========== WORKFLOW VALIDATION ==========

  async checkCanDelete(id: string) {
    const hasLinkedStudents = await this.isParentLinkedToStudents(id);
    if (hasLinkedStudents) {
      throw new Error(t('parents.errors.hasLinkedStudents'));
    }
    return true;
  }

  async checkNotLinkedToStudents(parentId: string) {
    return await this.checkCanDelete(parentId);
  }

  async checkStudentExists(studentId: string) {
    const studentExists = await this.parentRepository.checkStudentExists(studentId);
    if (!studentExists) {
      throw new Error(t('students.errors.notFound'));
    }
    return true;
  }

  async checkStudentLinked(parentId: string, studentId: string) {
    const isLinked = await this.parentRepository.checkStudentLinked(parentId, studentId);
    if (!isLinked) {
      throw new Error(t('parents.errors.studentNotLinked'));
    }
    return true;
  }

  async checkStudentNotLinked(parentId: string, studentId: string) {
    const isLinked = await this.parentRepository.checkStudentLinked(parentId, studentId);
    if (isLinked) {
      throw new Error(t('parents.errors.studentAlreadyLinked'));
    }
    return true;
  }

  // ========== MAIN VALIDATION METHOD ==========

  async validate(data, excludeId: string = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkExists(excludeId);
    }

    const schema = isUpdate ? parentSchema.partial() : parentSchema;
    const validatedData = parseSchema(schema, data);

    const {
      userId,
      id,
      parentId,
      email,
      cin,
      phone,
      gender,
      relationshipType,
      maritalStatus
    } = data;

    const actualParentId = id || parentId;

    if (!isUpdate) {
      if (userId) await this.checkUserIdIsUnique(userId);
      if (actualParentId) await this.checkIdIsUnique(actualParentId);
    }

    if (gender) await this.validateGender(gender);
    if (relationshipType) await this.validateRelationshipType(relationshipType);
    if (maritalStatus) await this.validateMaritalStatus(maritalStatus);

    if (email) await this.checkEmailIsUnique(email, excludeId);
    if (cin) await this.checkCinIsUnique(cin, excludeId);
    if (phone) await this.checkPhoneIsUnique(phone, excludeId);

    return validatedData;
  }

}