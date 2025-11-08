import { Injectable } from 'najm-api';
import { FeeRepository } from './FeeRepository';
import { FeeValidator } from './FeeValidator';
import { formatDate, isEmpty, pickProps } from '@/server/shared';
import { calculateTotalAmount, getAcademicYearDateRange, getCurrentAcademicYear, getInstallmentInfo } from '@/lib/utils';

@Injectable()
export class FeeService {

  constructor(
    private feeRepository: FeeRepository,
    private feeValidator: FeeValidator,
  ) { }

  // ========================================
  // FEE OPERATIONS
  // ========================================

  async getAll() {
    return await this.feeRepository.getAll();
  }

  async getTotalRevenue() {
    return await this.feeRepository.getTotalRevenue();
  }

  async getRevenueByDateRange(startDate, endDate) {
    return await this.feeRepository.getRevenueByDateRange(startDate, endDate);
  }

  async getRevenueByAcademicYear(academicYear) {
    return await this.feeRepository.getRevenueByAcademicYear(academicYear);
  }

  async getRevenue() {
    const { startDate, endDate } = getAcademicYearDateRange();
    return await this.feeRepository.getRevenueByDateRange(startDate, endDate);
  }

  async getById(id) {
    await this.feeValidator.checkExists(id);
    return await this.feeRepository.getById(id);
  }

  async getByStudent(studentId) {
    await this.feeValidator.validateStudentExists(studentId);
    return await this.feeRepository.getByStudent(studentId);
  }

  async create(data, assignedBy?) {

    await this.feeValidator.validate(data);

    const academicYear = getCurrentAcademicYear();
    const feeType = await this.feeValidator.validateFeeTypeExists(data.feeTypeId);
    const totalAmount = calculateTotalAmount(feeType.amount, data.schedule, data.discountAmount);

    const feeDetails = {
      studentId: data.studentId,
      feeTypeId: data.feeTypeId,
      schedule: data.schedule,
      academicYear,
      totalAmount,
      paidAmount: '0',
      discountAmount: data.discountAmount || '0',
      status: 'pending',
      notes: data.notes || null,
      assignedBy: assignedBy || null,
    };

    return await this.feeRepository.create(feeDetails);
  }

  async createBulk(data, assignedBy?) {
    return await Promise.all(
      data.fees.map(fee => this.create(fee, assignedBy))
    );
  }

  async processFees(student?, fees?, user?) {
    if (isEmpty(fees)) return;
    
    const studentId = student?.id;
    const assignedBy = user?.id;

    if (!fees || fees.length === 0) {
      return [];
    }

    const feesWithStudentId = fees.map(fee => ({
      ...fee,
      studentId
    }));

    const createdFees = await this.createBulk(
      { fees: feesWithStudentId },
      assignedBy
    );

    return createdFees.map(fee => fee.id);
  }

  async update(id, data) {

    const FEE_UPDATE_KEYS = [
      'studentId', 'feeTypeId', 'schedule', 'academicYear', 'totalAmount',
      'discountAmount', 'status', 'notes', 'assignedBy'
    ];

    await this.feeValidator.validate(data, id);

    const existingFee = await this.feeRepository.getById(id);
    const feeData = pickProps(data, FEE_UPDATE_KEYS);

    const needsRecalculation =
      data.feeTypeId !== undefined ||
      data.schedule !== undefined ||
      data.discountAmount !== undefined;

    if (needsRecalculation) {
      const feeTypeId = data.feeTypeId || existingFee.feeTypeId;
      const feeType = await this.feeValidator.validateFeeTypeExists(feeTypeId);

      const schedule = data.schedule !== undefined ? data.schedule : existingFee.schedule;
      const discountAmount = data.discountAmount !== undefined ? data.discountAmount : existingFee.discountAmount;

      feeData.totalAmount = calculateTotalAmount(feeType.amount, schedule, discountAmount);
    }

    if (!isEmpty(feeData)) {
      await this.feeValidator.validateUpdate(feeData);
      return await this.feeRepository.update(id, feeData);
    }

    return await this.getById(id);
  }

  async delete(id) {
    return await this.feeRepository.delete(id);
  }

  async deleteAll() {
    return await this.feeRepository.deleteAll();
  }

