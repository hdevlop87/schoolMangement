import { Controller, Get, Post, Put, Delete, Params, Body, t } from 'najm-api';
import { RefuelService } from './RefuelService';
import { canAccessRefuel, canAccessAllRefuels, canUpdateRefuel, canCreateRefuel, canDeleteRefuel } from './RefuelGuards';
import { isAdmin } from '../roles';

@Controller('/refuels')
export class RefuelController {
  constructor(private refuelService: RefuelService) { }

  // ========== GET ENDPOINTS ==========//

  @Get()
  @canAccessAllRefuels()
  async getRefuels() {
    const refuels = await this.refuelService.getAll();
    return {
      data: refuels,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  @canAccessAllRefuels()
  async getCount() {
    const count = await this.refuelService.getCount();
    return {
      data: count,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/recent')
  @canAccessAllRefuels()
  async getRecentRecords() {
    const records = await this.refuelService.getRecentRecords();
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/today')
  @canAccessAllRefuels()
  async getTodayRecords() {
    const records = await this.refuelService.getTodayRecords();
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/voucher/:voucherNumber')
  @canAccessAllRefuels()
  async getByVoucherNumber(@Params('voucherNumber') voucherNumber) {
    const record = await this.refuelService.getByVoucherNumber(voucherNumber);
    return {
      data: record,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/date/:date')
  @canAccessAllRefuels()
  async getByDate(@Params('date') date) {
    const records = await this.refuelService.getByDate(date);
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId')
  @canAccessAllRefuels()
  async getByVehicleId(@Params('vehicleId') vehicleId) {
    const records = await this.refuelService.getByVehicleId(vehicleId);
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/driver/:driverId')
  @canAccessAllRefuels()
  async getByDriverId(@Params('driverId') driverId) {
    const records = await this.refuelService.getByDriverId(driverId);
    return {
      data: records,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessRefuel()
  async getRefuel(@Params('id') id) {
    const record = await this.refuelService.getById(id);
    return {
      data: record,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//

  @Post()
  @canCreateRefuel()
  async create(@Body() body) {
    const newRecord = await this.refuelService.create(body);
    return {
      data: newRecord,
      message: t('refuels.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedRefuels(@Body() body) {
    const seeded = await this.refuelService.seedDemoRefuels(body);
    return {
      data: seeded,
      message: t('refuels.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//

  @Put('/:id')
  @canUpdateRefuel()
  async update(@Params('id') id, @Body() body) {
    const updatedRecord = await this.refuelService.update(id, body);
    return {
      data: updatedRecord,
      message: t('refuels.success.updated'),
      status: 'success'
    };
  }

  // ========== DELETE ENDPOINTS ==========//

  @Delete('/:id')
  @canDeleteRefuel()
  async delete(@Params('id') id) {
    const result = await this.refuelService.delete(id);
    return {
      data: result,
      message: t('refuels.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @canDeleteRefuel()
  async deleteAll() {
    const result = await this.refuelService.deleteAll();
    return {
      data: result,
      message: t('refuels.success.allDeleted'),
      status: 'success'
    };
  }

  // ========== ANALYTICS ENDPOINTS ==========//

  @Get('/analytics/consumption')
  @canAccessAllRefuels()
  async getFuelConsumptionAnalytics() {
    const analytics = await this.refuelService.getFuelConsumptionAnalytics();
    return {
      data: analytics,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/efficiency')
  @canAccessAllRefuels()
  async getFuelEfficiencyReport() {
    const efficiency = await this.refuelService.getFuelEfficiencyReport();
    return {
      data: efficiency,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/costs')
  @canAccessAllRefuels()
  async getFuelCostAnalysis() {
    const costs = await this.refuelService.getFuelCostAnalysis();
    return {
      data: costs,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/summary')
  @canAccessAllRefuels()
  async getFuelSummary() {
    const summary = await this.refuelService.getFuelSummary();
    return {
      data: summary,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId/efficiency')
  @canAccessAllRefuels()
  async getVehicleFuelEfficiency(@Params('vehicleId') vehicleId) {
    const efficiency = await this.refuelService.getVehicleFuelEfficiency(vehicleId);
    return {
      data: efficiency,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vehicle/:vehicleId/costs')
  @canAccessAllRefuels()
  async getVehicleFuelCosts(@Params('vehicleId') vehicleId) {
    const costs = await this.refuelService.getVehicleFuelCosts(vehicleId);
    return {
      data: costs,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/trends/monthly')
  @canAccessAllRefuels()
  async getMonthlyFuelTrends() {
    const trends = await this.refuelService.getMonthlyFuelTrends();
    return {
      data: trends,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/driver/:driverId/stats')
  @canAccessAllRefuels()
  async getDriverRefuelStats(@Params('driverId') driverId) {
    const stats = await this.refuelService.getDriverRefuelStats(driverId);
    return {
      data: stats,
      message: t('refuels.success.retrieved'),
      status: 'success'
    };
  }
}
