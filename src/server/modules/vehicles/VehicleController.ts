import { Controller, Get, Post, Put, Delete, Params, Body, t, Filter } from 'najm-api';
import { VehicleService } from './VehicleService';
import { canAccessVehicle, canUpdateVehicle, canCreateVehicle, canDeleteVehicle, canAccessAllVehicles } from './VehicleGuards';
import { isAdmin } from '../roles';

@Controller('/vehicles')
export class VehicleController {
  constructor(
    private vehicleService: VehicleService,
  ) { }

  // ========== GET ENDPOINTS ==========//
  @Get()
  @canAccessAllVehicles()
  async getVehicles(@Filter() filter) {
    const vehicles = await this.vehicleService.getAll(filter);
    return {
      data: vehicles,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  @isAdmin()
  async getVehiclesCount() {
    const count = await this.vehicleService.getCount();
    return {
      data: count,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }


  @Get('/maintenance')
  @canAccessAllVehicles()
  async getMaintenanceVehicles() {
    const vehicles = await this.vehicleService.getByStatus('maintenance');
    return {
      data: vehicles,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/unassigned')
  @canAccessAllVehicles()
  async getUnassignedVehicles() {
    const vehicles = await this.vehicleService.getUnassignedVehicles();
    return {
      data: vehicles,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/assigned')
  @canAccessAllVehicles()
  async getAssignedVehicles() {
    const vehicles = await this.vehicleService.getAssignedVehicles();
    return {
      data: vehicles,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/driver/:driverId')
  @canAccessAllVehicles()
  async getVehicleByDriver(@Params('driverId') driverId) {
    const vehicle = await this.vehicleService.getByDriverId(driverId);
    return {
      data: vehicle,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/license/:licensePlate')
  @isAdmin()
  async getVehicleByLicense(@Params('licensePlate') licensePlate) {
    const vehicle = await this.vehicleService.getByLicensePlate(licensePlate);
    return {
      data: vehicle,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/total-fleet-mileage')
  @isAdmin()
  async getTotalFleetMileage() {
    const data = await this.vehicleService.getTotalFleetMileage();
    return {
      data,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessVehicle()
  async getVehicle(@Params('id') id) {
    const vehicle = await this.vehicleService.getById(id);
    return {
      data: vehicle,
      message: t('vehicles.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========//
  @Post()
  @canCreateVehicle()
  async createVehicle(@Body() body) {
    const newVehicle = await this.vehicleService.create(body);
    return {
      data: newVehicle,
      message: t('vehicles.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoVehicles(@Body() body) {
    const seed = await this.vehicleService.seedDemoVehicles(body);
    return {
      data: seed,
      message: t('vehicles.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========//
  @Put('/:id')
  @canUpdateVehicle()
  async updateVehicle(@Params('id') id, @Body() body) {
    const updatedVehicle = await this.vehicleService.update(id, body);
    return {
      data: updatedVehicle,
      message: t('vehicles.success.updated'),
      status: 'success'
    };
  }

  @Put('/:id/status')
  @canUpdateVehicle()
  async updateVehicleStatus(@Params('id') id, @Body() body) {
    const updatedVehicle = await this.vehicleService.updateStatus(id, body.status);
    return {
      data: updatedVehicle,
      message: t('vehicles.success.statusUpdated'),
      status: 'success'
    };
  }

  @Put('/:id/assign-driver')
  @isAdmin()
  async assignDriver(@Params('id') id, @Body() body) {
    const updatedVehicle = await this.vehicleService.assignDriver(id, body.driverId);
    return {
      data: updatedVehicle,
      message: t('vehicles.success.driverAssigned'),
      status: 'success'
    };
  }

  @Put('/:id/unassign-driver')
  @isAdmin()
  async unassignDriver(@Params('id') id) {
    const updatedVehicle = await this.vehicleService.unassignDriver(id);
    return {
      data: updatedVehicle,
      message: t('vehicles.success.driverUnassigned'),
      status: 'success'
    };
  }

  // ========== DELETE_ENDPOINTS ==========//
  @Delete('/:id')
  @canDeleteVehicle()
  async deleteVehicle(@Params('id') id) {
    const result = await this.vehicleService.delete(id);
    return {
      data: result,
      message: t('vehicles.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @canDeleteVehicle()
  async deleteAllVehicles() {
    const result = await this.vehicleService.deleteAll();
    return {
      data: result,
      message: t('vehicles.success.allDeleted'),
      status: 'success'
    };
  }
}