import { Controller, Get, Post, Put, Delete, Params, Body, t, User, Filter } from 'najm-api';
import { AttendanceService } from './AttendanceService';
import { canAccessAttendance, canAccessAllAttendance, canUpdateAttendance, canCreateAttendance, canDeleteAttendance } from './AttendanceGuards';
import { isAdmin, isStaff } from '../roles';

@Controller('/attendance')
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService,
  ) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllAttendance()
  async getAll(@Filter() filter) {
    const attendance = await this.attendanceService.getAll(filter);
    return {
      data: attendance,
      message: t('attendance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/today')
  @canAccessAllAttendance()
  async getTodayAttendance() {
    const attendance = await this.attendanceService.getToday();
    return {
      data: attendance,
      message: t('attendance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/date/:date')
  @canAccessAllAttendance()
  async getAttendanceByDate(@Params('date') date) {
    const attendance = await this.attendanceService.getByDate(date);
    return {
      data: attendance,
      message: t('attendance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/section/:sectionId')
  @canAccessAllAttendance()
  async getAttendanceBySection(@Params('sectionId') sectionId) {
    const attendance = await this.attendanceService.getBySection(sectionId);
    return {
      data: attendance,
      message: t('attendance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/student/:studentId')
  @canAccessAllAttendance()
  async getAttendanceByStudent(@Params('studentId') studentId) {
    const attendance = await this.attendanceService.getByStudent(studentId);
    return {
      data: attendance,
      message: t('attendance.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateAttendance()
  async markAttendance(@Body() body, @User() user) {
    const newAttendance = await this.attendanceService.mark(body, user);
    return {
      data: newAttendance,
      message: t('attendance.success.marked'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedAttendanceDemo(@Body() body) {
    const seed = await this.attendanceService.seedDemo(body);
    return {
      data: seed,
      message: t('attendance.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateAttendance()
  async updateAttendance(@Params('id') id, @Body() body) {
    const updatedAttendance = await this.attendanceService.update(id, body);
    return {
      data: updatedAttendance,
      message: t('attendance.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteAttendance()
  async deleteAttendance(@Params('id') id) {
    const result = await this.attendanceService.delete(id);
    return {
      data: result,
      message: t('attendance.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAll() {
    const result = await this.attendanceService.deleteAll();
    return {
      data: result,
      message: t('attendance.success.allDeleted'),
      status: 'success'
    };
  }
}