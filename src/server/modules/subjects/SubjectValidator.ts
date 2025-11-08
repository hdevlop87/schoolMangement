import { Injectable, t } from 'najm-api';
import { SubjectRepository } from './SubjectRepository';
import { parseSchema } from '@/server/shared';
import { subjectSchema } from '@/lib/validations';

@Injectable()
export class SubjectValidator {
  constructor(private subjectRepository: SubjectRepository) {}

  async validateCreateSubject(data) {
    return parseSchema(subjectSchema, data);
  }

  async validateUpdateSubject(data) {
    const updateSchema = subjectSchema.partial();
    return parseSchema(updateSchema, data);
  }

  async checkExists(id) {
    const subject = await this.subjectRepository.getById(id);
    if (!subject) {
      throw new Error(t('subjects.errors.notFound'));
    }
    return true;
  }

  async checkCodeUnique(code) {
    const existing = await this.subjectRepository.getByCode(code);
    if (existing) {
      throw new Error(t('subjects.errors.codeExists'));
    }
    return true;
  }

  async checkCodeUniqueForUpdate(id, code?) {
    if (!code) return true;

    const existing = await this.subjectRepository.getByCode(code);
    if (existing && existing.id !== id) {
      throw new Error(t('subjects.errors.codeExists'));
    }
    return true;
  }

  async checkNameUnique(name) {
    const existing = await this.subjectRepository.getByName(name);
    if (existing) {
      throw new Error(t('subjects.errors.nameExists'));
    }
    return true;
  }

  async checkNameUniqueForUpdate(id, name?) {
    if (!name) return true;

    const existing = await this.subjectRepository.getByName(name);
    if (existing && existing.id !== id) {
      throw new Error(t('subjects.errors.nameExists'));
    }
    return true;
  }

  async checkExistsByCode(code) {
    const subject = await this.subjectRepository.getByCode(code);
    if (!subject) {
      throw new Error(t('subjects.errors.notFound'));
    }
    return subject;
  }

  async checkExistsByName(name) {
    const subject = await this.subjectRepository.getByName(name);
    if (!subject) {
      throw new Error(t('subjects.errors.notFound'));
    }
    return subject;
  }

}