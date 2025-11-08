import { Injectable, t } from 'najm-api';
import { SectionRepository } from './SectionRepository';
import { ClassRepository } from '../classes/ClassRepository';
import { parseSchema } from '@/server/shared';
import { sectionSchema } from '@/lib/validations';

@Injectable()
export class SectionValidator {
  constructor(
    private sectionRepository: SectionRepository,
    private classRepository: ClassRepository
  ) {}

  async validateCreateSection(data) {
    return parseSchema(sectionSchema, data);
  }

  async validateUpdateSection(data) {
    const updateSchema = sectionSchema.partial();
    return parseSchema(updateSchema, data);
  }

  async checkExists(id) {
    const section = await this.sectionRepository.getById(id);
    if (!section) {
      throw new Error(t('sections.errors.notFound'));
    }
    return section;
  }

  async checkExistsByName(name, classId) {
    const classSections = await this.sectionRepository.getByClass(classId);
    const section = classSections.find(s => s.name === name);
    if (!section) {
      throw new Error(t('sections.errors.notFound', { sectionName: name }));
    }
    return section;
  }

  async validateSection(identifier) {
    if (identifier.id) {
      return await this.checkExists(identifier.id);
    } else if (identifier.name && identifier.classId) {
      return await this.checkExistsByName(identifier.name, identifier.classId);
    } else {
      throw new Error(t('sections.errors.notFound'));
    }
  }

  async checkClassExists(classId) {
    const existingClass = await this.classRepository.getById(classId);
    if (!existingClass) {
      throw new Error(t('classes.errors.notFound'));
    }
    return true;
  }

  async checkNameUniqueInClass(classId, name) {
    const exists = await this.sectionRepository.checkNameExistsInClass(classId, name);
    if (exists) {
      throw new Error(t('sections.errors.nameExistsInClass'));
    }
    return true;
  }

  async checkNameUniqueInClassForUpdate(id, classId?, name?) {
    if (!classId && !name) return true;

    const currentSection = await this.sectionRepository.getById(id);
    const checkClassId = classId || currentSection.classId;
    const checkName = name || currentSection.name;

    const exists = await this.sectionRepository.checkNameExistsInClass(
      checkClassId,
      checkName,
      id
    );

    if (exists) {
      throw new Error(t('sections.errors.nameExistsInClass'));
    }
    return true;
  }

  async checkHasNoStudents(sectionId) {
    const hasStudents = await this.sectionRepository.checkHasStudents(sectionId);
    if (hasStudents) {
      throw new Error(t('sections.errors.hasStudents'));
    }
    return true;
  }

  async validateSectionInClass(sectionId, sectionName, classId, className) {
    if (!sectionId && !sectionName) {
      throw new Error(t('sections.errors.sectionRequired'));
    }

    // Resolve classId from className if needed
    let resolvedClassId = classId;
    if (!resolvedClassId && className) {
      const classEntity = await this.classRepository.getByName(className);
      if (!classEntity) {
        throw new Error(t('classes.errors.notFound', { className }));
      }
      resolvedClassId = classEntity.id;
    }

    if (sectionId) {
      const sectionEntity = await this.validateSection({ id: sectionId });
      if (resolvedClassId && sectionEntity.classId !== resolvedClassId) {
        throw new Error(t('sections.errors.notInClass'));
      }
      return sectionEntity.id;
    }

    if (sectionName && resolvedClassId) {
      const sectionEntity = await this.validateSection({
        name: sectionName,
        classId: resolvedClassId
      });
      return sectionEntity.id;
    }

    throw new Error(t('sections.errors.validationFailed'));
  }

}