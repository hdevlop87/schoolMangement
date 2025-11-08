import { Injectable, Transactional } from 'najm-api';
import { ParentRepository } from './ParentRepository';
import { ParentValidator } from './ParentValidator';
import { UserService } from '../users/UserService';
import { calculateAge, formatDate, pickProps, isEmpty } from '@/server/shared';

@Injectable()
export class ParentService {

  constructor(
    private parentRepository: ParentRepository,
    private parentValidator: ParentValidator,
    private userService: UserService,
  ) { }

  private resolveParentImage(image?, gender?) {
    if (image) return image;
    if (gender === 'F') return '/images/mother.png';
    return '/images/father.png';
  }

  // ========== RETRIEVAL METHODS ==========

  async getAll(filter) {
    return await this.parentRepository.getAll(filter);
  }

  async getCount() {
    return await this.parentRepository.getCount();
  }

  async getById(id) {
    await this.parentValidator.checkExists(id);
    return await this.parentRepository.getById(id);
  }

  async getByCin(cin) {
    await this.parentValidator.checkCinExists(cin);
    return await this.parentRepository.getByCin(cin);
  }

  async getByPhone(phone) {
    await this.parentValidator.checkPhoneExists(phone);
    return await this.parentRepository.getByPhone(phone);
  }

  async getChildren(id) {
    await this.parentValidator.checkExists(id);
    return await this.parentRepository.getChildren(id);
  }

  // ========== CREATE-METHOD ==========

  @Transactional()
  async create(data) {
    await this.parentValidator.validate(data);

    const parentImage = this.resolveParentImage(data.image, data.gender);

    const user = await this.userService.create({
      id: data.userId,
      email: data.email,
      image: parentImage,
      role: 'parent',
    });

    const parent = await this.parentRepository.create({
      id: data.id || data.parentId,
      userId: user.id,
      name: data.name,
      email: data.email,
      cin: data.cin,
      phone: data.phone,
      gender: data.gender,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      age: calculateAge(data.dateOfBirth),
      occupation: data.occupation,
      nationality: data.nationality,
      maritalStatus: data.maritalStatus,
      relationshipType: data.relationshipType,
      isEmergencyContact: data.isEmergencyContact,
      financialResponsibility: data.financialResponsibility,
    });
    return parent;
  }

  // ========== UPDATE-METHOD ==========

  async update(id, data) {

    const USER_UPDATE_KEYS = [
      'name', 'email', 'image', 'password'
    ];

    const PARENT_UPDATE_KEYS = [
      'name', 'email', 'cin', 'phone', 'gender', 'address', 'dateOfBirth',
      'occupation', 'nationality', 'maritalStatus', 'relationshipType',
      'isEmergencyContact', 'financialResponsibility'
    ];

    await this.parentValidator.validate(data, id);

    const parent = await this.parentRepository.getById(id);
    const userData = pickProps(data, USER_UPDATE_KEYS);
    const parentData = pickProps(data, PARENT_UPDATE_KEYS);

    if (!isEmpty(userData)) {
      await this.userService.update(parent.userId, userData);
    }

    await this.parentValidator.validateUpdate(parentData);
    return await this.parentRepository.update(id, parentData);

  }

  // ========== DELETE-METHODS ==========

  async delete(id) {
    await this.parentValidator.checkCanDelete(id);
    const deletedParent = await this.parentRepository.delete(id);
    return deletedParent;
  }

  async deleteAll() {
    return await this.parentRepository.deleteAll();
  }

  // ========== RELATIONSHIP METHODS ==========

  async linkStudent(parentId, studentId) {
    await this.parentValidator.checkExists(parentId);
    await this.parentValidator.checkStudentExists(studentId);
    await this.parentValidator.checkStudentNotLinked(parentId, studentId);

    const linkDetails = {
      parentId,
      studentId,
    };

    return await this.parentRepository.linkStudent(linkDetails);
  }

  async unlinkStudent(parentId, studentId) {
    await this.parentValidator.checkExists(parentId);
    await this.parentValidator.checkStudentExists(studentId);
    await this.parentValidator.checkStudentLinked(parentId, studentId);
    return await this.parentRepository.unlinkStudent(parentId, studentId);
  }

  // ========== SEED METHOD ==========

  async seedDemoParents(parentsData) {
    const createdParents = [];

    for (const parentData of parentsData) {
      try {
        const parent = await this.create(parentData);
        createdParents.push(parent);
      } catch (error) {
        continue;
      }
    }

    return createdParents;
  }

  // ========== UTILITY METHODS ==========

  async processParents(student?, parents?) {
    if (isEmpty(parents)) return;
    
    const studentId = student?.id;
    const linkedParentIds = [];

    for (const parentData of parents) {
      let parentId;

      if (typeof parentData === 'string') {
        try {
          await this.getById(parentData);
          parentId = parentData;
          linkedParentIds.push(parentId);
        } catch (error) {
          throw new Error(`Parent with ID ${parentData} not found`);
        }
      }

      else {
        if (parentData.cin) {
          try {
            const existingParent = await this.getByCin(parentData.cin);
            parentId = existingParent.id;
            linkedParentIds.push(parentId);
          } catch (error) {
            const newParent = await this.create(parentData);
            parentId = newParent.id;
            linkedParentIds.push(parentId);
          }
        }
        else if (parentData.phone) {
          try {
            const existingParent = await this.getByPhone(parentData.phone);
            parentId = existingParent.id;
            linkedParentIds.push(parentId);
          } catch (error) {
            const newParent = await this.create(parentData);
            parentId = newParent.id;
            linkedParentIds.push(parentId);
          }
        }
        else {
          const newParent = await this.create(parentData);
          parentId = newParent.id;
          linkedParentIds.push(parentId);
        }
      }
      await this.linkStudent(parentId, studentId);
    }

    return linkedParentIds;
  }

}