import { Injectable, t } from 'najm-api';
import { FeeTypeRepository } from './FeeTypeRepository';
import { parseSchema } from '@/server/shared';
import { feeTypeSchema } from '@/lib/validations';

@Injectable()
export class FeeTypeValidator {
  constructor(
    private feeTypeRepository: FeeTypeRepository,
  ) { }

  // ========== SCHEMA VALIDATION ==========

  async validateCreate(data) {
    return parseSchema(feeTypeSchema, data);
  }

  async validateUpdate(data) {
    return parseSchema(feeTypeSchema.partial(), data);
  }

  // ========== UNIQUENESS CHECKS ==========

  async checkIdIsUnique(id: string) {
    const existingFeeType = await this.feeTypeRepository.getById(id);
    if (existingFeeType) {
      throw new Error(t('feeTypes.errors.idExists'));
    }
  }

  async checkNameIsUnique(name: string, excludeId = null) {
    if (!name) return;
    const existingFeeType = await this.feeTypeRepository.getByName(name);
    if (existingFeeType && existingFeeType.id !== excludeId) {
      throw new Error(t('feeTypes.errors.nameAlreadyExists'));
    }
  }

  // ========== EXISTENCE CHECKS ==========

  async isExists(id) {
    const existingFeeType = await this.feeTypeRepository.getById(id);
    return !!existingFeeType;
  }

  async isNameExists(name) {
    if (!name) return false;
    const existingFeeType = await this.feeTypeRepository.getByName(name);
    return !!existingFeeType;
  }

  async checkExists(id) {
    const existingFeeType = await this.feeTypeRepository.getById(id);
    if (!existingFeeType) {
      throw new Error(t('feeTypes.errors.notFound'));
    }
    return existingFeeType;
  }

  async checkNameExists(name) {
    const feeType = await this.feeTypeRepository.getByName(name);
    if (!feeType) {
      throw new Error(t('feeTypes.errors.notFound'));
    }
    return feeType;
  }

  // ========== FIELD VALIDATION ==========

  async validateAmount(amount) {
    if (amount <= 0) {
      throw new Error(t('feeTypes.errors.invalidAmount'));
    }

    if (amount > 1000000) {
      throw new Error(t('feeTypes.errors.amountTooLarge'));
    }

    return true;
  }

  async validateFeeTypeStatus(status) {
    const validStatuses = ['active', 'inactive', 'archived'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('feeTypes.errors.invalidStatus'));
    }
    return true;
  }

  async validatePaymentType(paymentType) {
    const validPaymentTypes = ['recurring', 'oneTime'];
    if (!validPaymentTypes.includes(paymentType)) {
      throw new Error(t('feeTypes.errors.invalidPaymentType'));
    }
    return true;
  }

  // ========== UNIFIED VALIDATION METHOD ==========

  async validate(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkExists(excludeId);
    }

    const schema = isUpdate ? feeTypeSchema.partial() : feeTypeSchema;
    const validatedData = parseSchema(schema, data);

    const { id, name, amount, status, paymentType } = data;

    if (!isUpdate) {
      if (id) await this.checkIdIsUnique(id);
    }

    if (name) await this.checkNameIsUnique(name, excludeId);
    if (amount) await this.validateAmount(amount);
    if (status) await this.validateFeeTypeStatus(status);
    if (paymentType) await this.validatePaymentType(paymentType);

    return validatedData;
  }
}