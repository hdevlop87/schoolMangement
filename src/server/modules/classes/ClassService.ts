import { Injectable } from 'najm-api';
import { ClassRepository } from './ClassRepository';
import { ClassValidator } from './ClassValidator';

@Injectable()
export class ClassService {

  constructor(
    private classRepository: ClassRepository,
    private classValidator: ClassValidator
  ) { }

  async getAll(filter) {
    return await this.classRepository.getAll(filter);
  }

  async getCount() {
    return await this.classRepository.getCount();
  }

  async getById(id) {
    await this.classValidator.checkExists(id);
    return await this.classRepository.getById(id);
  }

  async getByAcademicYear(academicYear) {
    return await this.classRepository.getByAcademicYear(academicYear);
  }

  async getSections(classId) {
    await this.classValidator.checkExists(classId);
    return await this.classRepository.getClassSections(classId);
  }

  async getStudents(classId) {
    await this.classValidator.checkExists(classId);
    return await this.classRepository.getClassStudents(classId);
  }

  async getTeachers(classId) {
    await this.classValidator.checkExists(classId);
    return await this.classRepository.getTeachers(classId);
  }

  async getParents(classId) {
    await this.classValidator.checkExists(classId);
    return await this.classRepository.getParents(classId);
  }

  async getAnalytics(classId) {
    await this.classValidator.checkExists(classId);
    return await this.classRepository.getAnalytics(classId);
  }

  async getStudentsByName(className, sectionName = null) {
    await this.classValidator.checkExistsByName(className);
    return await this.classRepository.getStudentsByClassName(className, sectionName);
  }

  async create(data) {
    const validatedData = await this.classValidator.validateCreate(data);
    await this.classValidator.checkNameUnique(validatedData.name);
    return await this.classRepository.create(validatedData);
  }

  async update(id, data) {
    const validatedData = await this.classValidator.validateUpdate(data);
    await this.classValidator.checkExists(id);

    if (data.name) {
      await this.classValidator.checkNameUniqueForUpdate(id, data.name);
    }

    return await this.classRepository.update(id, validatedData);
  }

  async delete(id) {
    await this.classValidator.checkExists(id);
    await this.classValidator.checkHasNoSections(id);
    return await this.classRepository.delete(id);
  }

  async deleteAll() {
    return await this.classRepository.deleteAll();
  }

  async seedDemoClasses(classesData) {
    const createdClasses = [];
    for (const classData of classesData) {
      try {
        const classEntity = await this.create(classData);
        createdClasses.push(classEntity);
      } catch (error) {
        continue;
      }
    }

    return createdClasses;
  }
}