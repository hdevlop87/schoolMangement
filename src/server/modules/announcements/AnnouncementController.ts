import { Controller, Get, Post, Put, Delete, Params, Body, t, Filter, User } from 'najm-api';
import { AnnouncementService } from './AnnouncementService';
import { isAdmin } from '../roles';
import {
  canAccessAnnouncement,
  canAccessAllAnnouncements,
  canCreateAnnouncement,
  canUpdateAnnouncement,
  canDeleteAnnouncement,
  canPublishAnnouncement,
} from './AnnouncementGuards';

@Controller('/announcements')
export class AnnouncementController {
  constructor(
    private announcementService: AnnouncementService,
  ) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllAnnouncements()
  async getAnnouncements(@Filter() filter) {
    const announcements = await this.announcementService.getAll(filter);
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/published')
  async getPublished() {
    const announcements = await this.announcementService.getPublished();
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/upcoming')
  @isAdmin()
  async getUpcoming() {
    const announcements = await this.announcementService.getUpcoming();
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/expired')
  @isAdmin()
  async getExpired() {
    const announcements = await this.announcementService.getExpired();
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/author/:authorId')
  @isAdmin()
  async getByAuthor(@Params('authorId') authorId) {
    const announcements = await this.announcementService.getByAuthor(authorId);
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/audience/:targetAudience')
  async getByTargetAudience(@Params('targetAudience') targetAudience) {
    const announcements = await this.announcementService.getByTargetAudience(targetAudience);
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/class/:classId')
  async getByClass(@Params('classId') classId) {
    const announcements = await this.announcementService.getByClass(classId);
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/section/:sectionId')
  async getBySection(@Params('sectionId') sectionId) {
    const announcements = await this.announcementService.getBySection(sectionId);
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/active/:targetAudience')
  async getActiveForAudience(
    @Params('targetAudience') targetAudience,
    @Body() body?
  ) {
    const { classId, sectionId } = body || {};
    const announcements = await this.announcementService.getActiveForAudience(
      targetAudience,
      classId,
      sectionId
    );
    return {
      data: announcements,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessAnnouncement()
  async getAnnouncement(@Params('id') id) {
    const announcement = await this.announcementService.getById(id);
    return {
      data: announcement,
      message: t('announcements.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateAnnouncement()
  async create(@Body() body, @User() user) {
    const newAnnouncement = await this.announcementService.create({
      ...body,
      authorId: user.id,
    });
    return {
      data: newAnnouncement,
      message: t('announcements.success.created'),
      status: 'success'
    };
  }

  @Post('/:id/publish')
  @canPublishAnnouncement()
  async publish(@Params('id') id) {
    const published = await this.announcementService.publish(id);
    return {
      data: published,
      message: t('announcements.success.published'),
      status: 'success'
    };
  }

  @Post('/:id/unpublish')
  @canPublishAnnouncement()
  async unpublish(@Params('id') id) {
    const unpublished = await this.announcementService.unpublish(id);
    return {
      data: unpublished,
      message: t('announcements.success.unpublished'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateAnnouncement()
  async update(@Params('id') id, @Body() body) {
    const updatedAnnouncement = await this.announcementService.update(id, body);
    return {
      data: updatedAnnouncement,
      message: t('announcements.success.updated'),
      status: 'success'
    };
  }

  // ========== DELETE-ENDPOINTS ==========//

  @Delete('/:id')
  @canDeleteAnnouncement()
  async delete(@Params('id') id) {
    const result = await this.announcementService.delete(id);
    return {
      data: result,
      message: t('announcements.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAll() {
    const result = await this.announcementService.deleteAll();
    return {
      data: result,
      message: t('announcements.success.allDeleted'),
      status: 'success'
    };
  }
}
