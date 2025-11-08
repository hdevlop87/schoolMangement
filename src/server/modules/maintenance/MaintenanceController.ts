import { Controller, Get, Post, Put, Delete, Params, Body, Query, t } from 'najm-api';
import { MaintenanceService } from './MaintenanceService';
import { isAdmin } from '@/server/shared/guards';

@Controller('/maintenance')
@isAdmin()
export class MaintenanceController {
  constructor(
    private maintenanceService: MaintenanceService,
  ) { }

  @Get()
  async getMaintenances() {
    const maintenance = await this.maintenanceService.getAll();
    return {
      data: maintenance,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  async getMaintenancesCount() {
    const count = await this.maintenanceService.getCount();
    return {
      data: count,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status-counts')
  async getStatusCounts() {
    const statusCounts = await this.maintenanceService.getStatusCounts();
    return {
      data: statusCounts,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/overdue')
  async getOverdueMaintenances() {
    const overdue = await this.maintenanceService.getOverdueMaintenances();
    return {
      data: overdue,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/upcoming')
  async getUpcomingMaintenances(@Query('withinHours') withinHours?: string) {
    const hours = withinHours ? parseInt(withinHours) : 50;
    const upcoming = await this.maintenanceService.getUpcomingMaintenances(hours);
    return {
      data: upcoming,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/alerts')
  async getMaintenanceAlerts() {
    const alerts = await this.maintenanceService.checkMaintenanceAlerts();
    return {
      data: alerts,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId')
  async getMaintenancesByVehicle(@Params('vehicleId') vehicleId: string) {
    const maintenance = await this.maintenanceService.getByVehicleId(vehicleId);
    return {
      data: maintenance,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status/:status')
  async getMaintenancesByStatus(@Params('status') status: string) {
    const maintenance = await this.maintenanceService.getByStatus(status);
    return {
      data: maintenance,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/type/:type')
  async getMaintenancesByType(@Params('type') type: string) {
    const maintenance = await this.maintenanceService.getByType(type);
    return {
      data: maintenance,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getMaintenanceById(@Params('id') id: string) {
    const maintenance = await this.maintenanceService.getById(id);
    return {
      data: maintenance,
      message: t('maintenance.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async createMaintenance(@Body() maintenanceData: any) {
    const maintenance = await this.maintenanceService.create(maintenanceData);
    return {
      data: maintenance,
      message: t('maintenance.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  async updateMaintenance(@Params('id') id: string, @Body() updateData: any) {
    const maintenance = await this.maintenanceService.update(id, updateData);
    return {
      data: maintenance,
      message: t('maintenance.success.updated'),
      status: 'success'
    };
  }

  @Put('/:id/status')
  async updateMaintenanceStatus(@Params('id') id: string, @Body() { status }: { status: string }) {
    const maintenance = await this.maintenanceService.updateStatus(id, status);
    return {
      data: maintenance,
      message: t('maintenance.success.statusUpdated'),
      status: 'success'
    };
  }

  @Put('/:id/complete')
  async completeMaintenance(@Params('id') id: string) {
    const maintenance = await this.maintenanceService.markAsCompleted(id);
    return {
      data: maintenance,
      message: t('maintenance.success.completed'),
      status: 'success'
    };
  }

  @Delete('/:id')
  async deleteMaintenance(@Params('id') id: string) {
    const deleted = await this.maintenanceService.delete(id);
    return {
      data: deleted,
      message: t('maintenance.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  async deleteAllMaintenances() {
    const result = await this.maintenanceService.deleteAll();
    return {
      data: result,
      message: t('maintenance.success.allDeleted'),
      status: 'success'
    };
  }

  @Post('/mark-overdue')
  async markOverdueMaintenances() {
    const result = await this.maintenanceService.markOverdueMaintenances();
    return {
      data: { updatedCount: result.length, maintenance: result },
      message: t('maintenance.success.overdueMarked'),
      status: 'success'
    };
  }
}