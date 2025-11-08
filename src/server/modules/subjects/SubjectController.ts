import { Controller, Get, Post, Put, Delete, Params, Body, t, Filter } from 'najm-api';
import { SubjectService } from './SubjectService';
import { canAccessSubject, canUpdateSubject, canCreateSubject, canDeleteSubject } from './SubjectGuards';

@Controller('/subjects')
export class SubjectController {
  constructor(private subjectService: SubjectService) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessSubject()
  async getSubjects() {
    const subjects = await this.subjectService.getAll();
    return {
      data: subjects,
      message: t('subjects.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessSubject()
  async getSubject(@Params('id') id) {
    const subject = await this.subjectService.getById(id);
    return {
      data: subject,
      message: t('subjects.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateSubject()
  async create(@Body() body) {
    const newSubject = await this.subjectService.create(body);
    return {
      data: newSubject,
      message: t('subjects.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @canCreateSubject()
  async seedSubjects(@Body() body) {
    const seededSubjects = await this.subjectService.seedDemoSubjects(body);
    return {
      data: seededSubjects,
      message: t('subjects.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateSubject()
  async update(@Params('id') id, @Body() body) {
    const updatedSubject = await this.subjectService.update(id, body);
    return {
      data: updatedSubject,
      message: t('subjects.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteSubject()
  async delete(@Params('id') id) {
    const result = await this.subjectService.delete(id);
    return {
      data: result,
      message: t('subjects.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @canDeleteSubject()
  async deleteAll() {
    const result = await this.subjectService.deleteAll();
    return {
      data: result,
      message: t('subjects.success.allDeleted'),
      status: 'success'
    };
  }
}