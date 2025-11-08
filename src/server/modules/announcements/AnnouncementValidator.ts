import { Injectable, t } from 'najm-api';
import { AnnouncementRepository } from './AnnouncementRepository';
import { parseSchema } from '@/server/shared';
import { announcementSchema } from '@/lib/validations';
import { ClassValidator } from '../classes/ClassValidator';
import { SectionValidator } from '../sections/SectionValidator';

@Injectable()
export class AnnouncementValidator {
  constructor(
    private announcementRepository: AnnouncementRepository,
    private classValidator: ClassValidator,
    private sectionValidator: SectionValidator,
  ) { }

  async validateCreate(data) {
    return parseSchema(announcementSchema, data);
  }

  async validateUpdate(data) {
    return parseSchema(announcementSchema.partial(), data);
  }

  // ========================================
  // Existence Checks (throw errors)
  // ========================================

  async checkExists(id) {
    const announcementExists = await this.announcementRepository.getById(id);
    if (!announcementExists) {
      throw new Error(t('announcements.errors.notFound'));
    }
    return announcementExists;
  }

  // ========================================
  // Business Logic Validations
  // ========================================

  async validateTargetAudience(targetAudience: string, classId?: string, sectionId?: string) {
    // If target audience is 'all', no class/section should be specified
    if (targetAudience === 'all' && (classId || sectionId)) {
      throw new Error(t('announcements.errors.allAudienceNoClassSection'));
    }

    // If classId provided, validate it exists
    if (classId) {
      await this.classValidator.checkExists(classId);
    }

    // If sectionId provided, validate it exists
    if (sectionId) {
      await this.sectionValidator.checkExists(sectionId);

      // If both classId and sectionId provided, ensure section belongs to class
      if (classId) {
        const section = await this.sectionValidator.checkExists(sectionId);
        if (section.classId !== classId) {
          throw new Error(t('sections.errors.notInClass'));
        }
      }
    }

    return true;
  }

  async validatePublishDate(publishDate?: string, expiryDate?: string) {
    if (!publishDate && !expiryDate) {
      return true; // No dates to validate
    }

    if (publishDate && expiryDate) {
      const publish = new Date(publishDate);
      const expiry = new Date(expiryDate);

      if (expiry <= publish) {
        throw new Error(t('announcements.errors.expiryBeforePublish'));
      }
    }

    return true;
  }

  async checkCanPublish(id) {
    const announcement = await this.checkExists(id);

    if (announcement.isPublished) {
      throw new Error(t('announcements.errors.alreadyPublished'));
    }

    return true;
  }

  async checkCanUnpublish(id) {
    const announcement = await this.checkExists(id);

    if (!announcement.isPublished) {
      throw new Error(t('announcements.errors.notPublished'));
    }

    return true;
  }

  // ========================================
// ANNOUNCEMENT_VALIDATIONS
// ========================================

async checkClassIdRequiredForClassAudience(
  targetAudience: string,
  classId?: string
) {
  if (targetAudience === 'class' && !classId) {
    throw new Error(t('announcements.errors.classIdRequired'));
  }
  return true;
}

async checkExpiryAfterPublish(
  publishDate?: string,
  expiryDate?: string
) {
  if (!publishDate || !expiryDate) {
    return true; // Skip validation if either date is missing
  }

  const publish = new Date(publishDate);
  const expiry = new Date(expiryDate);

  if (expiry <= publish) {
    throw new Error(t('announcements.errors.expiryBeforePublish'));
  }
  return true;
}

async validateAnnouncementDates(publishDate?: string, expiryDate?: string) {
  await this.checkExpiryAfterPublish(publishDate, expiryDate);
  return true;
}
}
