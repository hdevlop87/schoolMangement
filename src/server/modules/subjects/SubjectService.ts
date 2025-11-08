import { Injectable } from 'najm-api';
import { SubjectRepository } from './SubjectRepository';
import { SubjectValidator } from './SubjectValidator';

@Injectable()
export class SubjectService {
  constructor(
    private subjectRepository: SubjectRepository,
    private subjectValidator: SubjectValidator
  ) { }

  async getAll() {
    return await this.subjectRepository.getAll();
  }

  async getById(id) {
    await this.subjectValidator.checkExists(id);
    return await this.subjectRepository.getById(id);
  }


  async create(data) {
    const validatedData = await this.subjectValidator.validateCreateSubject(data);
    await this.subjectValidator.checkCodeUnique(validatedData.code);
    return await this.subjectRepository.create(validatedData);
  }

  async update(id, data) {
    const validatedData = await this.subjectValidator.validateUpdateSubject(data);
    await this.subjectValidator.checkExists(id);
    if (data.code) {
      await this.subjectValidator.checkCodeUniqueForUpdate(id, data.code);
    }
    return await this.subjectRepository.update(id, validatedData);
  }

  async delete(id) {
    await this.subjectValidator.checkExists(id);
    return await this.subjectRepository.delete(id);
  }

  async deleteAll() {
    return await this.subjectRepository.deleteAll();
  }

  async seedDemoSubjects(subjectsData) {
    const createdSubjects = [];

    for (const subjectData of subjectsData) {
      try {
        const subjectEntity = await this.create(subjectData);
        createdSubjects.push(subjectEntity);
      } catch (error) {
        continue;
      }
    }

    return createdSubjects;
  }
}