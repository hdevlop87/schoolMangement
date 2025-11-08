import { Controller, Get, Post, Put, Delete, Params, Body, Query, t, Filter } from 'najm-api';
import { ClassService } from './ClassService';
import { canAccessClass, canAccessAllClasses, canUpdateClass, canCreateClass, canDeleteClass } from './ClassGuards';
import { isAdmin } from '../roles/RoleGuards';

@Controller('/classes')
export class ClassController {
  constructor(private classService: ClassService) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllClasses()
  async getClasses(@Filter() filter) {
    const classes = await this.classService.getAll(filter);
    return {
      data: classes,
      message: t('classes.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessClass()
  async getClass(@Params('id') id) {
    const classData = await this.classService.getById(id);
    return {
      data: classData,
      message: t('classes.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/sections')
  @canAccessClass()
  async getClassSections(@Params('id') id) {
    const sections = await this.classService.getSections(id);
    return {
      data: sections,
      message: t('classes.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/students')
  @canAccessClass()
  async getClassStudents(@Params('id') id) {
    const students = await this.classService.getStudents(id);
    return {
      data: students,
      message: t('classes.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/teachers')
  @canAccessClass()
  async getClassTeachers(@Params('id') id) {
    const teachers = await this.classService.getTeachers(id);
    return {
      data: teachers,
      message: t('classes.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/parents')
  @canAccessClass()
  async getClassParents(@Params('id') id) {
    const parents = await this.classService.getParents(id);
    return {
      data: parents,
      message: t('classes.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/analytics')
  @canAccessClass()
  async getClassAnalytics(@Params('id') id) {
    const analytics = await this.classService.getAnalytics(id);
    return {
      data: analytics,
      message: t('classes.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateClass()
  async createClass(@Body() body) {
    const newClass = await this.classService.create(body);
    return {
      data: newClass,
      message: t('classes.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedClasses(@Body() body) {
    const seededClasses = await this.classService.seedDemoClasses(body);
    return {
      data: seededClasses,
      message: t('classes.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateClass()
  async updateClass(@Params('id') id, @Body() body) {
    const updatedClass = await this.classService.update(id, body);
    return {
      data: updatedClass,
      message: t('classes.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteClass()
  async deleteClass(@Params('id') id) {
    const result = await this.classService.delete(id);
    return {
      data: result,
      message: t('classes.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @canDeleteClass()
  async deleteAllClasses() {
    const result = await this.classService.deleteAll();
    return {
      data: result,
      message: t('classes.success.allDeleted'),
      status: 'success'
    };
  }
}