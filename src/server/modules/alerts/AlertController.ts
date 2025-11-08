import { Controller, Get, Post, Put, Delete, Params, Body, Query, t } from 'najm-api';
import { AlertService } from './AlertService';
import { isAdmin } from '@/server/modules/roles/RoleGuards';

@Controller('/alerts')
@isAdmin()
export class AlertController {
  constructor(
    private alertService: AlertService,
  ) { }

  @Get()
  async getAlerts() {
    const alerts = await this.alertService.getAll();
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  } 

  @Get('/count')
  async getAlertsCount() {
    const count = await this.alertService.getCount();
    return {
      data: count,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status-counts')
  async getStatusCounts() {
    const statusCounts = await this.alertService.getStatusCounts();
    return {
      data: statusCounts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/priority-counts')
  async getPriorityCounts() {
    const priorityCounts = await this.alertService.getPriorityCounts();
    return {
      data: priorityCounts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/type-counts')
  async getTypeCounts() {
    const typeCounts = await this.alertService.getTypeCounts();
    return {
      data: typeCounts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/active')
  async getActiveAlerts() {
    const alerts = await this.alertService.getActiveAlerts();
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/critical')
  async getCriticalAlerts() {
    const alerts = await this.alertService.getCriticalAlerts();
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/recent')
  async getRecentAlerts(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    const alerts = await this.alertService.getRecentAlerts(limitNum);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/recent-by-hours')
  async getRecentAlertsByHours(@Query('hours') hours?: string) {
    const hoursNum = hours ? parseInt(hours) : 24;
    const alerts = await this.alertService.getRecentAlertsByHours(hoursNum);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }


  @Get('/dashboard')
  async getDashboardSummary() {
    const summary = await this.alertService.getDashboardSummary();
    return {
      data: summary,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/type/:type')
  async getAlertsByType(@Params('type') type: string) {
    const alerts = await this.alertService.getByType(type);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status/:status')
  async getAlertsByStatus(@Params('status') status: string) {
    const alerts = await this.alertService.getByStatus(status);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/priority/:priority')
  async getAlertsByPriority(@Params('priority') priority: string) {
    const alerts = await this.alertService.getByPriority(priority);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/student/:studentId')
  async getAlertsByStudent(@Params('studentId') studentId: string) {
    const alerts = await this.alertService.getByStudentId(studentId);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/teacher/:teacherId')
  async getAlertsByTeacher(@Params('teacherId') teacherId: string) {
    const alerts = await this.alertService.getByTeacherId(teacherId);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/class/:classId')
  async getAlertsByClass(@Params('classId') classId: string) {
    const alerts = await this.alertService.getByClassId(classId);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/subject/:subjectId')
  async getAlertsBySubject(@Params('subjectId') subjectId: string) {
    const alerts = await this.alertService.getBySubjectId(subjectId);
    return {
      data: alerts,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getAlertById(@Params('id') id: string) {
    const alert = await this.alertService.getById(id);
    return {
      data: alert,
      message: t('alerts.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async createAlert(@Body() alertData: any) {
    const alert = await this.alertService.create(alertData);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async updateAlert(@Params('id') id: string, @Body() updateData: any) {
    const alert = await this.alertService.update(id, updateData);
    return {
      data: alert,
      message: t('alerts.success.updated'),
      status: 'success'
    };
  }

  @Put('/:id/status')
  async updateAlertStatus(@Params('id') id: string, @Body() { status }: { status: string }) {
    const alert = await this.alertService.updateStatus(id, status);
    return {
      data: alert,
      message: t('alerts.success.statusUpdated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  async deleteAlert(@Params('id') id: string) {
    const deleted = await this.alertService.delete(id);
    return {
      data: deleted,
      message: t('alerts.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  async deleteAllAlerts() {
    const result = await this.alertService.deleteAll();
    return {
      data: result,
      message: t('alerts.success.allDeleted'),
      status: 'success'
    };
  }

  @Delete('/resolved')
  async deleteResolvedAlerts() {
    const result = await this.alertService.deleteResolved();
    return {
      data: result,
      message: t('alerts.success.resolvedDeleted'),
      status: 'success'
    };
  }

  @Post('/generate/attendance')
  async generateAttendanceAlerts() {
    const result = await this.alertService.generateAttendanceAlerts();
    return {
      data: result,
      message: t('alerts.success.attendanceAlertsGenerated'),
      status: 'success'
    };
  }

  @Post('/generate/academic')
  async generateAcademicAlerts() {
    const result = await this.alertService.generateAcademicAlerts();
    return {
      data: result,
      message: t('alerts.success.academicAlertsGenerated'),
      status: 'success'
    };
  }

  @Post('/academic')
  async createAcademicAlert(@Body() { studentId, alertType, details }: {
    studentId: string,
    alertType: string,
    details?: any
  }) {
    const alert = await this.alertService.createAcademicAlert(studentId, alertType, details);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/attendance')
  async createAttendanceAlert(@Body() { studentId, alertType, details }: {
    studentId: string,
    alertType: string,
    details?: any
  }) {
    const alert = await this.alertService.createAttendanceAlert(studentId, alertType, details);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/behavioral')
  async createBehavioralAlert(@Body() { studentId, alertType, details }: {
    studentId: string,
    alertType: string,
    details?: any
  }) {
    const alert = await this.alertService.createBehavioralAlert(studentId, alertType, details);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/health')
  async createHealthAlert(@Body() { studentId, alertType, details }: {
    studentId: string,
    alertType: string,
    details?: any
  }) {
    const alert = await this.alertService.createHealthAlert(studentId, alertType, details);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/announcement')
  async createAnnouncementAlert(@Body() { title, message, targetAudience, authorId, classId }: {
    title: string,
    message: string,
    targetAudience: string,
    authorId: string,
    classId?: string
  }) {
    const alert = await this.alertService.createAnnouncementAlert(title, message, targetAudience, authorId, classId);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/reminder')
  async createReminderAlert(@Body() { title, message, targetAudience, authorId, details }: {
    title: string,
    message: string,
    targetAudience: string,
    authorId: string,
    details?: any
  }) {
    const alert = await this.alertService.createReminderAlert(title, message, targetAudience, authorId, details);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/emergency')
  async createEmergencyAlert(@Body() { title, message, details }: {
    title: string,
    message: string,
    details?: any
  }) {
    const alert = await this.alertService.createEmergencyAlert(title, message, details);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }

  @Post('/system')
  async createSystemAlert(@Body() { message, priority }: { message: string, priority?: string }) {
    const alert = await this.alertService.createSystemAlert(message, priority);
    return {
      data: alert,
      message: t('alerts.success.created'),
      status: 'success'
    };
  }
}