import { Injectable, t } from 'najm-api';
import { RefuelRepository } from './RefuelRepository';
import { parseSchema } from '@/server/shared';
import { refuelSchema } from '@/lib/validations';



@Injectable()
export class RefuelValidator {
  constructor(private refuelRepository: RefuelRepository) { }

  async validateCreate(data) {
    return parseSchema(refuelSchema, data);
  }

  async validateUpdate(data) {
    const updateSchema = refuelSchema.partial();
    return parseSchema(updateSchema, data);
  }

  async checkExists(id) {
    const refuel = await this.refuelRepository.getById(id);
    if (!refuel) {
      throw new Error(t('refuels.errors.notFound'));
    }
    return true;
  }

  async checkVoucherNumberExists(voucherNumber) {
    const refuel = await this.refuelRepository.getByVoucherNumber(voucherNumber);
    if (!refuel) {
      throw new Error(t('refuels.errors.notFound'));
    }
    return refuel;
  }

  async checkVoucherNumberIsUnique(voucherNumber, excludeId = null) {
    if (!voucherNumber) return true;

    const existing = await this.refuelRepository.getByVoucherNumber(voucherNumber);
    if (existing && existing.id !== excludeId) {
      throw new Error(t('refuels.errors.voucherExists'));
    }
    return true;
  }

  validateDate(date) {
    if (!date) {
      throw new Error(t('refuels.errors.dateRequired'));
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error(t('refuels.errors.invalidDateFormat'));
    }

    return true;
  }

  validateDateRange(startDate, endDate) {
    this.validateDate(startDate);
    this.validateDate(endDate);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new Error(t('refuels.errors.endDateAfterStart'));
    }

    return true;
  }
}
