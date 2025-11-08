import { Controller, Get, Post, Put, Delete, Params, Body, t, User, Filter } from 'najm-api';
import { GradeService } from './GradeService';
import { canAccessGrade, canAccessAllGrades, canUpdateGrade, canCreateGrade, canDeleteGrade } from './GradeGuards';
import { isAdmin } from '../roles';

@Controller('/grades')
export class GradeController {
  constructor(
    private gradeService: GradeService,
  ) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllGrades()
  async getAll(@Filter() filter) {
    const grades = await this.gradeService.getAll(filter);
    return {
      data: grades,
      message: t('grades.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/assessment/:assessmentId')
  @canAccessAllGrades()
  async getByAssessment(@Params('assessmentId') assessmentId) {
    const grades = await this.gradeService.getByAssessment(assessmentId);
    return {
      data: grades,
      message: t('grades.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/student/:studentId')
  @canAccessAllGrades()
  async getByStudent(@Params('studentId') studentId) {
    const grades = await this.gradeService.getByStudent(studentId);
    return {
      data: grades,
      message: t('grades.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/section/:sectionId')
  @canAccessAllGrades()
  async getBySection(@Params('sectionId') sectionId) {
    const grades = await this.gradeService.getBySection(sectionId);
    return {
      data: grades,
      message: t('grades.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/subject/:subjectId')
  @canAccessAllGrades()
  async getBySubject(@Params('subjectId') subjectId) {
    const grades = await this.gradeService.getBySubject(subjectId);
    return {
      data: grades,
      message: t('grades.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/teacher/:teacherId')
  @canAccessAllGrades()
  async getByTeacher(@Params('teacherId') teacherId) {
    const grades = await this.gradeService.getByTeacher(teacherId);
    return {
      data: grades,
      message: t('grades.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessGrade()
  async getById(@Params('id') id) {
    const grade = await this.gradeService.getById(id);
    return {
      data: grade,
      message: t('grades.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateGrade()
  async create(@Body() body, @User() user) {
    const newGrade = await this.gradeService.create(body, user);
    return {
      data: newGrade,
      message: t('grades.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoGrades(@Body() body) {
    const seed = await this.gradeService.seedDemoGrades(body);
    return {
      data: seed,
      message: t('grades.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateGrade()
  async update(@Params('id') id, @Body() body, @User() user) {
    const updatedGrade = await this.gradeService.update(id, body, user);
    return {
      data: updatedGrade,
      message: t('grades.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteGrade()
  async delete(@Params('id') id) {
    const result = await this.gradeService.delete(id);
    return {
      data: result,
      message: t('grades.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAll() {
    const result = await this.gradeService.deleteAll();
    return {
      data: result,
      message: t('grades.success.allDeleted'),
      status: 'success'
    };
  }
}