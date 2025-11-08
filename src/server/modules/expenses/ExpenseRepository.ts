import { Repository } from 'najm-api';
import { eq, desc, and, count, sum, sql, inArray, gte, lte, between } from 'drizzle-orm';
import { expenses, users } from '@/server/database/schema';
import { DB } from '@/server/database/db';
import { alias } from 'drizzle-orm/pg-core';
import { expenseSelect } from '@/server/shared/selectDefinitions';

@Repository()
export class ExpenseRepository {
  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildExpenseQuery() {
    const approverUsers = alias(users, 'approver_users');
    const payerUsers = alias(users, 'payer_users');

    return this.db
      .select({
        ...expenseSelect,
        approver: {
          id: approverUsers.id,
          email: approverUsers.email,
          image: approverUsers.image,
        },
        payer: {
          id: payerUsers.id,
          email: payerUsers.email,
          image: payerUsers.image,
        },
      })
      .from(expenses)
      .leftJoin(approverUsers, eq(expenses.approvedBy, approverUsers.id))
      .leftJoin(payerUsers, eq(expenses.paidBy, payerUsers.id));
  }

  // ========================================
  // GET_READ_METHODS
  // ========================================

  async getCount() {
    const [expenseCount] = await this.db
      .select({ count: count() })
      .from(expenses);
    return expenseCount;
  }

  async getAll() {
    return await this.getAllExpenses();
  }

  async getAllExpenses() {
    return await this.buildExpenseQuery()
      .orderBy(desc(expenses.expenseDate), desc(expenses.createdAt));
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildExpenseQuery()
      .where(inArray(expenses.id, ids))
      .orderBy(desc(expenses.expenseDate), desc(expenses.createdAt));
  }

  async getById(id: string) {
    const [expense] = await this.buildExpenseQuery()
      .where(eq(expenses.id, id))
      .limit(1);

    return expense;
  }

  async getByCategory(category) {
    return await this.buildExpenseQuery()
      .where(eq(expenses.category, category))
      .orderBy(desc(expenses.expenseDate));
  }

  async getByStatus(status) {
    return await this.buildExpenseQuery()
      .where(eq(expenses.status, status))
      .orderBy(desc(expenses.createdAt));
  }

  async getByDateRange(startDate: string, endDate: string) {
    return await this.buildExpenseQuery()
      .where(
        between(expenses.expenseDate, startDate, endDate)
      )
      .orderBy(desc(expenses.expenseDate));
  }

  async getByVendor(vendor: string) {
    return await this.buildExpenseQuery()
      .where(eq(expenses.vendor, vendor))
      .orderBy(desc(expenses.expenseDate));
  }

  async getByInvoiceNumber(invoiceNumber: string) {
    const [expense] = await this.buildExpenseQuery()
      .where(eq(expenses.invoiceNumber, invoiceNumber))
      .limit(1);
    return expense;
  }

  async getByReceiptNumber(receiptNumber: string) {
    const [expense] = await this.buildExpenseQuery()
      .where(eq(expenses.receiptNumber, receiptNumber))
      .limit(1);
    return expense;
  }

  async getByCheckNumber(checkNumber: string) {
    const [expense] = await this.buildExpenseQuery()
      .where(eq(expenses.checkNumber, checkNumber))
      .limit(1);
    return expense;
  }

  async getPendingApprovals() {
    return await this.buildExpenseQuery()
      .where(eq(expenses.status, 'pending'))
      .orderBy(expenses.createdAt);
  }

  // ========================================
  // ANALYTICS METHODS
  // ========================================

  async getTotalExpensesByCategory() {
    const result = await this.db
      .select({
        category: expenses.category,
        total: sum(expenses.amount),
        count: count(),
      })
      .from(expenses)
      .where(eq(expenses.status, 'paid'))
      .groupBy(expenses.category);

    return result.map(r => ({
      category: r.category,
      total: Number(r.total || 0),
      count: r.count,
    }));
  }

  async getTotalExpensesByStatus() {
    const result = await this.db
      .select({
        status: expenses.status,
        total: sum(expenses.amount),
        count: count(),
      })
      .from(expenses)
      .groupBy(expenses.status);

    return result.map(r => ({
      status: r.status,
      total: Number(r.total || 0),
      count: r.count,
    }));
  }

