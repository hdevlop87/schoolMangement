import { Injectable, t } from 'najm-api';
import { VehicleRepository } from './VehicleRepository';
import { parseSchema } from '@/server/shared';
import { vehicleSchema } from '@/lib/validations';


@Injectable()
export class VehicleValidator {
  constructor(
    private vehicleRepository: VehicleRepository,
  ) { }

  async validateCreateSchema(data) {
    return parseSchema(vehicleSchema, data);
  }

  async validateUpdateSchema(data) {
    return parseSchema(vehicleSchema.partial(), data);
  }


  async checkVehicleIdIsUnique(id) {
    const existingVehicle = await this.vehicleRepository.getById(id);
    if (existingVehicle) {
      throw new Error(t('vehicles.errors.idExists'));
    }
  }

  async isVehicleExists(id) {
    const existingVehicle = await this.vehicleRepository.getById(id);
    return !!existingVehicle;
  }


  async isLicensePlateExists(licensePlate) {
    if (!licensePlate) return false;
    const existingVehicle = await this.vehicleRepository.getByLicensePlate(licensePlate);
    return !!existingVehicle;
  }

  validateVehicleType(type) {
    const validTypes = ['sedan', 'minibus', 'fullbus', 'shuttle'];
    if (!validTypes.includes(type)) {
      throw new Error(t('vehicles.errors.invalidType'));
    }
    return true;
  }

  validateVehicleStatus(status) {
    const validStatuses = ['active', 'maintenance', 'retired'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('vehicles.errors.invalidStatus'));
    }
    return true;
  }

  validateFuelType(fuelType) {
    const validFuelTypes = ['diesel', 'gasoline', 'electric', 'hybrid'];
    if (!validFuelTypes.includes(fuelType)) {
      throw new Error(t('vehicles.errors.invalidFuelType'));
    }
    return true;
  }

  checkYearIsValid(year) {
    const currentYear = new Date().getFullYear();
    const minYear = 1900;

    if (year < minYear || year > currentYear) {
      throw new Error(t('vehicles.errors.invalidYear', { minYear, currentYear }));
    }
    return true;
  }

  //======================= Existence Checks (throw errors)

  async checkVehicleExists(id) {
    const vehicleExists = await this.isVehicleExists(id);
    if (!vehicleExists) {
      throw new Error(t('vehicles.errors.notFound'));
    }
    return true;
  }


  async checkLicensePlateExists(licensePlate) {
    const vehicle = await this.vehicleRepository.getByLicensePlate(licensePlate);
    if (!vehicle) {
      throw new Error(t('vehicles.errors.notFound'));
    }
    return vehicle;
  }

  //======================= Uniqueness Checks (throw errors)

  async checkLicensePlateIsUnique(licensePlate, excludeId = null) {
    if (!licensePlate) return;

    const existingVehicle = await this.vehicleRepository.getByLicensePlate(licensePlate);
    if (existingVehicle && existingVehicle.id !== excludeId) {
      throw new Error(t('vehicles.errors.licensePlateExists'));
    }
  }

  //======================= Input Validation Helpers

  validateEngineHours(hours) {
    const numericHours = parseFloat(hours);
    if (isNaN(numericHours) || numericHours < 0) {
      throw new Error(t('vehicles.errors.invalidEngineHours'));
    }
    return true;
  }

  validateMileage(mileage) {
    const numericMileage = parseFloat(mileage);
    if (isNaN(numericMileage) || numericMileage < 0) {
      throw new Error(t('vehicles.errors.invalidMileage'));
    }
    return true;
  }

  validateFuelCapacity(capacity) {
    if (!capacity) return true;

    const numericCapacity = parseFloat(capacity);
    if (isNaN(numericCapacity) || numericCapacity <= 0) {
      throw new Error(t('vehicles.errors.invalidFuelCapacity'));
    }
    return true;
  }

  validatePurchasePrice(price) {
    if (!price) return true;

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      throw new Error(t('vehicles.errors.invalidPurchasePrice'));
    }
    return true;
  }

  //======================= Driver Assignment Validation

  async validateDriverAssignment(vehicleId: string, driverId: string) {
    await this.checkVehicleExists(vehicleId);

    const existingVehicle = await this.vehicleRepository.getByDriverId(driverId);
    if (existingVehicle) throw new Error(t('vehicles.errors.driverAlreadyAssigned'));

    const vehicle = await this.vehicleRepository.getById(vehicleId);
    if (vehicle.driverId) throw new Error(t('vehicles.errors.vehicleAlreadyAssigned'));
    return true;
  }

  async validateDriverUnassignment(vehicleId: string) {
    await this.checkVehicleExists(vehicleId);
    const vehicle = await this.vehicleRepository.getById(vehicleId);
    if (!vehicle.driverId) throw new Error(t('vehicles.errors.noDriverAssigned'));

    return true;
  }

  // ========== UNIFIED VALIDATION ==========

  async validate(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkVehicleExists(excludeId);
    }

    const schema = isUpdate ? vehicleSchema.partial() : vehicleSchema;
    const validatedData = parseSchema(schema, data);

    const { id, licensePlate, year, type, status, fuelType, tankCapacity, purchasePrice } = data;

    if (!isUpdate) {
      if (id) await this.checkVehicleIdIsUnique(id);
    }

    if (licensePlate) await this.checkLicensePlateIsUnique(licensePlate, excludeId);
    if (year) this.checkYearIsValid(isUpdate ? parseInt(year) : year);
    if (type) this.validateVehicleType(type);
    if (status) this.validateVehicleStatus(status);
    if (fuelType) this.validateFuelType(fuelType);
    if (tankCapacity) this.validateFuelCapacity(tankCapacity);
    if (purchasePrice) this.validatePurchasePrice(purchasePrice);

    return validatedData;
  }

  // ========================================
  // VEHICLE_VALIDATIONS
  // ========================================

  async checkCurrentMileageValid(
    initialMileage?: number | null,
    currentMileage?: number | null
  ) {
    if (
      initialMileage !== undefined &&
      initialMileage !== null &&
      currentMileage !== undefined &&
      currentMileage !== null
    ) {
      if (currentMileage < initialMileage) {
        throw new Error(t('vehicles.errors.currentMileageLessThanInitial'));
      }
    }
    return true;
  }

}