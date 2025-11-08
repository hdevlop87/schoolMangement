import { Controller, Get, Post, Params, Body, User, t } from 'najm-api';
import { AuthService } from './AuthService';
import { isAuth } from '@/server/modules/roles/RoleGuards';


@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/register')
  async registerUser(@Body() body) {
    const data = await this.authService.registerUser(body);
    return {
      data,
      message: t('auth.success.register'),
      status: 'success'
    };
  }

  @Post('/login')
  async loginUser(@Body() body) {
    const data = await this.authService.loginUser(body);
    return {
      data,
      message: t('auth.success.login'),
      status: 'success'
    };
  }

  @Get('/refresh')
  async refreshTokens() {
    const data = await this.authService.refreshTokens();
    return {
      data,
      message: t('auth.success.tokenRefreshed'),
      status: 'success'
    };
  }

  @Get('/logout/:id')
  async logoutUser(@Params('id') id) {
    const data = await this.authService.logoutUser(id);
    return {
      data,
      message: t('auth.success.logout'),
      status: 'success'
    };
  }


  @Get('/me')
  @isAuth()
  async userProfile(@User() user) {
    const data = await this.authService.getUserProfile(user);
    return {
      data,
      message: t('users.success.retrieved'),
      status: 'success'
    };
  }

  @Post('/forgot-password')
  @isAuth()
  async forgotPassword(@Body() body) {
    const data = await this.authService.forgotPassword(body.email);
    return {
      data,
      message: t('auth.success.passwordReset'),
      status: 'success'
    };
  }
}