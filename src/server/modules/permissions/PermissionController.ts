import { Controller, Get, Post, Put, Delete, Params, Body, t } from 'najm-api';
import { PermissionService } from './PermissionService';
import { isAdmin } from '@/server/modules/roles/RoleGuards';

@Controller('/permissions')
@isAdmin()
export class PermissionController {
  constructor(private permissionService: PermissionService) { }

  @Get()
  async getPermissions() {
    const permissions = await this.permissionService.getAll();
    return {
      data: permissions,
      message: t('permissions.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getPermission(@Params('id') id: string) {
    const permission = await this.permissionService.getById(id);
    return {
      data: permission,
      message: t('permissions.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async create(@Body() body) {
    const newPermission = await this.permissionService.create(body);
    return {
      data: newPermission,
      message: t('permissions.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async update(@Params('id') id: string, @Body() body) {
    const updatedPermission = await this.permissionService.update(id, body);
    return {
      data: updatedPermission,
      message: t('permissions.success.updated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  async delete(@Params('id') id: string) {
    const result = await this.permissionService.delete(id);
    return {
      data: result,
      message: t('permissions.success.deleted'),
      status: 'success'
    };
  }

  @Get('/role/:roleId')
  async getByRole(@Params('roleId') roleId: string) {
    const permissions = await this.permissionService.getPermissionsByRole(roleId);
    return {
      data: permissions,
      message: t('permissions.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/roles/:permissionId')
  async getRolesByPermission(@Params('permissionId') permissionId: string) {
    const roles = await this.permissionService.getRolesByPermission(permissionId);
    return {
      data: roles,
      message: t('permissions.success.retrieved'),
      status: 'success'
    };
  }

  @Post('/assign/:roleId/:permissionId')
  async assignToRole(
    @Params('roleId') roleId: string,
    @Params('permissionId') permissionId: string
  ) {
    const result = await this.permissionService.assignPermissionToRole(roleId, permissionId);
    return {
      data: result,
      message: t('permissions.success.assigned'),
      status: 'success'
    };
  }

  @Delete('/remove/:roleId/:permissionId')
  async removeFromRole(
    @Params('roleId') roleId: string,
    @Params('permissionId') permissionId: string
  ) {
    const result = await this.permissionService.removePermissionFromRole(roleId, permissionId);
    return {
      data: result,
      message: t('permissions.success.removed'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAll() {
    const result = await this.permissionService.deleteAll();
    return {
      data: result,
      message: t('permissions.success.allDeleted'),
      status: 'success'
    };
  }
}