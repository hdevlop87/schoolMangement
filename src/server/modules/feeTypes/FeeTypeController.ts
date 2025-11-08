import { Controller, Get, Post, Put, Delete, Params, Body, t } from 'najm-api';
import { FeeTypeService } from './FeeTypeService';
import { isFinancial } from '../roles';

@Controller('/fee-types')
export class FeeTypeController {
  constructor(
    private feeTypeService: FeeTypeService,
  ) { }

  // ========================= GET ENDPOINTS =========================//

  @Get()
  @isFinancial()
  async getAll() {
    const feeTypes = await this.feeTypeService.getAll();
    return {
      data: feeTypes,
      message: t('feeTypes.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @isFinancial()
  async getById(@Params('id') id: string) {
    const feeType = await this.feeTypeService.getById(id);
    return {
      data: feeType,
      message: t('feeTypes.success.retrieved'),
      status: 'success'
    };
  }

  // ========================= POST ENDPOINTS ==========================//

  @Post()
  @isFinancial()
  async create(@Body() body: any) {
    const newFeeType = await this.feeTypeService.create(body);
    return {
      data: newFeeType,
      message: t('feeTypes.success.created'),
      status: 'success'
    };
  }

  // ========================== PUT ENDPOINTS ===========================//

  @Put('/:id')
  @isFinancial()
  async update(@Params('id') id: string, @Body() body: any) {
    const updatedFeeType = await this.feeTypeService.update(id, body);
    return {
      data: updatedFeeType,
      message: t('feeTypes.success.updated'),
      status: 'success'
    };
  }

  // ========================= DELETE_ENDPOINTS ==========================//

  @Delete('/:id')
  @isFinancial()
  async delete(@Params('id') id: string) {
    await this.feeTypeService.delete(id);
    return {
      data: null,
      message: t('feeTypes.success.deleted'),
      status: 'success'
    };
  }
}