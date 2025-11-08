import { Repository } from 'najm-api';
import { eq, desc, and, count, sum, sql, inArray } from 'drizzle-orm';
import { fees, feeTypes, paymentSchedules, payments, students, classes, sections, users } from '@/server/database/schema';
import { DB } from '@/server/database/db';
import { alias } from 'drizzle-orm/pg-core';

@Repository()
export class FeeRepository {
  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildFeeQuery() {
    const assignerUser = alias(users, 'assigner_user');

    return this.db
      .select({
        id: fees.id,
        studentId: fees.studentId,
        feeTypeId: fees.feeTypeId,
        schedule: fees.schedule,
        academicYear: fees.academicYear,
        totalAmount: fees.totalAmount,
        paidAmount: fees.paidAmount,
        discountAmount: fees.discountAmount,
        status: fees.status,
        notes: fees.notes,
        assignedBy: fees.assignedBy,
        createdAt: fees.createdAt,
        updatedAt: fees.updatedAt,
        student: {
          id: students.id,
          name: students.name,
          studentCode: students.studentCode,
          image: users.image,
        },
        feeType: {
          id: feeTypes.id,
          name: feeTypes.name,
          category: feeTypes.category,
          description: feeTypes.description,
          amount: feeTypes.amount,
        },
        class: {
          id: classes.id,
          name: classes.name,
        },
        section: {
          id: sections.id,
          name: sections.name,
        },
        assigner: {
          id: assignerUser.id,
          email: assignerUser.email,
          image: assignerUser.image,
        },
      })
      .from(fees)
      .leftJoin(students, eq(fees.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(feeTypes, eq(fees.feeTypeId, feeTypes.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(sections, eq(students.sectionId, sections.id))
      .leftJoin(assignerUser, eq(fees.assignedBy, assignerUser.id));
  }

  private buildScheduleQuery() {
    return this.db
      .select({
        id: paymentSchedules.id,
        feeId: paymentSchedules.feeId,
        installment: paymentSchedules.installment,
        dueDate: paymentSchedules.dueDate,
        amount: paymentSchedules.amount,
        paidAmount: paymentSchedules.paidAmount,
        status: paymentSchedules.status,
        createdAt: paymentSchedules.createdAt,
        updatedAt: paymentSchedules.updatedAt,
      })
      .from(paymentSchedules);
  }

  private buildPaymentQuery() {
    const processorUsers = alias(users, 'processor_users');
    const studentUsers = alias(users, 'student_users');

    return this.db
      .select({
        id: payments.id,
        feeId: payments.feeId,
        scheduleId: payments.scheduleId,
        studentId: payments.studentId,
        amount: payments.amount,
        paymentDate: payments.paymentDate,
        paymentMethod: payments.paymentMethod,
        checkNumber: payments.checkNumber,
        checkDueDate: payments.checkDueDate,
        transactionRef: payments.transactionRef,
        receiptNumber: payments.receiptNumber,
        status: payments.status,
        processedBy: payments.processedBy,
        notes: payments.notes,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
        processor: {
          id: processorUsers.id,
          email: processorUsers.email,
          image: processorUsers.image,
        },
        student: {
          id: students.id,
          name: students.name,
          studentCode: students.studentCode,
          image: studentUsers.image,
        },
      })
      .from(payments)
      .leftJoin(processorUsers, eq(payments.processedBy, processorUsers.id))
      .leftJoin(students, eq(payments.studentId, students.id))
      .leftJoin(studentUsers, eq(students.userId, studentUsers.id));
  }

  // ========================================
  // GET_READ_METHODS - Fees
  // ========================================

  async getCount() {
    const [feesCount] = await this.db
      .select({ count: count() })
      .from(fees);
    return feesCount;
  }

  async getAll() {
    return await this.buildFeeQuery()
      .orderBy(desc(fees.createdAt));
  }

  async getByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    return await this.buildFeeQuery()
      .where(inArray(fees.id, ids))
      .orderBy(desc(fees.createdAt));
  }

  async getById(id: string) {
    const [existingFee] = await this.buildFeeQuery()
      .where(eq(fees.id, id))
      .limit(1);

    if (!existingFee) return null;

    // Get schedules for this fee
    const feeSchedules = await this.getSchedulesByFeeId(id);

    // Get payments for this fee
    const feePayments = await this.getPaymentsByFeeId(id);

    // Calculate payment statistics
    const totalPaid = Number(existingFee.paidAmount) || 0;
    const totalAmount = Number(existingFee.totalAmount) || 0;
    const discountAmount = Number(existingFee.discountAmount) || 0;
    const netAmount = totalAmount - discountAmount;
    const totalDue = netAmount - totalPaid;
    const paidSchedules = feeSchedules.filter(s => s.status === 'paid').length;

    return {
      ...existingFee,
      schedules: feeSchedules,
      payments: feePayments,
      paymentStats: {
        totalAmount,
        discountAmount,
        netAmount,
        totalPaid,
        totalDue,
        paidSchedules,
        totalSchedules: feeSchedules.length,
        paymentCount: feePayments.length,
      },
    };
  }

  async getByStudent(studentId: string) {
    return await this.buildFeeQuery()
      .where(eq(fees.studentId, studentId))
      .orderBy(desc(fees.academicYear), desc(fees.createdAt));
  }

  async getByStudentAndYear(studentId: string, academicYear: string, feeTypeId: string) {
    const [fee] = await this.buildFeeQuery()
      .where(
        and(
          eq(fees.studentId, studentId),
          eq(fees.academicYear, academicYear),
          eq(fees.feeTypeId, feeTypeId)
        )
      )
      .limit(1);

    return fee;
  }

  async getByFeeType(feeTypeId) {
    return await this.buildFeeQuery()
      .where(eq(fees.feeTypeId, feeTypeId))
      .orderBy(desc(fees.createdAt));
  }

  async getByAcademicYear(academicYear) {
    return await this.buildFeeQuery()
      .where(eq(fees.academicYear, academicYear))
      .orderBy(desc(fees.createdAt));
  }

  async getByStatus(status) {
    return await this.buildFeeQuery()
      .where(eq(fees.status, status))
      .orderBy(desc(fees.createdAt));
  }

  // ========================================
  // GET_READ_METHODS - Payment Schedules
  // ========================================

  async getScheduleById(id: string) {
    const [schedule] = await this.buildScheduleQuery()
      .where(eq(paymentSchedules.id, id))
      .limit(1);

    return schedule;
  }

  async getSchedulesByFeeId(feeId: string) {
    return await this.buildScheduleQuery()
      .where(eq(paymentSchedules.feeId, feeId))
      .orderBy(paymentSchedules.installment);
  }

  async getOverdueSchedules() {
    const today = new Date().toISOString().split('T')[0];

    return await this.buildScheduleQuery()
      .where(
        and(
          eq(paymentSchedules.status, 'pending'),
          sql`${paymentSchedules.dueDate} < ${today}`
        )
      )
      .orderBy(paymentSchedules.dueDate);
  }

  // ========================================
  // GET_READ_METHODS - Payments
  // ========================================

  async getPaymentById(id: string) {
    const [payment] = await this.buildPaymentQuery()
      .where(eq(payments.id, id))
      .limit(1);

    return payment;
  }

  async getPaymentsByFeeId(feeId: string) {
    return await this.buildPaymentQuery()
      .where(eq(payments.feeId, feeId))
      .orderBy(desc(payments.paymentDate));
  }

  async getPaymentsByStudent(studentId: string) {
    return await this.buildPaymentQuery()
      .where(eq(payments.studentId, studentId))
      .orderBy(desc(payments.paymentDate));
  }

  async getAllPayments() {
    return await this.buildPaymentQuery()
      .orderBy(desc(payments.paymentDate));
  }

  async getPaymentsByScheduleId(scheduleId: string) {
    return await this.buildPaymentQuery()
      .where(eq(payments.scheduleId, scheduleId))
      .orderBy(desc(payments.paymentDate));
  }

  async getPaymentsByDateRange(startDate: string, endDate: string) {
    return await this.buildPaymentQuery()
      .where(
        and(
          sql`${payments.paymentDate} >= ${startDate}`,
          sql`${payments.paymentDate} <= ${endDate}`
        )
      )
      .orderBy(desc(payments.paymentDate));
  }

  // ========================================
  // ANALYTICS METHODS
  // ========================================

  async getStudentFeeAnalytics(studentId: string) {
    // Get all fees for student
    const studentFees = await this.getByStudent(studentId);

    let totalExpected = 0;
    let totalDiscount = 0;
    let totalPaid = 0;
    let totalDue = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    for (const fee of studentFees) {
      const feeAmount = Number(fee.totalAmount) || 0;
      const discount = Number(fee.discountAmount) || 0;
      const paid = Number(fee.paidAmount) || 0;
      const netAmount = feeAmount - discount;

      totalExpected += feeAmount;
      totalDiscount += discount;
      totalPaid += paid;
      totalDue += (netAmount - paid);

      if (fee.status === 'paid') paidCount++;
      else if (fee.status === 'pending') pendingCount++;
      else if (fee.status === 'overdue') overdueCount++;
    }

    return {
      totalExpected,
      totalDiscount,
      netAmount: totalExpected - totalDiscount,
      totalPaid,
      totalDue,
      paidCount,
      pendingCount,
      overdueCount,
      partiallyPaidCount: studentFees.filter(f => f.status === 'partially_paid').length,
      feeCount: studentFees.length,
    };
  }

  async getTotalRevenue() {
    const [result] = await this.db
      .select({
        total: sum(payments.amount),
      })
      .from(payments)
      .where(eq(payments.status, 'completed'));

    return Number(result?.total) || 0;
  }

  async getRevenueByDateRange(startDate: string, endDate: string) {
    const [result] = await this.db
      .select({
        total: sum(payments.amount),
      })
      .from(payments)
      .where(
        and(
          eq(payments.status, 'completed'),
          sql`${payments.paymentDate} >= ${startDate}`,
          sql`${payments.paymentDate} <= ${endDate}`
        )
      );

    return Number(result?.total) || 0;
  }

  async getRevenueByAcademicYear(academicYear: string) {
    const [result] = await this.db
      .select({
        total: sum(payments.amount),
      })
      .from(payments)
      .innerJoin(fees, eq(payments.feeId, fees.id))
      .where(
        and(
          eq(payments.status, 'completed'),
          eq(fees.academicYear, academicYear)
        )
      );

    return Number(result?.total) || 0;
  }

  // ========================================
  // CREATE_METHODS
  // ========================================

  async create(data: any) {
    const [newFee] = await this.db
      .insert(fees)
      .values(data)
      .returning();
    return await this.getById(newFee.id);
  }

  async createSchedule(data: any) {
    const [newSchedule] = await this.db
      .insert(paymentSchedules)
      .values(data)
      .returning();
    return await this.getScheduleById(newSchedule.id);
  }

  async createPayment(data: any) {
    const [newPayment] = await this.db
      .insert(payments)
      .values(data)
      .returning();
    return await this.getPaymentById(newPayment.id);
  }

  // ========================================
  // UPDATE_METHODS
  // ========================================

  async update(id: string, data: any) {
    const [updatedFee] = await this.db
      .update(fees)
      .set(data)
      .where(eq(fees.id, id))
      .returning();
    return updatedFee;
  }

  async updateSchedule(id: string, data: any) {
    const [updatedSchedule] = await this.db
      .update(paymentSchedules)
      .set(data)
      .where(eq(paymentSchedules.id, id))
      .returning();
    return updatedSchedule;
  }

  async updatePayment(id: string, data: any) {
    const [updatedPayment] = await this.db
      .update(payments)
      .set(data)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  // ========================================
  // DELETE_METHODS
  // ========================================

  async delete(id: string) {
    const [deletedFee] = await this.db
      .delete(fees)
      .where(eq(fees.id, id))
      .returning();
    return deletedFee;
  }

  async deleteSchedule(id: string) {
    const [deletedSchedule] = await this.db
      .delete(paymentSchedules)
      .where(eq(paymentSchedules.id, id))
      .returning();
    return deletedSchedule;
  }

  async deletePayment(id: string) {
    const [deletedPayment] = await this.db
      .delete(payments)
      .where(eq(payments.id, id))
      .returning();
    return deletedPayment;
  }

  async deleteAll() {
    const deletedFees = await this.db
      .delete(fees)
      .returning();

    return {
      deletedCount: deletedFees.length,
      deletedFees: deletedFees
    };
  }
}
