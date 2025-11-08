import { Injectable } from 'najm-api';
import { SectionRepository } from './SectionRepository';
import { SectionValidator } from './SectionValidator';

@Injectable()
export class SectionService {
  constructor(
    private sectionRepository: SectionRepository,
    private sectionValidator: SectionValidator
  ) { }

  async getAll(filter) {
    return await this.sectionRepository.getAll(filter);
  }

  async getById(id) {
    await this.sectionValidator.checkExists(id);
    return await this.sectionRepository.getById(id);
  }

  async getStudents(sectionId) {
    await this.sectionValidator.checkExists(sectionId);
    return await this.sectionRepository.getStudents(sectionId);
  }

  async getAnalytics(sectionId) {
    await this.sectionValidator.checkExists(sectionId);
    return await this.sectionRepository.getAnalytics(sectionId);
  }

  async getClasses(sectionId) {
    await this.sectionValidator.checkExists(sectionId);
    return await this.sectionRepository.getClasses(sectionId);
  }

  async getTeachers(sectionId) {
    await this.sectionValidator.checkExists(sectionId);
    return await this.sectionRepository.getTeachers(sectionId);
  }

  async getParents(sectionId) {
    await this.sectionValidator.checkExists(sectionId);
    return await this.sectionRepository.getParents(sectionId);
  }

  async create(data) {
    const validatedData = await this.sectionValidator.validateCreateSection(data);
    await this.sectionValidator.checkClassExists(validatedData.classId);
    await this.sectionValidator.checkNameUniqueInClass(
      validatedData.classId,
      validatedData.name
    );
    return await this.sectionRepository.create(validatedData);
  }

  async update(id, data) {
    await this.sectionValidator.checkExists(id);
    const validatedData = await this.sectionValidator.validateUpdateSection(data);

    if (data.name) {
      await this.sectionValidator.checkNameUniqueInClassForUpdate(
        id,
        data.classId,
        data.name
      );
    }

    return await this.sectionRepository.update(id, validatedData);
  }


  async delete(id) {
    await this.sectionValidator.checkExists(id);
    await this.sectionValidator.checkHasNoStudents(id);
    return await this.sectionRepository.delete(id);
  }

  async deleteAll() {
    return await this.sectionRepository.deleteAll();
  }

  async seedDemoSections(sectionsData) {
    const createdSections = [];

    for (const sectionData of sectionsData) {
      try {
        const sectionEntity = await this.create(sectionData);
        createdSections.push(sectionEntity);
      } catch (error) {
        continue;
      }
    }

    return createdSections;
  }
}