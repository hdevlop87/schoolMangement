import { Injectable } from 'najm-api';
import { ExpenseRepository } from './ExpenseRepository';
import { ExpenseValidator } from './ExpenseValidator';
import { formatDate, isEmpty, pickProps } from '@/server/shared';

@Injectable()
export class ExpenseService {

  constructor(
    private expenseRepository: ExpenseRepository,
    private expenseValidator: ExpenseValidator,
  ) { }

  // ========== RETRIEVAL METHODS ==========

  async getAll() {
    return await this.expenseRepository.getAll();
  }

  async getCount() {
    return await this.expenseRepository.getCount();
  }

  async getById(id) {
    await this.expenseValidator.checkExists(id);
    return await this.expenseRepository.getById(id);
  }

  async getByCategory(category) {
    await this.expenseValidator.validateExpenseCategory(category);
    return await this.expenseRepository.getByCategory(category);
  }

  async getByStatus(status) {
    await this.expenseValidator.validateExpenseStatus(status);
    return await this.expenseRepository.getByStatus(status);
  }

  async getByDateRange(startDate, endDate) {
    return await this.expenseRepository.getByDateRange(startDate, endDate);
  }

  async getByVendor(vendor) {
    return await this.expenseRepository.getByVendor(vendor);
  }

  async getByInvoiceNumber(invoiceNumber) {
    await this.expenseValidator.checkInvoiceNumberExists(invoiceNumber);
    return await this.expenseRepository.getByInvoiceNumber(invoiceNumber);
  }

  async getByReceiptNumber(receiptNumber) {
    await this.expenseValidator.checkReceiptNumberExists(receiptNumber);
    return await this.expenseRepository.getByReceiptNumber(receiptNumber);
  }

  async getByCheckNumber(checkNumber) {
    await this.expenseValidator.checkCheckNumberExists(checkNumber);
    return await this.expenseRepository.getByCheckNumber(checkNumber);
  }

  async getPendingApprovals() {
    return await this.expenseRepository.getPendingApprovals();
  }

  // ========== CREATE-METHOD ==========

  async create(data) {

    await this.expenseValidator.validate(data);

    const expenseDetails = {
      id: data.id,
      category: data.category,
      title: data.title,
      amount: data.amount,
      expenseDate: formatDate(data.expenseDate),
      paymentMethod: data.paymentMethod || null,
      paymentDate: data.paymentDate ? formatDate(data.paymentDate) : null,
      vendor: data.vendor || null,
      invoiceNumber: data.invoiceNumber || null,
      receiptNumber: data.receiptNumber || null,
      checkNumber: data.checkNumber || null,
      transactionRef: data.transactionRef || null,
      status: data.status || 'pending',
      notes: data.notes || null,
    };

    return await this.expenseRepository.create(expenseDetails);
  }

  // ========== UPDATE-METHOD ==========

  async update(id, data) {

    const EXPENSE_UPDATE_KEYS = [
      'category', 'title', 'amount', 'expenseDate', 'paymentMethod', 'paymentDate',
      'vendor', 'invoiceNumber', 'receiptNumber', 'checkNumber', 'transactionRef',
      'status', 'notes'
    ];

    await this.expenseValidator.validate(data, id);

    const expenseData = pickProps(data, EXPENSE_UPDATE_KEYS);

    if (expenseData.expenseDate) {
      expenseData.expenseDate = formatDate(expenseData.expenseDate);
    }
    if (expenseData.paymentDate) {
      expenseData.paymentDate = formatDate(expenseData.paymentDate);
    }

    if (!isEmpty(expenseData)) {
      await this.expenseValidator.validateUpdate(expenseData);
      return await this.expenseRepository.update(id, expenseData);
    }

    return await this.getById(id);
  }

  // ========== STATUS-UPDATE-METHOD ==========

  async updateStatus(id, status) {
    await this.expenseValidator.checkExists(id);
    await this.expenseValidator.validateExpenseStatus(status);
    return await this.expenseRepository.update(id, { status });
  }

  // ========== DELETE-METHODS ==========

  async delete(id) {
    await this.expenseValidator.checkCanDelete(id);
    return await this.expenseRepository.delete(id);
  }

  async deleteAll() {
    return await this.expenseRepository.deleteAll();
  }

  // ========== APPROVAL-WORKFLOW ==========

  async approve(id, approvedBy: string) {
    await this.expenseValidator.checkCanApprove(id);
    await this.expenseRepository.approve(id, approvedBy);
    return await this.getById(id);
  }

  async reject(id, approvedBy: string, rejectionReason: string) {
    await this.expenseValidator.checkCanApprove(id);
    await this.expenseValidator.validateRejection(rejectionReason);
    await this.expenseRepository.reject(id, approvedBy, rejectionReason);
    return await this.getById(id);
  }

  async handleApproval(id, data, userId: string) {
    const { action, rejectionReason } = data;

    await this.expenseValidator.validateApproval(data);

    if (action === 'approve') {
      return await this.approve(id, userId);
    } else if (action === 'reject') {
      return await this.reject(id, userId, rejectionReason);
    }
  }

  // ========== PAYMENT WORKFLOW ==========

  async recordPayment(id, data, paidBy: string) {
    await this.expenseValidator.checkCanPay(id);

    const {
      paymentMethod,
      paymentDate,
      checkNumber,
      transactionRef,
      notes,
    } = data;

    await this.expenseValidator.validatePayment(data);

    const expense = await this.expenseRepository.getById(id);
    await this.expenseValidator.validatePaymentDate(paymentDate, expense.expenseDate);

    await this.expenseValidator.validateCheckPayment(paymentMethod, checkNumber);

    // Update expense with payment details
    await this.expenseRepository.update(id, {
      paymentMethod,
      checkNumber: paymentMethod === 'check' ? checkNumber : null,
      transactionRef: transactionRef || null,
      notes: notes || null,
    });

    // Mark as paid
    await this.expenseRepository.markAsPaid(id, paidBy, formatDate(paymentDate));

    return await this.getById(id);
  }

  // ========== ANALYTICS METHODS ==========

  async getTotalExpensesByCategory() {
    return await this.expenseRepository.getTotalExpensesByCategory();
  }

  async getTotalExpensesByStatus() {
    return await this.expenseRepository.getTotalExpensesByStatus();
  }

  async getTotalExpensesByDateRange(startDate: string, endDate: string) {
    return await this.expenseRepository.getTotalExpensesByDateRange(startDate, endDate);
  }

  async getMonthlyExpenses(year: number) {
    return await this.expenseRepository.getMonthlyExpenses(year);
  }

  async getTopVendors(limit: number = 10) {
    return await this.expenseRepository.getTopVendors(limit);
  }

  async getTotalExpensesAllTimes() {
    const totalPaid = await this.expenseRepository.getTotalPaidExpenses();
    const totalPending = await this.expenseRepository.getTotalPendingExpenses();

    return {
      totalPaid,
      totalPending,
      total: totalPaid + totalPending,
    };
  }

  async getTotalExpenses() {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;
    const result = await this.expenseRepository.getTotalExpensesByDateRange(startDate, endDate);
    return result.total;
  }

  // ========== SEED METHOD ==========

  async seedDemoExpenses(expensesData) {
    const createdExpenses = [];

    for (const expenseData of expensesData) {
      try {
        const expense = await this.create(expenseData);
        createdExpenses.push(expense);
      } catch (error) {
        continue;
      }
    }
    return createdExpenses;
  }
}
