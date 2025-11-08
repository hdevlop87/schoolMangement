import { Controller, Get, Post, Put, Delete, Params, Body, t, User } from 'najm-api';
import { SettingsService } from './SettingsService';
import { isAdmin, isAuth } from '@/server/modules/roles/RoleGuards';

@Controller('/settings')
isAuth()
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
  ) { }

  @Get()
  @isAdmin()
  async getSettings() {
    const settings = await this.settingsService.getAll();
    return {
      data: settings,
      message: t('settings.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  @isAdmin()
  async getSettingsCount() {
    const count = await this.settingsService.getCount();
    return {
      data: count,
      message: t('settings.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/me')
  async getMySettings(@User() user) {
    const settings = await this.settingsService.getByUserId(user.userId);
    return {
      data: settings,
      message: t('settings.success.retrieved'),
      status: 'success'
    };
  }

  @Put('/me')
  async updateMySettings(@User() user, @Body() settingsData) {
    const updatedSettings = await this.settingsService.updateByUserId(user.userId, settingsData);
    return {
      data: updatedSettings,
      message: t('settings.success.updated'),
      status: 'success'
    };
  }

  @Post('/me/reset')
  async resetMySettings(@User() user) {
    const defaultSettings = await this.settingsService.resetUserSettings(user.userId);
    return {
      data: defaultSettings,
      message: t('settings.success.reset'),
      status: 'success'
    };
  }

  @Get('/me/language')
  async getMyLanguage(@User() user) {
    const language = await this.settingsService.getUserLanguage(user.userId);
    return {
      data: { language },
      message: t('settings.success.languageRetrieved'),
      status: 'success'
    };
  }

  @Put('/me/language')
  async updateMyLanguage(@User() user, @Body() { language }) {
    const updatedSettings = await this.settingsService.updateUserPreference(user.userId, 'language', language);
    return {
      data: updatedSettings,
      message: t('settings.success.languageUpdated'),
      status: 'success'
    };
  }

  @Get('/me/theme')
  async getMyTheme(@User() user) {
    const theme = await this.settingsService.getUserTheme(user.userId);
    return {
      data: { theme },
      message: t('settings.success.themeRetrieved'),
      status: 'success'
    };
  }

  @Put('/me/theme')
  async updateMyTheme(@User() user, @Body() { theme }) {
    const updatedSettings = await this.settingsService.updateUserPreference(user.userId, 'theme', theme);
    return {
      data: updatedSettings,
      message: t('settings.success.themeUpdated'),
      status: 'success'
    };
  }

  @Get('/me/notifications')
  async getMyNotificationPreferences(@User() user) {
    const preferences = await this.settingsService.getNotificationPreferences(user.userId);
    return {
      data: preferences,
      message: t('settings.success.notificationsRetrieved'),
      status: 'success'
    };
  }

  @Put('/me/notifications')
  async updateMyNotificationPreferences(@User() user, @Body() notificationData) {
    const updatedSettings = await this.settingsService.updateNotificationPreferences(user.userId, notificationData);
    return {
      data: updatedSettings,
      message: t('settings.success.notificationsUpdated'),
      status: 'success'
    };
  }

  @Get('/me/security')
  async getMySecurityPreferences(@User() user) {
    const preferences = await this.settingsService.getSecurityPreferences(user.userId);
    return {
      data: preferences,
      message: t('settings.success.securityRetrieved'),
      status: 'success'
    };
  }

  @Put('/me/security')
  async updateMySecurityPreferences(@User() user, @Body() securityData) {
    const updatedSettings = await this.settingsService.updateSecurityPreferences(user.userId, securityData);
    return {
      data: updatedSettings,
      message: t('settings.success.securityUpdated'),
      status: 'success'
    };
  }

  @Get('/me/academic')
  async getMyAcademicPreferences(@User() user) {
    const preferences = await this.settingsService.getAcademicPreferences(user.userId);
    return {
      data: preferences,
      message: t('settings.success.academicRetrieved'),
      status: 'success'
    };
  }

  @Put('/me/academic')
  async updateMyAcademicPreferences(@User() user, @Body() academicData) {
    const updatedSettings = await this.settingsService.updateAcademicPreferences(user.userId, academicData);
    return {
      data: updatedSettings,
      message: t('settings.success.academicUpdated'),
      status: 'success'
    };
  }

  @Get('/me/system')
  async getMySystemPreferences(@User() user) {
    const preferences = await this.settingsService.getSystemPreferences(user.userId);
    return {
      data: preferences,
      message: t('settings.success.systemRetrieved'),
      status: 'success'
    };
  }

  @Put('/me/system')
  async updateMySystemPreferences(@User() user, @Body() systemData) {
    const updatedSettings = await this.settingsService.updateSystemPreferences(user.userId, systemData);
    return {
      data: updatedSettings,
      message: t('settings.success.systemUpdated'),
      status: 'success'
    };
  }

  @Get('/me/school')
  @isAdmin()
  async getMySchoolSettings(@User() user) {
    const preferences = await this.settingsService.getSchoolPreferences(user.userId);
    return {
      data: preferences,
      message: t('settings.success.schoolRetrieved'),
      status: 'success'
    };
  }

  @Put('/me/school')
  @isAdmin()
  async updateMySchoolSettings(@User() user, @Body() schoolData) {
    const updatedSettings = await this.settingsService.updateSchoolPreferences(user.userId, schoolData);
    return {
      data: updatedSettings,
      message: t('settings.success.schoolUpdated'),
      status: 'success'
    };
  }

  @Get('/user/:userId')
  @isAdmin()
  async getUserSettings(@Params('userId') userId: string) {
    const settings = await this.settingsService.getByUserId(userId);
    return {
      data: settings,
      message: t('settings.success.retrieved'),
      status: 'success'
    };
  }

  @Put('/user/:userId')
  @isAdmin()
  async updateUserSettings(@Params('userId') userId: string, @Body() settingsData) {
    const updatedSettings = await this.settingsService.updateByUserId(userId, settingsData);
    return {
      data: updatedSettings,
      message: t('settings.success.updated'),
      status: 'success'
    };
  }

  @Delete('/user/:userId')
  @isAdmin()
  async deleteUserSettings(@Params('userId') userId: string) {
    const deletedSettings = await this.settingsService.deleteByUserId(userId);
    return {
      data: deletedSettings,
      message: t('settings.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAllSettings() {
    const result = await this.settingsService.deleteAll();
    return {
      data: result,
      message: t('settings.success.allDeleted'),
      status: 'success'
    };
  }

  @Get('/analytics/language-distribution')
  @isAdmin()
  async getLanguageDistribution() {
    const distribution = await this.settingsService.getLanguageDistribution();
    return {
      data: distribution,
      message: 'Language distribution retrieved successfully',
      status: 'success'
    };
  }

  @Get('/analytics/theme-distribution')
  @isAdmin()
  async getThemeDistribution() {
    const distribution = await this.settingsService.getThemeDistribution();
    return {
      data: distribution,
      message: 'Theme distribution retrieved successfully',
      status: 'success'
    };
  }

  @Get('/analytics/notification-analytics')
  @isAdmin()
  async getNotificationAnalytics() {
    const analytics = await this.settingsService.getNotificationAnalytics();
    return {
      data: analytics,
      message: 'Notification analytics retrieved successfully',
      status: 'success'
    };
  }

  @Get('/analytics/settings-with-users')
  @isAdmin()
  async getSettingsWithUsers() {
    const data = await this.settingsService.getSettingsWithUsers();
    return {
      data,
      message: t('settings.success.retrieved'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoSettings(@Body() body) {
    const seed = await this.settingsService.seedDemoSettings(body);
    return {
      data: seed,
      message: t('settings.success.seeded'),
      status: 'success'
    };
  }

  @Get('/:id')
  @isAdmin()
  async getSettingsById(@Params('id') id) {
    const settings = await this.settingsService.getById(id);
    return {
      data: settings,
      message: t('settings.success.retrieved'),
      status: 'success'
    };
  }
}