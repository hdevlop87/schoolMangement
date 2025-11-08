import { Controller, Get, Post, Put, Delete, Params, Body, t, Filter, User } from 'najm-api';
import { ExpenseService } from './ExpenseService';
import { isFinancial } from '../roles';

@Controller('/expenses')
export class ExpenseController {
  constructor(
    private expenseService: ExpenseService,
  ) { }

  // ========================= GET ENDPOINTS =========================//

  @Get()
  @isFinancial()
  async getExpenses() {
    const expenses = await this.expenseService.getAll();
    return {
      data: expenses,
      message: t('expenses.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/pending')
  @isFinancial()
  async getPendingApprovals() {
    const expenses = await this.expenseService.getPendingApprovals();
    return {
      data: expenses,
      message: t('expenses.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/category/:category')
  @isFinancial()
  async getByCategory(@Params('category') category) {
    const expenses = await this.expenseService.getByCategory(category);
    return {
      data: expenses,
      message: t('expenses.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status/:status')
  @isFinancial()
  async getByStatus(@Params('status') status) {
    const expenses = await this.expenseService.getByStatus(status);
    return {
      data: expenses,
      message: t('expenses.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/vendor/:vendor')
  @isFinancial()
  async getByVendor(@Params('vendor') vendor) {
    const expenses = await this.expenseService.getByVendor(vendor);
    return {
      data: expenses,
      message: t('expenses.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/date-range/:startDate/:endDate')
  @isFinancial()
  async getByDateRange(@Params('startDate') startDate, @Params('endDate') endDate) {
    const expenses = await this.expenseService.getByDateRange(startDate, endDate);
    return {
      data: expenses,
      message: t('expenses.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @isFinancial()
  async getExpense(@Params('id') id) {
    const expense = await this.expenseService.getById(id);
    return {
      data: expense,
      message: t('expenses.success.retrieved'),
      status: 'success'
    };
  }

  // ========================= ANALYTICS ENDPOINTS ==========================//

  @Get('/analytics/by-category')
  @isFinancial()
  async getTotalByCategory() {
    const analytics = await this.expenseService.getTotalExpensesByCategory();
    return {
      data: analytics,
      message: t('expenses.success.analyticsRetrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/by-status')
  @isFinancial()
  async getTotalByStatus() {
    const analytics = await this.expenseService.getTotalExpensesByStatus();
    return {
      data: analytics,
      message: t('expenses.success.analyticsRetrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/monthly/:year')
  @isFinancial()
  async getMonthlyExpenses(@Params('year') year) {
    const analytics = await this.expenseService.getMonthlyExpenses(Number(year));
    return {
      data: analytics,
      message: t('expenses.success.analyticsRetrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/top-vendors')
  @isFinancial()
  async getTopVendors() {
    const vendors = await this.expenseService.getTopVendors(10);
    return {
      data: vendors,
      message: t('expenses.success.analyticsRetrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/totals')
  @isFinancial()
  async getTotalExpenses() {
    const totals = await this.expenseService.getTotalExpenses();
    return {
      data: totals,
      message: t('expenses.success.analyticsRetrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/date-range/:startDate/:endDate')
  @isFinancial()
  async getTotalByDateRange(@Params('startDate') startDate, @Params('endDate') endDate) {
    const analytics = await this.expenseService.getTotalExpensesByDateRange(startDate, endDate);
    return {
      data: analytics,
      message: t('expenses.success.analyticsRetrieved'),
      status: 'success'
    };
  }

  // ========================= POST ENDPOINTS ==========================//

  @Post()
  @isFinancial()
  async create(@Body() body) {
    const newExpense = await this.expenseService.create(body);
    return {
      data: newExpense,
      message: t('expenses.success.created'),
      status: 'success'
    };
  }

  @Post('/:id/approve')
  @isFinancial()
  async handleApproval(@Params('id') id, @Body() body, @User() user) {
    const expense = await this.expenseService.handleApproval(id, body, user.id);
    return {
      data: expense,
      message: body.action === 'approve'
        ? t('expenses.success.approved')
        : t('expenses.success.rejected'),
      status: 'success'
    };
  }

  @Post('/:id/payment')
  @isFinancial()
  async recordPayment(@Params('id') id, @Body() body, @User() user) {
    const expense = await this.expenseService.recordPayment(id, body, user.id);
    return {
      data: expense,
      message: t('expenses.success.paymentRecorded'),
      status: 'success'
    };
  }

  // ========================== PUT ENDPOINTS ===========================//

  @Put('/:id')
  @isFinancial()
  async update(@Params('id') id, @Body() body) {
    const updatedExpense = await this.expenseService.update(id, body);
    return {
      data: updatedExpense,
      message: t('expenses.success.updated'),
      status: 'success'
    };
  }

  // ========================= DELETE ENDPOINTS ==========================//

  @Delete('/:id')
  @isFinancial()
  async delete(@Params('id') id) {
    const result = await this.expenseService.delete(id);
    return {
      data: result,
      message: t('expenses.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isFinancial()
  async deleteAll() {
    const result = await this.expenseService.deleteAll();
    return {
      data: result,
      message: t('expenses.success.allDeleted'),
      status: 'success'
    };
  }
}
