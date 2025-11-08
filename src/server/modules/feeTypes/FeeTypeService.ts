import { Injectable } from 'najm-api';
import { FeeTypeRepository } from './FeeTypeRepository';
import { FeeTypeValidator } from './FeeTypeValidator';
import { pickProps, isEmpty } from '@/server/shared';

@Injectable()
export class FeeTypeService {

  constructor(
    private feeTypeRepository: FeeTypeRepository,
    private feeTypeValidator: FeeTypeValidator,
  ) { }

  // ========== RETRIEVAL METHODS ==========

  async getAll() {
    return await this.feeTypeRepository.getAll();
  }

  async getCount() {
    return await this.feeTypeRepository.getCount();
  }

  async getById(id) {
    await this.feeTypeValidator.checkExists(id);
    return await this.feeTypeRepository.getById(id);
  }

  async getByName(name) {
    await this.feeTypeValidator.checkNameExists(name);
    return await this.feeTypeRepository.getByName(name);
  }

  async getByStatus(status) {
    await this.feeTypeValidator.validateFeeTypeStatus(status);
    return await this.feeTypeRepository.getByStatus(status);
  }

  async getByCategory(category) {
    return await this.feeTypeRepository.getByCategory(category);
  }

  // ========== CREATE-METHOD ==========

  async create(data) {

    await this.feeTypeValidator.validate(data);

    const feeTypeDetails = {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      amount: data.amount,
      paymentType: data.paymentType,
      status: data.status,
    };

    return await this.feeTypeRepository.create(feeTypeDetails);
  }

  // ========== UPDATE-METHOD ==========

  async update(id, data) {

    const FEETYPE_UPDATE_KEYS = [
      'name', 'description', 'category', 'amount', 'paymentType', 'status'
    ];

    await this.feeTypeValidator.validate(data, id);

    const feeTypeData = pickProps(data, FEETYPE_UPDATE_KEYS);

    if (isEmpty(feeTypeData)) {
      return await this.getById(id);
    }

    await this.feeTypeValidator.validateUpdate(feeTypeData);
    return await this.feeTypeRepository.update(id, feeTypeData);
  }

  // ========== STATUS-UPDATE-METHOD ==========

  async updateStatus(id, status) {
    await this.feeTypeValidator.checkExists(id);
    await this.feeTypeValidator.validateFeeTypeStatus(status);
    return await this.feeTypeRepository.update(id, { status });
  }

  // ========== DELETE-METHODS ==========

  async delete(id: string) {
    await this.feeTypeValidator.checkExists(id);
    return await this.feeTypeRepository.delete(id);
  }

  async deleteAll() {
    return await this.feeTypeRepository.deleteAll();
  }

  // ========== SEED METHOD ==========

  async seedDemoFeeTypes(feeTypesData: any[]) {
    const createdFeeTypes = [];
    for (const feeTypeData of feeTypesData) {
      try {
        const feeType = await this.create(feeTypeData);
        createdFeeTypes.push(feeType);
      } catch (error) {
        continue;
      }
    }
    return createdFeeTypes;
  }

}