import { Injectable, t } from 'najm-api';
import { ExpenseRepository } from './ExpenseRepository';
import { parseSchema } from '@/server/shared';
import { expenseSchema, expenseApprovalSchema, expensePaymentSchema } from '@/lib/validations';

@Injectable()
export class ExpenseValidator {
  constructor(
    private expenseRepository: ExpenseRepository,
  ) { }

  // ========== SCHEMA VALIDATION ==========

  async validateCreate(data) {
    return parseSchema(expenseSchema, data);
  }

  async validateUpdate(data) {
    return parseSchema(expenseSchema.partial(), data);
  }

  async validateApproval(data) {
    return parseSchema(expenseApprovalSchema, data);
  }

  async validatePayment(data) {
    return parseSchema(expensePaymentSchema, data);
  }

  // ========== UNIQUENESS CHECKS ==========

  async checkIdIsUnique(id: string) {
    const existingExpense = await this.expenseRepository.getById(id);
    if (existingExpense) {
      throw new Error(t('expenses.errors.idExists'));
    }
  }

  async checkInvoiceNumberIsUnique(invoiceNumber: string, excludeId = null) {
    if (!invoiceNumber) return;
    const existingExpense = await this.expenseRepository.getByInvoiceNumber(invoiceNumber);
    if (existingExpense && existingExpense.id !== excludeId) {
      throw new Error(t('expenses.errors.invoiceNumberExists'));
    }
  }

  async checkReceiptNumberIsUnique(receiptNumber: string, excludeId = null) {
    if (!receiptNumber) return;
    const existingExpense = await this.expenseRepository.getByReceiptNumber(receiptNumber);
    if (existingExpense && existingExpense.id !== excludeId) {
      throw new Error(t('expenses.errors.receiptNumberExists'));
    }
  }

  async checkCheckNumberIsUnique(checkNumber: string, excludeId = null) {
    if (!checkNumber) return;
    const existingExpense = await this.expenseRepository.getByCheckNumber(checkNumber);
    if (existingExpense && existingExpense.id !== excludeId) {
      throw new Error(t('expenses.errors.checkNumberExists'));
    }
  }

  // ========== EXISTENCE CHECKS ==========

  async isExists(id: string) {
    const existingExpense = await this.expenseRepository.getById(id);
    return !!existingExpense;
  }

  async isInvoiceNumberExists(invoiceNumber: string) {
    if (!invoiceNumber) return false;
    const existingExpense = await this.expenseRepository.getByInvoiceNumber(invoiceNumber);
    return !!existingExpense;
  }

  async isReceiptNumberExists(receiptNumber: string) {
    if (!receiptNumber) return false;
    const existingExpense = await this.expenseRepository.getByReceiptNumber(receiptNumber);
    return !!existingExpense;
  }

  async isCheckNumberExists(checkNumber: string) {
    if (!checkNumber) return false;
    const existingExpense = await this.expenseRepository.getByCheckNumber(checkNumber);
    return !!existingExpense;
  }

  async checkExists(id: string) {
    const expenseExists = await this.isExists(id);
    if (!expenseExists) {
      throw new Error(t('expenses.errors.notFound'));
    }
    return true;
  }

  async checkInvoiceNumberExists(invoiceNumber: string) {
    const expense = await this.expenseRepository.getByInvoiceNumber(invoiceNumber);
    if (!expense) {
      throw new Error(t('expenses.errors.notFound'));
    }
    return expense;
  }

  async checkReceiptNumberExists(receiptNumber: string) {
    const expense = await this.expenseRepository.getByReceiptNumber(receiptNumber);
    if (!expense) {
      throw new Error(t('expenses.errors.notFound'));
    }
    return expense;
  }

  async checkCheckNumberExists(checkNumber: string) {
    const expense = await this.expenseRepository.getByCheckNumber(checkNumber);
    if (!expense) {
      throw new Error(t('expenses.errors.notFound'));
    }
    return expense;
  }

  // ========== FIELD VALIDATION ==========

  async validateAmount(amount: number) {
    if (amount <= 0) {
      throw new Error(t('expenses.errors.invalidAmount'));
    }
    if (amount > 10000000) {
      throw new Error(t('expenses.errors.amountTooLarge'));
    }
    return true;
  }

