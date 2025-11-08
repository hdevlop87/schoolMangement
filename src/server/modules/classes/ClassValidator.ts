import { Injectable, t } from 'najm-api';
import { ClassRepository } from './ClassRepository';
import { parseSchema } from '@/server/shared';
import { classSchema } from '@/lib/validations';

@Injectable()
export class ClassValidator {
  constructor(private classRepository: ClassRepository) { }

  async validateCreate(data) {
    return parseSchema(classSchema, data);
  }

  async validateUpdate(data) {
    const updateSchema = classSchema.partial();
    return parseSchema(updateSchema, data);
  }

  async checkExists(id) {
    const existingClass = await this.classRepository.getById(id);
    if (!existingClass) {
      throw new Error(t('classes.errors.notFound'));
    }
    return existingClass;
  }

  async checkExistsByName(name) {
    const existingClass = await this.classRepository.getByName(name);
    if (!existingClass) {
      throw new Error(t('classes.errors.notFound', { className: name }));
    }
    return existingClass;
  }

  async validate(identifier) {
    // identifier can be { id } or { name }
    if (identifier.id) {
      return await this.checkExists(identifier.id);
    } else if (identifier.name) {
      return await this.checkExistsByName(identifier.name);
    } else {
      throw new Error(t('classes.errors.notFound'));
    }
  }

  async checkNameUnique(name) {
    const existing = await this.classRepository.getByName(name);
    if (existing) {
      throw new Error(t('classes.errors.nameExists'));
    }
    return true;
  }

  async checkNameUniqueForUpdate(id, name?) {
    if (!name) return true;

    const existing = await this.classRepository.getByName(name);
    if (existing && existing.id !== id) {
      throw new Error(t('classes.errors.nameExists'));
    }
    return true;
  }

  async checkHasNoSections(classId) {
    const hasSections = await this.classRepository.checkClassHasSections(classId);
    if (hasSections) {
      throw new Error(t('classes.errors.hasSections'));
    }
    return true;
  }

  async validateClass(classId, className) {
    if (!classId && !className) {
      throw new Error(t('classes.errors.classRequired'));
    }

    if (classId) {
      const classEntity = await this.validate({ id: classId });
      return classEntity.id;
    }

    if (className) {
      const classEntity = await this.validate({ name: className });
      return classEntity.id;
    }
  }
}