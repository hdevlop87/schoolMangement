import { Controller, Get, Post, Put, Delete, Params, Body, t, User, Filter } from 'najm-api';
import { DriverService } from './DriverService';
import { isAdmin } from '../roles';

@Controller('/drivers')
export class DriverController {
  constructor(
    private driverService: DriverService,
  ) { }

  // ========== GET ENDPOINTS ==========

  @Get()
  @isAdmin()
  async getDrivers() {
    const drivers = await this.driverService.getAll();
    return {
      data: drivers,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/count')
  @isAdmin()
  async getDriversCount() {
    const count = await this.driverService.getCount();
    return {
      data: count,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/active')
  @isAdmin()
  async getActiveDrivers() {
    const drivers = await this.driverService.getByStatus('active');
    return {
      data: drivers,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/inactive')
  @isAdmin()
  async getInactiveDrivers() {
    const drivers = await this.driverService.getByStatus('inactive');
    return {
      data: drivers,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/suspended')
  @isAdmin()
  async getSuspendedDrivers() {
    const drivers = await this.driverService.getByStatus('suspended');
    return {
      data: drivers,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/license-expiring')
  @isAdmin()
  async getLicenseExpiringDrivers() {
    const drivers = await this.driverService.getLicenseExpiringDrivers();
    return {
      data: drivers,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @isAdmin()
  async getDriver(@Params('id') id) {
    const driver = await this.driverService.getById(id);
    return {
      data: driver,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/cin/:cin')
  @isAdmin()
  async getDriverByCin(@Params('cin') cin) {
    const driver = await this.driverService.getByCin(cin);
    return {
      data: driver,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/license/:licenseNumber')
  @isAdmin()
  async getDriverByLicense(@Params('licenseNumber') licenseNumber) {
    const driver = await this.driverService.getByLicenseNumber(licenseNumber);
    return {
      data: driver,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/email/:email')
  @isAdmin()
  async getByEmail(@Params('email') email) {
    const driver = await this.driverService.getByEmail(email);
    return {
      data: driver,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/phone/:phone')
  @isAdmin()
  async getByPhone(@Params('phone') phone) {
    const driver = await this.driverService.getByPhone(phone);
    return {
      data: driver,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/vehicles')
  @isAdmin()
  async getAssignedVehicles(@Params('id') id) {
    const vehicles = await this.driverService.getAssignedVehicles(id);
    return {
      data: vehicles,
      message: t('drivers.success.retrieved'),
      status: 'success'
    };
  }

  // ========== POST ENDPOINTS ==========

  @Post()
  @isAdmin()
  async createDriver(@Body() body) {
    const newDriver = await this.driverService.create(body);
    return {
      data: newDriver,
      message: t('drivers.success.created'),
      status: 'success'
    };
  }

  @Post('/seed')
  @isAdmin()
  async seedDemoDrivers(@Body() body) {
    const seed = await this.driverService.seedDemoDrivers(body);
    return {
      data: seed,
      message: t('drivers.success.seeded'),
      status: 'success'
    };
  }

  // ========== PUT ENDPOINTS ==========

  @Put('/:id')
  @isAdmin()
  async updateDriver(@Params('id') id, @Body() body, @User() user) {
    const updatedDriver = await this.driverService.update(id, body);
    return {
      data: updatedDriver,
      message: t('drivers.success.updated'),
      status: 'success'
    };
  }

  @Put('/:id/status')
  @isAdmin()
  async updateDriverStatus(@Params('id') id, @Body() body) {
    const updatedDriver = await this.driverService.updateStatus(id, body.status);
    return {
      data: updatedDriver,
      message: t('drivers.success.statusUpdated'),
      status: 'success'
    };
  }

  // ========== DELETE ENDPOINTS ==========

  @Delete('/:id')
  @isAdmin()
  async deleteDriver(@Params('id') id) {
    const result = await this.driverService.delete(id);
    return {
      data: result,
      message: t('drivers.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAllDrivers() {
    const result = await this.driverService.deleteAll();
    return {
      data: result,
      message: t('drivers.success.allDeleted'),
      status: 'success'
    };
  }
}
