import { Controller, Get, t, User } from 'najm-api';
import { DashboardService } from './DashboardService';
import { isAuth } from '../roles';

@Controller('/dashboard')
@isAuth()
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
  ) { }

  @Get('/widgets')

  async getWidgets(@User() user) {
    let widgets;

    switch (user.role) {
      case 'admin':
        widgets = await this.dashboardService.getAdminWidgets();
        break;
      case 'teacher':
        widgets = await this.dashboardService.getTeacherWidgets(user.id);
        break;
      case 'student':
        widgets = await this.dashboardService.getStudentWidgets(user.id);
        break;
      case 'parent':
        widgets = await this.dashboardService.getParentWidgets(user.id);
        break;
      default:
        widgets = {};
    }

    return {
      data: widgets,
      message: t('dashboards.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/students-by-gender')
  async getStudentsByGender() {
    const data = await this.dashboardService.getStudentsByGender();
    return {
      data,
      message: t('dashboards.success.retrieved'),
      status: 'success'
    };
  }
}