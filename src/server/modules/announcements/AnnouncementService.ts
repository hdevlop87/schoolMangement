import { Injectable } from 'najm-api';
import { AnnouncementRepository } from './AnnouncementRepository';
import { AnnouncementValidator } from './AnnouncementValidator';

@Injectable()
export class AnnouncementService {

  constructor(
    private announcementRepository: AnnouncementRepository,
    private announcementValidator: AnnouncementValidator,
  ) { }

  // ========================================
  // ANNOUNCEMENT OPERATIONS
  // ========================================

  async getAll(filter) {
    return await this.announcementRepository.getAll(filter);
  }

  async getById(id) {
    await this.announcementValidator.checkExists(id);
    return await this.announcementRepository.getById(id);
  }

  async getByAuthor(authorId) {
    return await this.announcementRepository.getByAuthor(authorId);
  }

  async getByTargetAudience(targetAudience) {
    return await this.announcementRepository.getByTargetAudience(targetAudience);
  }

  async getByClass(classId) {
    return await this.announcementRepository.getByClass(classId);
  }

  async getBySection(sectionId) {
    return await this.announcementRepository.getBySection(sectionId);
  }

  async getPublished() {
    return await this.announcementRepository.getPublished();
  }

  async getActiveForAudience(targetAudience: string, classId?: string, sectionId?: string) {
    return await this.announcementRepository.getActiveForAudience(targetAudience, classId, sectionId);
  }

  async getUpcoming() {
    return await this.announcementRepository.getUpcoming();
  }

  async getExpired() {
    return await this.announcementRepository.getExpired();
  }

  async create(data) {
    const {
      title,
      content,
      authorId,
      targetAudience,
      classId,
      sectionId,
      isPublished = false,
      publishDate,
      expiryDate,
    } = data;

    // Validate target audience with class/section
    await this.announcementValidator.validateTargetAudience(targetAudience, classId, sectionId);

    // Validate publish and expiry dates
    await this.announcementValidator.validatePublishDate(publishDate, expiryDate);

    const announcementDetails = {
      title,
      content,
      authorId,
      targetAudience,
      classId,
      sectionId,
      isPublished,
      publishDate,
      expiryDate,
    };

    await this.announcementValidator.validateCreate(announcementDetails);
    const newAnnouncement = await this.announcementRepository.create(announcementDetails);

    return newAnnouncement;
  }

  async update(id, data) {
    await this.announcementValidator.checkExists(id);

    const announcementData: any = {};

    if (data.title !== undefined) announcementData.title = data.title;
    if (data.content !== undefined) announcementData.content = data.content;
    if (data.targetAudience !== undefined) announcementData.targetAudience = data.targetAudience;
    if (data.classId !== undefined) announcementData.classId = data.classId;
    if (data.sectionId !== undefined) announcementData.sectionId = data.sectionId;
    if (data.isPublished !== undefined) announcementData.isPublished = data.isPublished;
    if (data.publishDate !== undefined) announcementData.publishDate = data.publishDate;
    if (data.expiryDate !== undefined) announcementData.expiryDate = data.expiryDate;

    // Validate target audience if being updated
    if (data.targetAudience !== undefined || data.classId !== undefined || data.sectionId !== undefined) {
      const announcement = await this.announcementRepository.getById(id);
      const targetAudience = data.targetAudience || announcement.targetAudience;
      const classId = data.classId !== undefined ? data.classId : announcement.classId;
      const sectionId = data.sectionId !== undefined ? data.sectionId : announcement.sectionId;

      await this.announcementValidator.validateTargetAudience(targetAudience, classId, sectionId);
    }

    // Validate dates if being updated
    if (data.publishDate !== undefined || data.expiryDate !== undefined) {
      const announcement = await this.announcementRepository.getById(id);
      const publishDate = data.publishDate || announcement.publishDate;
      const expiryDate = data.expiryDate || announcement.expiryDate;

      await this.announcementValidator.validatePublishDate(publishDate, expiryDate);
    }

    if (Object.keys(announcementData).length > 0) {
      await this.announcementValidator.validateUpdate(announcementData);
      await this.announcementRepository.update(id, announcementData);
    }

    return await this.getById(id);
  }

  async publish(id) {
    await this.announcementValidator.checkCanPublish(id);
    const published = await this.announcementRepository.publish(id);
    return await this.getById(published.id);
  }

  async unpublish(id) {
    await this.announcementValidator.checkCanUnpublish(id);
    const unpublished = await this.announcementRepository.unpublish(id);
    return await this.getById(unpublished.id);
  }

  async delete(id) {
    await this.announcementValidator.checkExists(id);
    const deletedAnnouncement = await this.announcementRepository.delete(id);
    return deletedAnnouncement;
  }

  async deleteAll() {
    return await this.announcementRepository.deleteAll();
  }
}
