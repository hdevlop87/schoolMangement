import { Controller, Get, Post, Put, Delete, Params, Body, t, User } from 'najm-api';
import { FeeService } from './FeeService';
import { isFinancial, isAdmin } from '../roles';

@Controller('/fees')
export class FeeController {
  constructor(
    private feeService: FeeService,
  ) { }

  // ========================= FEE ENDPOINTS =========================//

  @Get()
  @isFinancial()
  async getFees() {
    const fees = await this.feeService.getAll();
    return {
      data: fees,
      message: t('fees.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/student/:studentId')
  @isFinancial()
  async getByStudent(@Params('studentId') studentId) {
    const fees = await this.feeService.getByStudent(studentId);
    return {
      data: fees,
      message: t('fees.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/payments/student/:studentId')
  @isFinancial()
  async getPaymentsByStudent(@Params('studentId') studentId) {
    const payments = await this.feeService.getPaymentsByStudent(studentId);
    return {
      data: payments,
      message: t('fees.success.paymentsRetrieved'),
      status: 'success'
    };
  }

  @Get('/payments')
  @isFinancial()
  async getAllPayments() {
    const payments = await this.feeService.getAllPayments();
    return {
      data: payments,
      message: t('fees.success.paymentsRetrieved'),
      status: 'success'
    };
  }

  @Get('/payments/fee/:feeId')
  @isFinancial()
  async getPaymentsByFee(@Params('feeId') feeId) {
    const payments = await this.feeService.getPaymentsByFee(feeId);
    return {
      data: payments,
      message: t('fees.success.paymentsRetrieved'),
      status: 'success'
    };
  }

  @Get('/schedules/fee/:feeId')
  @isFinancial()
  async getSchedulesByFee(@Params('feeId') feeId) {
    const schedules = await this.feeService.getSchedulesByFee(feeId);
    return {
      data: schedules,
      message: t('fees.success.schedulesRetrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @isFinancial()
  async getFee(@Params('id') id) {
    const fee = await this.feeService.getById(id);
    return {
      data: fee,
      message: t('fees.success.retrieved'),
      status: 'success'
    };
  }

  // ========================= POST ENDPOINTS ==========================//

  @Post()
  @isFinancial()
  async create(@Body() body, @User() user) {
    const newFee = await this.feeService.create(body, user.id);
    return {
      data: newFee,
      message: t('fees.success.created'),
      status: 'success'
    };
  }

  @Post('/bulk')
  @isFinancial()
  async createBulk(@Body() body, @User() user) {
    const newFees = await this.feeService.createBulk(body, user.id);
    return {
      data: newFees,
      message: t('fees.success.bulkCreated'),
      status: 'success'
    };
  }

  @Post('/payments')
  @isFinancial()
  async recordPayment(@Body() body, @User() user) {
    const payment = await this.feeService.recordPayment(body, user.id);
    return {
      data: payment,
      message: t('fees.success.paymentRecorded'),
      status: 'success'
    };
  }

  // ========================== PUT ENDPOINTS ===========================//

  @Put('/:id')
  @isFinancial()
  async update(@Params('id') id, @Body() body) {
    const updatedFee = await this.feeService.update(id, body);
    return {
      data: updatedFee,
      message: t('fees.success.updated'),
      status: 'success'
    };
  }

  @Put('/payments/:id')
  @isFinancial()
  async updatePayment(@Params('id') id, @Body() body) {
    const payment = await this.feeService.updatePayment(id, body);
    return {
      data: payment,
      message: t('fees.success.paymentUpdated'),
      status: 'success'
    };
  }

  // ========================= DELETE-ENDPOINTS ==========================//

  @Delete('/:id')
  @isFinancial()
  async delete(@Params('id') id) {
    const result = await this.feeService.delete(id);
    return {
      data: result,
      message: t('fees.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAll() {
    const result = await this.feeService.deleteAll();
    return {
      data: result,
      message: t('fees.success.allDeleted'),
      status: 'success'
    };
  }

  @Delete('/payments/:id')
  @isFinancial()
  async deletePayment(@Params('id') id) {
    const result = await this.feeService.deletePayment(id);
    return {
      data: result,
      message: t('fees.success.paymentDeleted'),
      status: 'success'
    };
  }
}