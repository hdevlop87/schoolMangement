import { Injectable, t } from 'najm-api';
import { FeeRepository } from './FeeRepository';
import { parseSchema } from '@/server/shared';
import { feeSchema, paymentScheduleSchema, feePaymentSchema } from '@/lib/validations';
import { StudentValidator } from '../students/StudentValidator';
import { FeeTypeValidator } from '../feeTypes/FeeTypeValidator';

@Injectable()
export class FeeValidator {
  constructor(
    private feeRepository: FeeRepository,
    private studentValidator: StudentValidator,
    private feeTypeValidator: FeeTypeValidator,
  ) { }

  // ========== SCHEMA VALIDATION ==========

  async validateCreate(data) {
    return parseSchema(feeSchema, data);
  }

  async validateUpdate(data) {
    return parseSchema(feeSchema.partial(), data);
  }

  async validatePayment(data) {
    return parseSchema(feePaymentSchema, data);
  }

  async validateSchedule(data) {
    return parseSchema(paymentScheduleSchema, data);
  }

  // ========== EXISTENCE CHECKS ==========

  async isExists(id: string) {
    const existingFee = await this.feeRepository.getById(id);
    return !!existingFee;
  }

  async isPaymentExists(id: string) {
    const existingPayment = await this.feeRepository.getPaymentById(id);
    return !!existingPayment;
  }

  async isScheduleExists(id: string) {
    const existingSchedule = await this.feeRepository.getScheduleById(id);
    return !!existingSchedule;
  }

  async checkExists(id) {
    const feeExists = await this.feeRepository.getById(id);
    if (!feeExists) {
      throw new Error(t('fees.errors.notFound'));
    }
    return feeExists;
  }

  async checkPaymentExists(id: string) {
    const paymentExists = await this.feeRepository.getPaymentById(id);
    if (!paymentExists) {
      throw new Error(t('fees.errors.paymentNotFound'));
    }
    return paymentExists;
  }

  async checkScheduleExists(id: string) {
    const scheduleExists = await this.feeRepository.getScheduleById(id);
    if (!scheduleExists) {
      throw new Error(t('fees.errors.scheduleNotFound'));
    }
    return scheduleExists;
  }

  // ========== UNIQUENESS CHECKS ==========

  async checkFeeIsUnique(
    studentId: string,
    academicYear: string,
    feeTypeId: string,
    excludeId: string | null = null
  ) {
    const existingFee = await this.feeRepository.getByStudentAndYear(
      studentId,
      academicYear,
      feeTypeId
    );

    if (existingFee && existingFee.id !== excludeId) {
      throw new Error(t('fees.errors.feeAlreadyExists'));
    }
  }

  // ========== FIELD VALIDATION ==========

  async validateFeeStatus(status: string) {
    const validStatuses = ['pending', 'paid', 'partially_paid', 'overdue', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('fees.errors.invalidStatus'));
    }
    return true;
  }

  async validatePaymentStatus(status: string) {
    const validStatuses = ['completed', 'pending', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('fees.errors.invalidPaymentStatus'));
    }
    return true;
  }

  async validatePaymentAmount(feeId: string, paymentAmount: number) {
    const fee = await this.checkExists(feeId);

    if (paymentAmount <= 0) {
      throw new Error(t('fees.errors.invalidPaymentAmount'));
    }

    const totalAmount = Number(fee.totalAmount) || 0;
    const discountAmount = Number(fee.discountAmount) || 0;
    const paidAmount = Number(fee.paidAmount) || 0;
    const netAmount = totalAmount - discountAmount;
    const remainingAmount = netAmount - paidAmount;

    if (paymentAmount > remainingAmount) {
      throw new Error(
        t('fees.errors.paymentExceedsBalance', {
          remaining: remainingAmount,
          attempted: paymentAmount
        })
      );
    }

    return true;
  }

  async validateCheckPayment(checkNumber?: string, checkDueDate?: string) {
    if (!checkNumber) {
      throw new Error(t('fees.errors.checkNumberRequired'));
    }

    if (checkDueDate) {
      const dueDate = new Date(checkDueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        throw new Error(t('fees.errors.checkDueDateInPast'));
      }
    }

    return true;
  }

  async validateSchedulePayment(scheduleId: string, amount: number) {
    const schedule = await this.checkScheduleExists(scheduleId);

    const scheduleAmount = Number(schedule.amount) || 0;
    const paidAmount = Number(schedule.paidAmount) || 0;
    const remainingAmount = scheduleAmount - paidAmount;

    if (amount > remainingAmount) {
      throw new Error(
        t('fees.errors.schedulePaymentExceedsBalance', {
          remaining: remainingAmount,
          attempted: amount
        })
      );
    }

    return true;
  }

  async validateDiscountAmount(totalAmount, discountAmount) {
    const total = Number(totalAmount) || 0;
    const discount = Number(discountAmount) || 0;

    if (discount > total) {
      throw new Error(
        t('fees.errors.discountExceedsTotal', {
          total: total,
          discount: discount
        })
      );
    }

    return true;
  }

  // ========== RELATED ENTITY VALIDATION ==========

  async validateStudentExists(studentId) {
    await this.studentValidator.checkExists(studentId);
  }

  async validateFeeTypeExists(feeTypeId) {
    return await this.feeTypeValidator.checkExists(feeTypeId);
  }

  async validateScheduleExists(scheduleId) {
    await this.checkScheduleExists(scheduleId);
  }

  // ========== UNIFIED VALIDATION ==========

  async validate(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkExists(excludeId);
    }

    const schema = isUpdate ? feeSchema.partial() : feeSchema;
    const validatedData = parseSchema(schema, data);

    const {
      studentId,
      feeTypeId,
      academicYear,
      schedule,
      discountAmount,
      totalAmount,
      status
    } = data;

    if (studentId) {
      await this.studentValidator.checkExists(studentId);
    }

    if (feeTypeId) {
      await this.feeTypeValidator.checkExists(feeTypeId);
    }

    if (studentId && academicYear && feeTypeId) {
      await this.checkFeeIsUnique(studentId, academicYear, feeTypeId, excludeId);
    }

    if (status) {
      await this.validateFeeStatus(status);
    }

    if (discountAmount && totalAmount) {
      await this.validateDiscountAmount(totalAmount, discountAmount);
    }

    return validatedData;
  }

  // ========== PAYMENT VALIDATION ==========

  async validatePaymentData(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkPaymentExists(excludeId);
    }

    const validatedData = parseSchema(feePaymentSchema, data);

    const { feeId, scheduleId, amount, paymentMethod, checkNumber, checkDueDate, status } = data;

    if (feeId) {
      await this.checkExists(feeId);
      if (amount) {
        await this.validatePaymentAmount(feeId, amount);
      }
    }

    if (scheduleId) {
      await this.checkScheduleExists(scheduleId);
      if (amount) {
        await this.validateSchedulePayment(scheduleId, amount);
      }
    }

    if (paymentMethod === 'check') {
      await this.validateCheckPayment(checkNumber, checkDueDate);
    }

    if (status) {
      await this.validatePaymentStatus(status);
    }

    return validatedData;
  }

  // ========== SCHEDULE VALIDATION ==========

  async validateScheduleData(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkScheduleExists(excludeId);
    }

    const validatedData = parseSchema(paymentScheduleSchema, data);

    const { feeId } = data;

    if (feeId) {
      await this.checkExists(feeId);
    }

    return validatedData;
  }
}
