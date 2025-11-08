import { Injectable } from 'najm-api';
import { VehicleRepository } from './VehicleRepository';
import { VehicleValidator } from './VehicleValidator';

@Injectable()
export class VehicleService {
  constructor(
    private vehicleRepository: VehicleRepository,
    private vehicleValidator: VehicleValidator,
  ) { }

  async getAll(filter) {
    return await this.vehicleRepository.getAll(filter);
  }

  async getById(id) {
    await this.vehicleValidator.checkVehicleExists(id);
    return await this.vehicleRepository.getById(id);
  }

  async getByStatus(status) {
    await this.vehicleValidator.validateVehicleStatus(status);
    return await this.vehicleRepository.getByStatus(status);
  }

  async getByLicensePlate(licensePlate) {
    await this.vehicleValidator.checkLicensePlateExists(licensePlate);
    return await this.vehicleRepository.getByLicensePlate(licensePlate);
  }

  async getCount() {
    return await this.vehicleRepository.getCount();
  }

  async create(data) {

    await this.vehicleValidator.validate(data);

    const vehicleDetails = {
      ...(data.id && { id: data.id }),
      type: data.type,
      name: data.name,
      brand: data.brand,
      model: data.model,
      year: data.year,
      capacity: data.capacity,
      licensePlate: data.licensePlate,
      driverId: data.driverId,
      purchaseDate: data.purchaseDate,
      purchasePrice: data.purchasePrice,
      status: data.status || 'active',
      fuelType: data.fuelType || 'diesel',
      initialMileage: data.initialMileage || '0',
      currentMileage: data.currentMileage,
      notes: data.notes
    }

    return await this.vehicleRepository.create(vehicleDetails);
  }

  async update(id, data) {
    await this.vehicleValidator.validate(data, id);
    return await this.vehicleRepository.update(id, data);
  }

  async updateStatus(id, status) {
    await this.vehicleValidator.checkVehicleExists(id);
    await this.vehicleValidator.validateVehicleStatus(status);
    return await this.vehicleRepository.update(id, { status });
  }

  async delete(id) {
    await this.vehicleValidator.checkVehicleExists(id);
    return await this.vehicleRepository.delete(id);
  }

  async getVehicleUsageStats(id) {
    await this.vehicleValidator.checkVehicleExists(id);
    return await this.vehicleRepository.getUsageStats(id);
  }

  async deleteAll() {
    return await this.vehicleRepository.deleteAll();
  }

  async updateCurrentMileage(id, mileage) {
    await this.vehicleValidator.checkVehicleExists(id);
    await this.vehicleValidator.validateMileage(mileage);

    const updateData = {
      currentMileage: mileage.toString()
    };
    return await this.vehicleRepository.update(id, updateData);
  }

  async getTotalFleetMileage() {
    return await this.vehicleRepository.getTotalFleetMileage();
  }

  async getByDriverId(driverId) {
    return await this.vehicleRepository.getByDriverId(driverId);
  }

  async getUnassignedVehicles() {
    return await this.vehicleRepository.getUnassignedVehicles();
  }

  async getAssignedVehicles() {
    return await this.vehicleRepository.getAssignedVehicles();
  }

  async assignDriver(vehicleId, driverId) {
    await this.vehicleValidator.validateDriverAssignment(vehicleId, driverId);
    return await this.vehicleRepository.update(vehicleId, { driverId });
  }

  async unassignDriver(vehicleId) {
    await this.vehicleValidator.validateDriverUnassignment(vehicleId);
    return await this.vehicleRepository.update(vehicleId, { driverId: null });
  }


  async seedDemoVehicles(vehiclesData) {
    const createdVehicles = [];
    for (const vehicleData of vehiclesData) {
      try {
        const vehicle = await this.create(vehicleData);
        createdVehicles.push(vehicle);
      } catch (error) {
        continue;
      }
    }
    return createdVehicles;
  }

}