import { Injectable } from 'najm-api';
import { DriverRepository } from './DriverRepository';
import { DriverValidator } from './DriverValidator';
import { UserService } from '../users/UserService';
import { formatDate, isEmpty, pickProps } from '@/server/shared';

@Injectable()
export class DriverService {

  constructor(
    private driverRepository: DriverRepository,
    private driverValidator: DriverValidator,
    private userService: UserService,
  ) { }

  // ========== RETRIEVAL METHODS ==========

  async getAll() {
    return await this.driverRepository.getAll();
  }

  async getCount() {
    return await this.driverRepository.getCount();
  }

  async getById(id) {
    await this.driverValidator.checkExists(id);
    return await this.driverRepository.getById(id);
  }

  async getByCin(cin) {
    await this.driverValidator.checkCinExists(cin);
    return await this.driverRepository.getByCin(cin);
  }

  async getByLicenseNumber(licenseNumber) {
    await this.driverValidator.checkLicenseNumberExists(licenseNumber);
    return await this.driverRepository.getByLicenseNumber(licenseNumber);
  }

  async getByEmail(email) {
    await this.driverValidator.checkEmailExists(email);
    return await this.driverRepository.getByEmail(email);
  }

  async getByPhone(phone) {
    await this.driverValidator.checkPhoneExists(phone);
    return await this.driverRepository.getByPhone(phone);
  }

  async getByStatus(status) {
    await this.driverValidator.validateDriverStatus(status);
    return await this.driverRepository.getByStatus(status);
  }

  async getLicenseExpiringDrivers() {
    return await this.driverRepository.getLicenseExpiringDrivers();
  }

  async getAssignedVehicles(driverId) {
    await this.driverValidator.checkExists(driverId);
    return await this.driverRepository.getAssignedVehicles(driverId);
  }

  private resolveDriverImage(image?, gender?) {
    if (image) return image;
    if (gender === 'F') return '/images/driverF.png';
    return '/images/driverM.png';
  }

  // ========== CREATE-METHOD ==========

  async create(data) {

    await this.driverValidator.validate(data);

    const driverImage = this.resolveDriverImage(data.image, data.gender);

    let createdUser = null;

    try {

      const userData = {
        id: data.userId,
        email: data.email,
        name: data.name,
        image: driverImage,
        role: 'driver',
      };
      createdUser = await this.userService.create(userData);

      const driverDetails = {
        id: data.id,
        userId: createdUser.id,
        cin: data.cin,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        licenseNumber: data.licenseNumber,
        licenseType: data.licenseType,
        licenseExpiry: data.licenseExpiry,
        hireDate: data.hireDate,
        salary: data.salary,
        yearsOfExperience: data.yearsOfExperience,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        status: data.status,
        notes: data.notes,
      };
      return await this.driverRepository.create(driverDetails);

    } catch (error) {
      if (createdUser) {
        await this.userService.delete(createdUser.id);
      }
      throw error;
    }
  }

  // ========== UPDATE-METHOD ==========

  async update(id, data) {

    const USER_UPDATE_KEYS = [
      'name', 'email', 'image', 'password'
    ];

    const DRIVER_UPDATE_KEYS = [
      'name', 'email', 'cin', 'phone', 'address', 'gender', 'licenseNumber',
      'licenseType', 'licenseExpiry', 'hireDate', 'salary', 'yearsOfExperience',
      'emergencyContactName', 'emergencyPhone', 'status', 'notes'
    ];

    await this.driverValidator.validate(data, id);

    const driver = await this.driverRepository.getById(id);
    const userData = pickProps(data, USER_UPDATE_KEYS);
    const driverData = pickProps(data, DRIVER_UPDATE_KEYS);

    if (!isEmpty(userData)) {
      await this.userService.update(driver.userId, userData);
    }

    await this.driverValidator.validateUpdate(driverData);
    return await this.driverRepository.update(id, driverData);

  }

  // ========== STATUS-UPDATE-METHOD ==========

  async updateStatus(id, status) {
    await this.driverValidator.checkExists(id);
    await this.driverValidator.validateDriverStatus(status);
    return await this.driverRepository.update(id, { status });
  }

  // ========== DELETE-METHODS ==========

  async delete(id) {
    await this.driverValidator.checkExists(id);
    return await this.driverRepository.delete(id);
  }

  async deleteAll() {
    return await this.driverRepository.deleteAll();
  }

  // ========== SEED METHOD ==========

  async seedDemoDrivers(driversData) {
    const createdDrivers = [];

    for (const driverData of driversData) {
      try {
        const driver = await this.create(driverData);
        createdDrivers.push(driver);
      } catch (error) {
        continue;
      }
    }
    return createdDrivers;
  }
}
