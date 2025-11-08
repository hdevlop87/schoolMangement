import { Controller, Get, Post, Put, Delete, Params, Body, t, Filter, User } from 'najm-api';
import { StudentService } from './StudentService';

import { canAccessStudent, canAccessAllStudents, canUpdateStudent, canCreateStudent, canDeleteStudent } from './StudentGuards';
import { isAdmin } from '../roles';

@Controller('/students')
export class StudentController {
  constructor(
    private studentService: StudentService,
  ) { }

  // ========== GET ENDPOINTS ==========//
  @Get()
  @canAccessAllStudents()
  async getStudents(@Filter() filter) {
    const students = await this.studentService.getAll(filter);
    return {
      data: students,
      message: t('students.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessStudent()
  async getStudent(@Params('id') id) {
    const student = await this.studentService.getById(id);
    return {
      data: student,
      message: t('students.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateStudent()
  async create(@Body() body) {
    const newStudent = await this.studentService.create(body);
    return {
      data: newStudent,
      message: t('students.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemo(@Body() body) {
    const seed = await this.studentService.seedDemoStudents(body);
    return {
      data: seed,
      message: t('students.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateStudent()
  async update(@Params('id') id, @Body() body) {
    const updatedStudent = await this.studentService.update(id, body);
    return {
      data: updatedStudent,
      message: t('students.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteStudent()
  async delete(@Params('id') id) {
    const result = await this.studentService.delete(id);
    return {
      data: result,
      message: t('students.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @canDeleteStudent()
  async deleteAll() {
    const result = await this.studentService.deleteAll();
    return {
      data: result,
      message: t('students.success.allDeleted'),
      status: 'success'
    };
  }

  // ========== COMMENTED - ADDITIONAL GET ENDPOINTS (Available on demand) ==========//

  // @Get('/code/:studentCode')
  // @isAdmin()
  // async getByCode(@Params('studentCode') studentCode) {
  //   const student = await this.studentService.getByStudentCode(studentCode);
  //   return {
  //     data: student,
  //     message: t('students.success.retrieved'),
  //     status: 'success'
  //   };
  // }

  // @Get('/email/:email')
  // @isAdmin()
  // async getByEmail(@Params('email') email) {
  //   const student = await this.studentService.getByEmail(email);
  //   return {
  //     data: student,
  //     message: t('students.success.retrieved'),
  //     status: 'success'
  //   };
  // }

  // @Get('/phone/:phone')
  // @isAdmin()
  // async getByPhone(@Params('phone') phone) {
  //   const student = await this.studentService.getByPhone(phone);
  //   return {
  //     data: student,
  //     message: t('students.success.retrieved'),
  //     status: 'success'
  //   };
  // }

  // @Get('/:id/grades')
  // @canAccessStudent()
  // async getGrades(@Params('id') id) {
  //   const grades = await this.studentService.getStudentGrades(id);
  //   return {
  //     data: grades,
  //     message: t('students.success.retrieved'),
  //     status: 'success'
  //   };
  // }

  // @Get('/:id/attendance')
  // @canAccessStudent()
  // async getAttendance(@Params('id') id) {
  //   const attendance = await this.studentService.getStudentAttendance(id);
  //   return {
  //     data: attendance,
  //     message: t('students.success.retrieved'),
  //     status: 'success'
  //   };
  // }

  // @Get('/:id/assessments')
  // @canAccessStudent()
  // async getAssessments(@Params('id') id) {
  //   const assessments = await this.studentService.getStudentAssessments(id);
  //   return {
  //     data: assessments,
  //     message: t('students.success.retrieved'),
  //     status: 'success'
  //   };
  // }

  // @Get('/:id/analytics')
  // @canAccessStudent()
  // async getAnalytics(@Params('id') id) {
  //   const analytics = await this.studentService.getAnalytics(id);
  //   return {
  //     data: analytics,
  //     message: t('students.success.retrieved'),
  //     status: 'success'
  //   };
  // }

  // @Get('/:id/parents')
  // @canAccessStudent()
  // async getParents(@Params('id') id) {
  //   const parents = await this.studentService.getStudentParents(id);
  //   return {
  //     data: parents,
  //     message: t('students.success.retrieved'),
  //     status: 'success'
  //   };
  // }
}