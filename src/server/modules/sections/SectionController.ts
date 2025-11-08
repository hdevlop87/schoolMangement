import { Controller, Get, Post, Put, Delete, Params, Body, t, Filter } from 'najm-api';
import { SectionService } from './SectionService';
import { canAccessSection, canAccessAllSections, canUpdateSection, canCreateSection, canDeleteSection } from './SectionGuards';
import { isAdmin } from '../roles';

@Controller('/sections')
export class SectionController {
  constructor(private sectionService: SectionService) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllSections()
  async getSections(@Filter() filter) {

    const sections = await this.sectionService.getAll(filter);
    return {
      data: sections,
      message: t('sections.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/classes')
  @isAdmin()
  async getClasses(@Params('id') id) {
    const sections = await this.sectionService.getClasses(id);
    return {
      data: sections,
      message: t('sections.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/teachers')
  @isAdmin()
  async getTeachers(@Params('id') id) {
    const sections = await this.sectionService.getTeachers(id);
    return {
      data: sections,
      message: t('sections.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/parents')
  @isAdmin()
  async getParents(@Params('id') id) {
    const sections = await this.sectionService.getParents(id);
    return {
      data: sections,
      message: t('sections.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/students')
  @canAccessSection()
  async getStudents(@Params('id') id) {
    const students = await this.sectionService.getStudents(id);
    return {
      data: students,
      message: t('sections.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/analytics')
  @canAccessSection()
  async getAnalytics(@Params('id') id) {
    const analytics = await this.sectionService.getAnalytics(id);
    return {
      data: analytics,
      message: t('sections.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessSection()
  async getSection(@Params('id') id) {
    const section = await this.sectionService.getById(id);
    return {
      data: section,
      message: t('sections.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateSection()
  async createSection(@Body() body) {
    const newSection = await this.sectionService.create(body);
    return {
      data: newSection,
      message: t('sections.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedSections(@Body() body) {
    const seededSections = await this.sectionService.seedDemoSections(body);
    return {
      data: seededSections,
      message: t('sections.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateSection()
  async updateSection(@Params('id') id, @Body() body) {
    const updatedSection = await this.sectionService.update(id, body);
    return {
      data: updatedSection,
      message: t('sections.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteSection()
  async deleteSection(@Params('id') id) {
    const result = await this.sectionService.delete(id);
    return {
      data: result,
      message: t('sections.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @canDeleteSection()
  async deleteAllSections() {
    const result = await this.sectionService.deleteAll();
    return {
      data: result,
      message: t('sections.success.allDeleted'),
      status: 'success'
    };
  }
}