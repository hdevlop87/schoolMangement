import { Controller, Get, Post, Put, Delete, Params, Body, t, Filter } from 'najm-api';
import { ParentService } from './ParentService';
import { canAccessParent, canAccessAllParents, canUpdateParent, canCreateParent, canDeleteParent } from './ParentGuards';
import { isAdmin } from '../roles';

@Controller('/parents')
export class ParentController {
  constructor(
    private parentService: ParentService,
  ) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllParents()
  async getParents(@Filter() filter) {
    const parents = await this.parentService.getAll(filter);
    return {
      data: parents,
      message: t('parents.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/cin/:cin')
  @canAccessAllParents()
  async getByCin(@Params('cin') cin) {
    const parent = await this.parentService.getByCin(cin);
    return {
      data: parent,
      message: t('parents.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/phone/:phone')
  @canAccessAllParents()
  async getByPhone(@Params('phone') phone) {
    const parent = await this.parentService.getByPhone(phone);
    return {
      data: parent,
      message: t('parents.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/children')
  @canAccessParent()
  async getChildren(@Params('id') id) {
    const children = await this.parentService.getChildren(id);
    return {
      data: children,
      message: t('parents.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessParent()
  async getParent(@Params('id') id) {
    const parent = await this.parentService.getById(id);
    return {
      data: parent,
      message: t('parents.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateParent()
  async create(@Body() body) {
    const newParent = await this.parentService.create(body);
    return {
      data: newParent,
      message: t('parents.success.created'),
      status: 'success'
    };
  }

  @Post('/:id/link-student')
  @canCreateParent()
  async linkStudent(@Params('id') id, @Body() body) {
    const result = await this.parentService.linkStudent(id, body.studentId);
    return {
      data: result,
      message: t('parents.success.studentLinked'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoParents(@Body() body) {
    const seed = await this.parentService.seedDemoParents(body);
    return {
      data: seed,
      message: t('parents.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateParent()
  async update(@Params('id') id, @Body() body) {
    const updatedParent = await this.parentService.update(id, body);
    return {
      data: updatedParent,
      message: t('parents.success.updated'),
      status: 'success'
    };
  }

  // ============ DEL ENDPOINTS ============//

  @Delete('/:id')
  @canDeleteParent()
  async delete(@Params('id') id) {
    const result = await this.parentService.delete(id);
    return {
      data: result,
      message: t('parents.success.deleted'),
      status: 'success'
    };
  }

  @Delete('/:id/unlink-student/:studentId')
  @canDeleteParent()
  async unlinkStudent(@Params('id') id, @Params('studentId') studentId) {
    const result = await this.parentService.unlinkStudent(id, studentId);
    return {
      data: result,
      message: t('parents.success.studentUnlinked'),
      status: 'success'
    };
  }

  @Delete()
  @canDeleteParent()
  async deleteAll() {
    const result = await this.parentService.deleteAll();
    return {
      data: result,
      message: t('parents.success.allDeleted'),
      status: 'success'
    };
  }
}