  async updateFeeStatus(feeId) {
    const fee = await this.feeRepository.getById(feeId);
    if (!fee) return;

    const totalAmount = Number(fee.totalAmount) || 0;
    const discountAmount = Number(fee.discountAmount) || 0;
    const paidAmount = Number(fee.paidAmount) || 0;
    const netAmount = totalAmount - discountAmount;

    let status = 'pending';
    if (paidAmount >= netAmount) {
      status = 'paid';
    } else if (paidAmount > 0) {
      status = 'partially_paid';
    } else {
      // Check if overdue
      const schedules = await this.feeRepository.getSchedulesByFeeId(feeId);
      const today = new Date();
      const hasOverdue = schedules.some(s => {
        const dueDate = new Date(s.dueDate);
        return dueDate < today && s.status !== 'paid';
      });
      if (hasOverdue) {
        status = 'overdue';
      }
    }

    await this.feeRepository.update(feeId, { status });
  }

  // ========================================
  // PAYMENT SCHEDULE OPERATIONS
  // ========================================

  async getSchedulesByFee(feeId) {
    await this.feeValidator.checkExists(feeId);
    return await this.feeRepository.getSchedulesByFeeId(feeId);
  }

  async generatePaymentSchedules(feeId, schedule, totalAmount, discountAmount = 0) {
    const netAmount = totalAmount - discountAmount;
    const schedules: any[] = [];

    const today = new Date();

    // Use helper function to get installment info
    const { installmentCount, installmentAmount } = getInstallmentInfo(schedule, netAmount);

    // Generate schedules
    for (let i = 1; i <= installmentCount; i++) {
      const dueDate = new Date(today);

      if (schedule === 'monthly') {
        dueDate.setMonth(today.getMonth() + i);
      } else if (schedule === 'quarterly') {
        dueDate.setMonth(today.getMonth() + (i * 3));
      } else if (schedule === 'semester') {
        dueDate.setMonth(today.getMonth() + (i * 6));
      } else if (schedule === 'annually') {
        dueDate.setFullYear(today.getFullYear() + i);
      } else {
        // oneTime - due in 30 days
        dueDate.setDate(today.getDate() + 30);
      }

      // Adjust last installment to cover any rounding differences
      const amount = (i === installmentCount)
        ? netAmount - (installmentAmount * (installmentCount - 1))
        : installmentAmount;

      schedules.push({
        feeId,
        installment: i,
        dueDate: formatDate(dueDate), // formatDate already handles Date objects
        amount: amount.toString(),
        paidAmount: '0',
        status: 'pending',
      });
    }

    // Create all schedules
    for (const scheduleData of schedules) {
      await this.feeRepository.createSchedule(scheduleData);
    }

    return schedules;
  }

  // ========================================
  // PAYMENT OPERATIONS
  // ========================================

  async recordPayment(data, processedBy?) {
    const {
      feeId,
      scheduleId,
      amount,
      paymentMethod,
      paymentDate,
      checkNumber,
      checkDueDate,
      transactionRef,
      receiptNumber,
      status,
      notes,
    } = data;

    // Validate fee exists
    const fee = await this.feeValidator.checkExists(feeId);

    // Validate payment amount
    await this.feeValidator.validatePaymentAmount(feeId, amount);

    // Validate check payment if applicable
    if (paymentMethod === 'check') {
      await this.feeValidator.validateCheckPayment(checkNumber, checkDueDate);
    }

    // Validate schedule if provided
    if (scheduleId) {
      await this.feeValidator.validateScheduleExists(scheduleId);
    }

    const paymentDetails: any = {
      feeId,
      scheduleId: scheduleId || null,
      studentId: fee.studentId,
      amount,
      paymentMethod,
      paymentDate: formatDate(paymentDate),
      checkNumber: paymentMethod === 'check' ? checkNumber : null,
      checkDueDate: paymentMethod === 'check' && checkDueDate ? formatDate(checkDueDate) : null,
      transactionRef: transactionRef || null,
      receiptNumber: receiptNumber || this.generateReceiptNumber(),
      status: status || 'completed',
      processedBy: processedBy || null,
      notes: notes || null,
    };

    await this.feeValidator.validatePayment(paymentDetails);

    // Create payment
    const newPayment = await this.feeRepository.createPayment(paymentDetails);

    // Update fee paid amount
    const currentPaidAmount = Number(fee.paidAmount) || 0;
    const newPaidAmount = currentPaidAmount + Number(amount);
    await this.feeRepository.update(feeId, { paidAmount: newPaidAmount.toString() });

    // Update schedule if provided
    if (scheduleId) {
      const schedule = await this.feeRepository.getScheduleById(scheduleId);
      if (schedule) {
        const schedulePaidAmount = Number(schedule.paidAmount) || 0;
        const scheduleAmount = Number(schedule.amount) || 0;
        const newSchedulePaidAmount = schedulePaidAmount + Number(amount);

        let scheduleStatus = 'pending';
        if (newSchedulePaidAmount >= scheduleAmount) {
          scheduleStatus = 'paid';
        } else if (newSchedulePaidAmount > 0) {
          scheduleStatus = 'partially_paid';
        }

        await this.feeRepository.updateSchedule(scheduleId, {
          paidAmount: newSchedulePaidAmount.toString(),
          status: scheduleStatus,
        });
      }
    }

    // Update fee status
    await this.updateFeeStatus(feeId);

    return newPayment;
  }

