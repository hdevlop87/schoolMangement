import { Controller, Get, Post, Put, Delete, Params, Body, t, User, Filter } from 'najm-api';
import { ExamService } from './ExamService';
import { canAccessExam, canAccessAllExams, canUpdateExam, canCreateExam, canDeleteExam } from './ExamGuards';
import { isAdmin, isStaff } from '../roles';

@Controller('/exams')
export class ExamController {
  constructor(
    private examService: ExamService,
  ) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllExams()
  async getAll(@Filter() filter) {
    const exams = await this.examService.getAll(filter);
    return {
      data: exams,
      message: t('exams.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/today')
  @canAccessAllExams()
  async getTodayExams() {
    const exams = await this.examService.getTodayExams();
    return {
      data: exams,
      message: t('exams.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/upcoming')
  @canAccessAllExams()
  async getUpcomingExams() {
    const exams = await this.examService.getUpcomingExams();
    return {
      data: exams,
      message: t('exams.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/section/:sectionId')
  @canAccessAllExams()
  async getBySection(@Params('sectionId') sectionId) {
    const exams = await this.examService.getBySection(sectionId);
    return {
      data: exams,
      message: t('exams.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/subject/:subjectId')
  @canAccessAllExams()
  async getBySubject(@Params('subjectId') subjectId) {
    const exams = await this.examService.getBySubject(subjectId);
    return {
      data: exams,
      message: t('exams.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/teacher/:teacherId')
  @canAccessAllExams()
  async getByTeacher(@Params('teacherId') teacherId) {
    const exams = await this.examService.getByTeacher(teacherId);
    return {
      data: exams,
      message: t('exams.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessExam()
  async getById(@Params('id') id) {
    const exam = await this.examService.getById(id);
    return {
      data: exam,
      message: t('exams.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateExam()
  async create(@Body() body) {
    const newExam = await this.examService.create(body);
    return {
      data: newExam,
      message: t('exams.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoExams(@Body() body) {
    const seed = await this.examService.seedDemoExams(body);
    return {
      data: seed,
      message: t('exams.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateExam()
  async update(@Params('id') id, @Body() body) {
    const updatedExam = await this.examService.update(id, body);
    return {
      data: updatedExam,
      message: t('exams.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteExam()
  async delete(@Params('id') id) {
    const result = await this.examService.delete(id);
    return {
      data: result,
      message: t('exams.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAll() {
    const result = await this.examService.deleteAll();
    return {
      data: result,
      message: t('exams.success.allDeleted'),
      status: 'success'
    };
  }
}