  async getTotalExpensesByDateRange(startDate: string, endDate: string) {
    const [result] = await this.db
      .select({
        total: sum(expenses.amount),
        count: count(),
      })
      .from(expenses)
      .where(
        and(
          gte(expenses.expenseDate, startDate),
          lte(expenses.expenseDate, endDate),
          eq(expenses.status, 'paid')
        )
      );

    return {
      total: Number(result?.total || 0),
      count: result?.count || 0,
    };
  }

  async getMonthlyExpenses(year: number) {
    const result = await this.db
      .select({
        month: sql<number>`EXTRACT(MONTH FROM ${expenses.expenseDate})`,
        total: sum(expenses.amount),
        count: count(),
      })
      .from(expenses)
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${expenses.expenseDate}) = ${year}`,
          eq(expenses.status, 'paid')
        )
      )
      .groupBy(sql`EXTRACT(MONTH FROM ${expenses.expenseDate})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${expenses.expenseDate})`);

    return result.map(r => ({
      month: r.month,
      total: Number(r.total || 0),
      count: r.count,
    }));
  }

  async getTopVendors(limit: number = 10) {
    const result = await this.db
      .select({
        vendor: expenses.vendor,
        total: sum(expenses.amount),
        count: count(),
      })
      .from(expenses)
      .where(
        and(
          sql`${expenses.vendor} IS NOT NULL`,
          eq(expenses.status, 'paid')
        )
      )
      .groupBy(expenses.vendor)
      .orderBy(desc(sum(expenses.amount)))
      .limit(limit);

    return result.map(r => ({
      vendor: r.vendor,
      total: Number(r.total || 0),
      count: r.count,
    }));
  }

  async getTotalPaidExpenses() {
    const [result] = await this.db
      .select({
        total: sum(expenses.amount),
      })
      .from(expenses)
      .where(eq(expenses.status, 'paid'));

    return Number(result?.total || 0);
  }

  async getTotalPendingExpenses() {
    const [result] = await this.db
      .select({
        total: sum(expenses.amount),
      })
      .from(expenses)
      .where(inArray(expenses.status, ['pending', 'approved']));

    return Number(result?.total || 0);
  }

  // ========================================
  // CREATE_METHODS
  // ========================================

  async create(data) {
    const [newExpense] = await this.db
      .insert(expenses)
      .values(data)
      .returning();
    return await this.getById(newExpense.id);
  }

  // ========================================
  // UPDATE_METHODS
  // ========================================

  async update(id, data) {
    const [updatedExpense] = await this.db
      .update(expenses)
      .set(data)
      .where(eq(expenses.id, id))
      .returning();
    return updatedExpense;
  }

  async approve(id: string, approvedBy: string) {
    const [updatedExpense] = await this.db
      .update(expenses)
      .set({
        status: 'approved',
        approvedBy,
        approvedAt: sql`CURRENT_TIMESTAMP`,
        rejectionReason: null,
      })
      .where(eq(expenses.id, id))
      .returning();
    return updatedExpense;
  }

  async reject(id: string, approvedBy: string, rejectionReason: string) {
    const [updatedExpense] = await this.db
      .update(expenses)
      .set({
        status: 'rejected',
        approvedBy,
        approvedAt: sql`CURRENT_TIMESTAMP`,
        rejectionReason,
      })
      .where(eq(expenses.id, id))
      .returning();
    return updatedExpense;
  }

  async markAsPaid(id: string, paidBy: string, paymentDate: string) {
    const [updatedExpense] = await this.db
      .update(expenses)
      .set({
        status: 'paid',
        paidBy,
        paymentDate,
      })
      .where(eq(expenses.id, id))
      .returning();
    return updatedExpense;
  }

  // ========================================
  // DELETE_METHODS
  // ========================================

  async delete(id) {
    const [deletedExpense] = await this.db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning();
    return deletedExpense;
  }

  async deleteAll() {
    const deletedExpenses = await this.db
      .delete(expenses)
      .returning();

    return {
      deletedCount: deletedExpenses.length,
      deletedExpenses: deletedExpenses
    };
  }
}