  async updatePayment(id, data) {
    const payment = await this.feeValidator.checkPaymentExists(id);

    const updateData: any = {};

    if (data.amount !== undefined) {
      await this.feeValidator.validatePaymentAmount(payment.feeId, data.amount);

      // Adjust fee and schedule paid amounts
      const oldAmount = Number(payment.amount);
      const newAmount = Number(data.amount);
      const difference = newAmount - oldAmount;

      const fee = await this.feeRepository.getById(payment.feeId);
      const currentPaidAmount = Number(fee.paidAmount) || 0;
      await this.feeRepository.update(payment.feeId, {
        paidAmount: (currentPaidAmount + difference).toString()
      });

      if (payment.scheduleId) {
        const schedule = await this.feeRepository.getScheduleById(payment.scheduleId);
        if (schedule) {
          const schedulePaidAmount = Number(schedule.paidAmount) || 0;
          await this.feeRepository.updateSchedule(payment.scheduleId, {
            paidAmount: (schedulePaidAmount + difference).toString()
          });
        }
      }

      updateData.amount = data.amount;
    }

    if (data.paymentMethod !== undefined) {
      updateData.paymentMethod = data.paymentMethod;
      if (data.paymentMethod === 'check' && !data.checkNumber) {
        throw new Error('Check number is required for check payments');
      }
    }

    if (data.paymentDate !== undefined) {
      updateData.paymentDate = formatDate(data.paymentDate);
    }

    if (data.checkNumber !== undefined) updateData.checkNumber = data.checkNumber;
    if (data.checkDueDate !== undefined) {
      updateData.checkDueDate = formatDate(data.checkDueDate);
    }
    if (data.transactionRef !== undefined) updateData.transactionRef = data.transactionRef;
    if (data.receiptNumber !== undefined) updateData.receiptNumber = data.receiptNumber;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    if (Object.keys(updateData).length > 0) {
      await this.feeRepository.updatePayment(id, updateData);
    }

    // Update fee status
    await this.updateFeeStatus(payment.feeId);

    return await this.feeRepository.getPaymentById(id);
  }

  async getPaymentsByFee(feeId) {
    await this.feeValidator.checkExists(feeId);
    return await this.feeRepository.getPaymentsByFeeId(feeId);
  }

  async getPaymentsByStudent(studentId) {
    await this.feeValidator.validateStudentExists(studentId);
    return await this.feeRepository.getPaymentsByStudent(studentId);
  }

  async getAllPayments() {
    return await this.feeRepository.getAllPayments();
  }

  async deletePayment(id) {
    const payment = await this.feeValidator.checkPaymentExists(id);

    // Adjust fee and schedule paid amounts
    const amount = Number(payment.amount);

    const fee = await this.feeRepository.getById(payment.feeId);
    const currentPaidAmount = Number(fee.paidAmount) || 0;
    await this.feeRepository.update(payment.feeId, {
      paidAmount: Math.max(0, currentPaidAmount - amount).toString()
    });

    if (payment.scheduleId) {
      const schedule = await this.feeRepository.getScheduleById(payment.scheduleId);
      if (schedule) {
        const schedulePaidAmount = Number(schedule.paidAmount) || 0;
        const newSchedulePaidAmount = Math.max(0, schedulePaidAmount - amount);
        await this.feeRepository.updateSchedule(payment.scheduleId, {
          paidAmount: newSchedulePaidAmount.toString(),
          status: newSchedulePaidAmount > 0 ? 'partially_paid' : 'pending'
        });
      }
    }

    // Delete payment
    const result = await this.feeRepository.deletePayment(id);

    // Update fee status
    await this.updateFeeStatus(payment.feeId);

    return result;
  }

  // ========================================
  // ANALYTICS
  // ========================================

  async getStudentAnalytics(studentId) {
    await this.feeValidator.validateStudentExists(studentId);
    return await this.feeRepository.getStudentFeeAnalytics(studentId);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  private generateReceiptNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RCP-${timestamp}-${random}`;
  }
}
