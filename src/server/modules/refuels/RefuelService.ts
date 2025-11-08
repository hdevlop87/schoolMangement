import { Injectable } from 'najm-api';
import { RefuelRepository } from './RefuelRepository';
import { RefuelValidator } from './RefuelValidator';

@Injectable()
export class RefuelService {
  constructor(
    private refuelRepository: RefuelRepository,
    private refuelValidator: RefuelValidator
  ) { }

  async getAll() {
    return await this.refuelRepository.getAll();
  }

  async getCount() {
    return await this.refuelRepository.getCount();
  }

  async getById(id) {
    await this.refuelValidator.checkExists(id);
    return await this.refuelRepository.getById(id);
  }

  async getByVehicleId(vehicleId) {
    return await this.refuelRepository.getByVehicleId(vehicleId);
  }

  async getByDriverId(driverId) {
    return await this.refuelRepository.getByDriverId(driverId);
  }

  async getByVoucherNumber(voucherNumber) {
    await this.refuelValidator.checkVoucherNumberExists(voucherNumber);
    return await this.refuelRepository.getByVoucherNumber(voucherNumber);
  }

  async getByDate(date) {
    await this.refuelValidator.validateDate(date);
    return await this.refuelRepository.getByDate(date);
  }

  async getRecentRecords(limit = 20) {
    return await this.refuelRepository.getRecentRecords(limit);
  }

  async getTodayRecords() {
    const today = new Date().toISOString().split('T')[0];
    return await this.refuelRepository.getByDate(today);
  }

  async create(data) {
    const validatedData = await this.refuelValidator.validateCreate(data);

    if (validatedData.voucherNumber) {
      await this.refuelValidator.checkVoucherNumberIsUnique(validatedData.voucherNumber);
    }

    const calculatedTotalCost = validatedData.totalCost ||
      (validatedData.costPerLiter
        ? (parseFloat(validatedData.costPerLiter) * parseFloat(validatedData.liters)).toFixed(2)
        : null);

    const refuelData = {
      ...validatedData,
      totalCost: calculatedTotalCost,
      fuelLevelAfter: validatedData.fuelLevelAfter || '100',
    };

    return await this.refuelRepository.create(refuelData);
  }

  async update(id, data) {
    const validatedData = await this.refuelValidator.validateUpdate(data);
    await this.refuelValidator.checkExists(id);

    if (validatedData.voucherNumber) {
      await this.refuelValidator.checkVoucherNumberIsUnique(validatedData.voucherNumber, id);
    }

    if (validatedData.liters || validatedData.costPerLiter) {
      const currentRecord = await this.refuelRepository.getById(id);
      const liters = validatedData.liters || currentRecord.liters;
      const costPerLiter = validatedData.costPerLiter || currentRecord.costPerLiter;

      if (liters && costPerLiter && !validatedData.totalCost) {
        validatedData.totalCost = (parseFloat(costPerLiter) * parseFloat(liters)).toFixed(2);
      }
    }

    return await this.refuelRepository.update(id, validatedData);
  }

  async delete(id) {
    await this.refuelValidator.checkExists(id);
    return await this.refuelRepository.delete(id);
  }

  async deleteAll() {
    return await this.refuelRepository.deleteAll();
  }

  async seedDemoRefuels(refuelsData) {
    const createdRefuels = [];

    for (const refuelData of refuelsData) {
      try {
        const refuel = await this.create(refuelData);
        createdRefuels.push(refuel);
      } catch (error) {
        continue;
      }
    }

    return createdRefuels;
  }

  // ========== ANALYTICS METHODS ==========//

  async getFuelConsumptionAnalytics() {
    return await this.refuelRepository.getFuelConsumptionAnalytics();
  }

  async getFuelEfficiencyReport() {
    return await this.refuelRepository.getFuelEfficiencyReport();
  }

  async getFuelCostAnalysis() {
    return await this.refuelRepository.getFuelCostAnalysis();
  }

  async getFuelSummary() {
    return await this.refuelRepository.getFuelSummary();
  }

  async getVehicleFuelEfficiency(vehicleId) {
    return await this.refuelRepository.getVehicleFuelEfficiency(vehicleId);
  }

  async getVehicleFuelCosts(vehicleId) {
    return await this.refuelRepository.getVehicleFuelCosts(vehicleId);
  }

  async getMonthlyFuelTrends() {
    return await this.refuelRepository.getMonthlyFuelTrends();
  }

  async calculateFuelEfficiency(vehicleId, startDate, endDate) {
    await this.refuelValidator.validateDateRange(startDate, endDate);
    return await this.refuelRepository.calculateFuelEfficiency(vehicleId, startDate, endDate);
  }

  async predictFuelNeeds(vehicleId, days = 30) {
    if (days < 1 || days > 365) {
      throw new Error('Prediction period must be between 1 and 365 days');
    }
    return await this.refuelRepository.predictFuelNeeds(vehicleId, days);
  }

  async generateFuelReport(startDate, endDate) {
    await this.refuelValidator.validateDateRange(startDate, endDate);

    const [
      consumption,
      costs,
      efficiency,
      trends
    ] = await Promise.all([
      this.refuelRepository.getFuelConsumptionByPeriod(startDate, endDate),
      this.refuelRepository.getFuelCostsByPeriod(startDate, endDate),
      this.refuelRepository.getFuelEfficiencyByPeriod(startDate, endDate),
      this.refuelRepository.getFuelTrendsByPeriod(startDate, endDate)
    ]);

    return {
      period: { startDate, endDate },
      consumption,
      costs,
      efficiency,
      trends,
      generatedAt: new Date().toISOString()
    };
  }

  async getDriverRefuelStats(driverId) {
    return await this.refuelRepository.getDriverRefuelStats(driverId);
  }
}
