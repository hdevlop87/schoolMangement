import { Injectable, t } from 'najm-api';
import { DriverRepository } from './DriverRepository';
import { parseSchema } from '@/server/shared';
import { UserValidator } from '../users';
import { driverSchema } from '@/lib/validations';

@Injectable()
export class DriverValidator {
  constructor(
    private driverRepository: DriverRepository,
    private userValidator: UserValidator,
  ) { }

  // ========== SCHEMA VALIDATION ==========

  async validateCreate(data) {
    return parseSchema(driverSchema, data);
  }

  async validateUpdate(data) {
    return parseSchema(driverSchema.partial(), data);
  }

  // ========== UNIQUENESS CHECKS ==========

  async checkUserIdIsUnique(id: string) {
    await this.userValidator.checkUserIdIsUnique(id);
  }

  async checkIdIsUnique(id: string) {
    const existingDriver = await this.driverRepository.getById(id);
    if (existingDriver) {
      throw new Error(t('drivers.errors.idExists'));
    }
  }

  async checkCinIsUnique(cin, excludeId = null) {
    if (!cin) return;
    const existingDriver = await this.driverRepository.getByCin(cin);
    if (existingDriver && existingDriver.id !== excludeId) {
      throw new Error(t('drivers.errors.cinExists'));
    }
  }

  async checkLicenseNumberIsUnique(licenseNumber, excludeId = null) {
    if (!licenseNumber) return;
    const existingDriver = await this.driverRepository.getByLicenseNumber(licenseNumber);
    if (existingDriver && existingDriver.id !== excludeId) {
      throw new Error(t('drivers.errors.licenseExists'));
    }
  }

  // ========== EXISTENCE CHECKS ==========

  async isExists(id) {
    const existingDriver = await this.driverRepository.getById(id);
    return !!existingDriver;
  }

  async isCinExists(cin) {
    if (!cin) return false;
    const existingDriver = await this.driverRepository.getByCin(cin);
    return !!existingDriver;
  }

  async isLicenseNumberExists(licenseNumber) {
    if (!licenseNumber) return false;
    const existingDriver = await this.driverRepository.getByLicenseNumber(licenseNumber);
    return !!existingDriver;
  }

  async isEmailExists(email) {
    if (!email) return false;
    const existingDriver = await this.driverRepository.getByEmail(email);
    return !!existingDriver;
  }

  async isPhoneExists(phone) {
    if (!phone) return false;
    const existingDriver = await this.driverRepository.getByPhone(phone);
    return !!existingDriver;
  }

  async checkExists(id) {
    const driverExists = await this.isExists(id);
    if (!driverExists) {
      throw new Error(t('drivers.errors.notFound'));
    }
    return true;
  }

  async checkCinExists(cin) {
    const driver = await this.driverRepository.getByCin(cin);
    if (!driver) {
      throw new Error(t('drivers.errors.notFound'));
    }
    return driver;
  }

  async checkLicenseNumberExists(licenseNumber) {
    const driver = await this.driverRepository.getByLicenseNumber(licenseNumber);
    if (!driver) {
      throw new Error(t('drivers.errors.notFound'));
    }
    return driver;
  }

  async checkEmailExists(email) {
    const driver = await this.driverRepository.getByEmail(email);
    if (!driver) {
      throw new Error(t('drivers.errors.notFound'));
    }
    return driver;
  }

  async checkPhoneExists(phone) {
    const driver = await this.driverRepository.getByPhone(phone);
    if (!driver) {
      throw new Error(t('drivers.errors.notFound'));
    }
    return driver;
  }

  // ========== UNIQUENESS CHECKS (throw errors) ==========

  async checkEmailIsUnique(email, excludeId = null) {
    if (!email) return;
    const existingDriver = await this.driverRepository.getByEmail(email);
    if (existingDriver && existingDriver.id !== excludeId) {
      throw new Error(t('drivers.errors.emailExists'));
    }
  }

  async checkPhoneIsUnique(phone, excludeId = null) {
    if (!phone) return;
    const existingDriver = await this.driverRepository.getByPhone(phone);
    if (existingDriver && existingDriver.id !== excludeId) {
      throw new Error(t('drivers.errors.phoneExists'));
    }
  }

  // ========== FIELD VALIDATION ==========

  async validateDriverStatus(status) {
    const validStatuses = ['active', 'inactive', 'on_leave', 'suspended'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('drivers.errors.invalidStatus'));
    }
    return true;
  }

  async validateLicenseExpiry(licenseExpiry) {
    const expiryDate = new Date(licenseExpiry);
    const today = new Date();

    if (expiryDate < today) {
      throw new Error(t('drivers.errors.licenseExpired'));
    }
    return true;
  }


  async validate(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkExists(excludeId);
    }

    const schema = isUpdate ? driverSchema.partial() : driverSchema;
    const validatedData = parseSchema(schema, data);

    const { id, userId, cin, licenseNumber, status, licenseExpiry, phone, email } = data;

    if (!isUpdate) {
      if (userId) await this.checkUserIdIsUnique(userId);
      if (id) await this.checkIdIsUnique(id);
    }

    if (isUpdate) {
      await this.checkExists(excludeId);
    }

    if (cin) await this.checkCinIsUnique(cin, excludeId);
    if (licenseNumber) await this.checkLicenseNumberIsUnique(licenseNumber, excludeId);
    if (phone) await this.checkPhoneIsUnique(phone, excludeId);
    if (email) await this.checkEmailIsUnique(email, excludeId);
    if (licenseExpiry) await this.validateLicenseExpiry(licenseExpiry);
    if (status) await this.validateDriverStatus(status);

    return validatedData;
  }
}
