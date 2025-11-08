import { Controller, Get, Post, Put, Delete, Params, Body, t } from 'najm-api';
import { UserService } from './UserService';

import { isAdmin, isAuth } from '@/server/modules/roles/RoleGuards';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @isAdmin() 
  async getUsers() {
    const users = await this.userService.getAll();
    return {
      data: users,
      message: t('users.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/lang')
  @isAuth() 
  async getLang() {
    const language = await this.userService.getLang();
    return {
      data: { language },
      message: t('users.success.retrieved'),
      status: 'success'
    };
  }

  @Post('/lang/:language')
  @isAuth() 
  async updateLang(@Params('language') language) {
    const data = await this.userService.updateLang(language);
    return {
      data,
      message: t('users.success.updated'),
      status: 'success'
    };
  }

  @Get('/:id')
  @isAdmin() 
  async getUser(@Params('id') id) {
    const user = await this.userService.getById(id);
    return {
      data: user,
      message: t('users.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/email/:email')
  @isAdmin()
  async getByEmail(@Params('email') email) {
    const user = await this.userService.getByEmail(email);
    return {
      data: user,
      message: t('users.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/phone/:phone')
  @isAdmin()
  async getByPhone(@Params('phone') phone) {
    const user = await this.userService.getByPhone(phone);
    return {
      data: user,
      message: t('users.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/role/:userId')
  @isAdmin() 
  async getRole(@Params('userId') userId) {
    const role = await this.userService.getRoleName(userId);

    return {
      data: role,
      message: t('users.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  @isAdmin() 
  async create(@Body() body) {
    const newUser = await this.userService.create(body);
    return {
      data: newUser,
      message: t('users.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  @isAdmin() 
  async update(@Params('id') id, @Body() body) {
    const updatedUser = await this.userService.update(id, body);
    return {
      data: updatedUser,
      message: t('users.success.updated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  @isAdmin() 
  async delete(@Params('id') id) {
    const result = await this.userService.delete(id);
    return {
      data: result,
      message: t('users.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin() 
  async deleteAll() {
    const result = await this.userService.deleteAll();
    return {
      data: result,
      message: t('users.success.allDeleted'),
      status: 'success'
    };
  }

  @Post('/assign/:userId/:roleId')
  @isAdmin() 
  async assignRole(@Params('userId') userId, @Params('roleId') roleId) {
    await this.userService.assignRole(userId, roleId);

    return {
      message: t('users.success.updated'),
      status: 'success'
    };
  }

  @Delete('/remove/:userId')
  @isAdmin() 
  async removeRole(@Params('userId') userId) {
    await this.userService.removeRole(userId);

    return {
      message: t('users.success.updated'),
      status: 'success'
    };
  }

}