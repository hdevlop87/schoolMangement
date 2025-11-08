import { Controller, Get, Post, Put, Delete, Params, Body, t, User, Filter } from 'najm-api';
import { TeacherService } from './TeacherService';
import { canAccessTeacher, canUpdateTeacher, canCreateTeacher, canDeleteTeacher, canAccessAllTeachers } from './TeacherGuards';
import {  isAdmin } from '../roles';

@Controller('/teachers')
export class TeacherController {
  constructor(
    private teacherService: TeacherService,
  ) { }

  // ========== GET ENDPOINTS ==========//
  @Get()
  @canAccessAllTeachers()
  async getTeachers(@Filter() filter) {
    const teachers = await this.teacherService.getAll(filter);
    return {
      data: teachers,
      message: t('teachers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessTeacher()
  async getTeacher(@Params('id') id) {
    const teacher = await this.teacherService.getById(id);
    return {
      data: teacher,
      message: t('teachers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/cin/:cin')
  @isAdmin()
  async getByCin(@Params('cin') cin) {
    const teacher = await this.teacherService.getByCin(cin);
    return {
      data: teacher,
      message: t('teachers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/email/:email')
  @isAdmin()
  async getByEmail(@Params('email') email) {
    const teacher = await this.teacherService.getByEmail(email);
    return {
      data: teacher,
      message: t('teachers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/phone/:phone')
  @isAdmin()
  async getByPhone(@Params('phone') phone) {
    const teacher = await this.teacherService.getByPhone(phone);
    return {
      data: teacher,
      message: t('teachers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/classes')
  @canAccessTeacher()
  async getClasses(@Params('id') id) {
    const classes = await this.teacherService.getClasses(id);
    return {
      data: classes,
      message: t('teachers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/students') 
  @canAccessTeacher()
  async getStudents(@Params('id') id) {
    const students = await this.teacherService.getStudents(id);
    return {
      data: students,
      message: t('teachers.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//
  @Post()
  @canCreateTeacher()
  async create(@Body() body) {
    const newTeacher = await this.teacherService.create(body);
    return {
      data: newTeacher,
      message: t('teachers.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoTeachers(@Body() body) {
    const seed = await this.teacherService.seedDemoTeachers(body);
    return {
      data: seed,
      message: t('teachers.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//
  @Put('/:id')
  @canUpdateTeacher()
  async update(@Params('id') id, @Body() body, @User() user) {
    const updatedTeacher = await this.teacherService.update(id, body);
    return {
      data: updatedTeacher,
      message: t('teachers.success.updated'),
      status: 'success'
    };
  }
  // ========== DEL ENDPOINTS ==========//

  @Delete('/:id')
  @canDeleteTeacher()
  async delete(@Params('id') id) {
    const result = await this.teacherService.delete(id);
    return {
      data: result,
      message: t('teachers.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @canDeleteTeacher()
  async deleteAll() {
    const result = await this.teacherService.deleteAll();
    return {
      data: result,
      message: t('teachers.success.allDeleted'),
      status: 'success'
    };
  }
}