  async validateExpenseDate(expenseDate: string) {
    const date = new Date(expenseDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (date > today) {
      throw new Error(t('expenses.errors.dateFuture'));
    }

    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    if (date < fiveYearsAgo) {
      throw new Error(t('expenses.errors.dateTooOld'));
    }

    return true;
  }

  async validatePaymentDate(paymentDate: string, expenseDate: string) {
    const pDate = new Date(paymentDate);
    const eDate = new Date(expenseDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (pDate > today) {
      throw new Error(t('expenses.errors.paymentDateFuture'));
    }

    if (pDate < eDate) {
      throw new Error(t('expenses.errors.paymentDateBeforeExpense'));
    }

    return true;
  }

  async validateCheckPayment(paymentMethod: string, checkNumber?: string) {
    if (paymentMethod !== 'check') return true;

    if (!checkNumber) {
      throw new Error(t('expenses.errors.checkNumberRequired'));
    }

    return true;
  }

  async validateExpenseStatus(status: string) {
    const validStatuses = ['pending', 'approved', 'rejected', 'paid'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('expenses.errors.invalidStatus'));
    }
    return true;
  }

  async validateExpenseCategory(category: string) {
    const validCategories = [
      'salary', 'utilities', 'maintenance', 'supplies', 'transportation',
      'food', 'equipment', 'rent', 'insurance', 'marketing', 'other'
    ];
    if (!validCategories.includes(category)) {
      throw new Error(t('expenses.errors.invalidCategory'));
    }
    return true;
  }

  async validateRejection(rejectionReason: string) {
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      throw new Error(t('expenses.errors.rejectionReasonRequired'));
    }
    return true;
  }

  // ========== STATUS VALIDATION ==========

  async checkCanApprove(id: string) {
    const expense = await this.expenseRepository.getById(id);
    if (!expense) {
      throw new Error(t('expenses.errors.notFound'));
    }

    if (expense.status !== 'pending') {
      throw new Error(t('expenses.errors.cannotApprove'));
    }

    return true;
  }

  async checkCanPay(id: string) {
    const expense = await this.expenseRepository.getById(id);
    if (!expense) {
      throw new Error(t('expenses.errors.notFound'));
    }

    if (expense.status !== 'approved') {
      throw new Error(t('expenses.errors.cannotPay'));
    }

    return true;
  }

  async checkCanUpdate(id: string) {
    const expense = await this.expenseRepository.getById(id);
    if (!expense) {
      throw new Error(t('expenses.errors.notFound'));
    }

    if (expense.status === 'paid') {
      throw new Error(t('expenses.errors.cannotUpdatePaid'));
    }

    if (expense.status === 'rejected') {
      throw new Error(t('expenses.errors.cannotUpdateRejected'));
    }

    return true;
  }

  async checkCanDelete(id: string) {
    const expense = await this.expenseRepository.getById(id);
    if (!expense) {
      throw new Error(t('expenses.errors.notFound'));
    }

    if (expense.status === 'paid') {
      throw new Error(t('expenses.errors.cannotDeletePaid'));
    }

    return true;
  }

  // ========== MAIN VALIDATION METHOD ==========

  async validate(data, excludeId = null) {
    const isUpdate = excludeId !== null;

    if (isUpdate) {
      await this.checkExists(excludeId);
      await this.checkCanUpdate(excludeId);
    }

    const schema = isUpdate ? expenseSchema.partial() : expenseSchema;
    const validatedData = parseSchema(schema, data);

    const {
      id,
      category,
      amount,
      expenseDate,
      paymentMethod,
      paymentDate,
      invoiceNumber,
      receiptNumber,
      checkNumber,
      status
    } = data;

    // Uniqueness checks for create
    if (!isUpdate) {
      if (id) await this.checkIdIsUnique(id);
    }

    // Field validations
    if (category) await this.validateExpenseCategory(category);
    if (amount) await this.validateAmount(amount);
    if (expenseDate) await this.validateExpenseDate(expenseDate);
    if (status) await this.validateExpenseStatus(status);

    // Uniqueness checks with excludeId for update
    if (invoiceNumber) await this.checkInvoiceNumberIsUnique(invoiceNumber, excludeId);
    if (receiptNumber) await this.checkReceiptNumberIsUnique(receiptNumber, excludeId);
    if (checkNumber) await this.checkCheckNumberIsUnique(checkNumber, excludeId);

    // Payment validations
    if (paymentMethod) {
      await this.validateCheckPayment(paymentMethod, checkNumber);
    }

    if (paymentDate && expenseDate) {
      await this.validatePaymentDate(paymentDate, expenseDate);
    }

    return validatedData;
  }

  // ========================================
// EXPENSE_APPROVAL_VALIDATIONS
// ========================================

async checkRejectionReasonRequired(action: string, rejectionReason?: string | null) {
  if (action === 'reject' && !rejectionReason) {
    throw new Error(t('expenses.errors.rejectionReasonRequired'));
  }
  return true;
}

// ========================================
// EXPENSE_PAYMENT_VALIDATIONS
// ========================================

async checkPaymentDateNotInFuture(paymentDate: Date) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (paymentDate > today) {
    throw new Error(t('expenses.errors.futurePaymentDate'));
  }
  return true;
}

async checkCheckNumberRequired(
  paymentMethod: string,
  checkNumber?: string | null
) {
  if (paymentMethod === 'check' && !checkNumber) {
    throw new Error(t('expenses.errors.checkNumberRequired'));
  }
  return true;
}

async validateExpensePayment(
  paymentMethod: string,
  paymentDate: Date,
  checkNumber?: string | null
) {
  await this.checkPaymentDateNotInFuture(paymentDate);
  await this.checkCheckNumberRequired(paymentMethod, checkNumber);
  return true;
}
}
