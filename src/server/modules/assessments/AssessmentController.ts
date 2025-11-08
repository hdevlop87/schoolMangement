import { Controller, Get, Post, Put, Delete, Params, Body, t, User, Filter } from 'najm-api';
import { AssessmentService } from './AssessmentService';
import { canAccessAssessment, canAccessAllAssessments, canUpdateAssessment, canCreateAssessment, canDeleteAssessment } from './AssessmentGuards';
import { isAdmin } from '../roles';

@Controller('/assessments')
export class AssessmentController {
  constructor(
    private assessmentService: AssessmentService,
  ) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllAssessments()
  async getAll(@Filter() filter) {
    const assessments = await this.assessmentService.getAll(filter);
    return {
      data: assessments,
      message: t('assessments.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/today')
  @canAccessAllAssessments()
  async getTodayAssessments() {
    const assessments = await this.assessmentService.getTodayAssessments();
    return {
      data: assessments,
      message: t('assessments.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/section/:sectionId')
  @canAccessAllAssessments()
  async getBySection(@Params('sectionId') sectionId) {
    const assessments = await this.assessmentService.getBySection(sectionId);
    return {
      data: assessments,
      message: t('assessments.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/subject/:subjectId')
  @canAccessAllAssessments()
  async getBySubject(@Params('subjectId') subjectId) {
    const assessments = await this.assessmentService.getBySubject(subjectId);
    return {
      data: assessments,
      message: t('assessments.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/teacher/:teacherId')
  @canAccessAllAssessments()
  async getByTeacher(@Params('teacherId') teacherId) {
    const assessments = await this.assessmentService.getByTeacher(teacherId);
    return {
      data: assessments,
      message: t('assessments.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessAssessment()
  async getById(@Params('id') id) {
    const assessment = await this.assessmentService.getById(id);
    return {
      data: assessment,
      message: t('assessments.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateAssessment()
  async create(@Body() body) {
    const newAssessment = await this.assessmentService.create(body);
    return {
      data: newAssessment,
      message: t('assessments.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoAssessments(@Body() body) {
    const seed = await this.assessmentService.seedDemoAssessments(body);
    return {
      data: seed,
      message: t('assessments.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateAssessment()
  async update(@Params('id') id, @Body() body) {
    const updatedAssessment = await this.assessmentService.update(id, body);
    return {
      data: updatedAssessment,
      message: t('assessments.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteAssessment()
  async delete(@Params('id') id) {
    const result = await this.assessmentService.delete(id);
    return {
      data: result,
      message: t('assessments.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAll() {
    const result = await this.assessmentService.deleteAll();
    return {
      data: result,
      message: t('assessments.success.allDeleted'),
      status: 'success'
    };
  }
}