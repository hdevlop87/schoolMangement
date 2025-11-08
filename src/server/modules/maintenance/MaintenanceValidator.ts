import { Injectable, t } from 'najm-api';
import { MaintenanceRepository } from './MaintenanceRepository';
import { VehicleRepository } from '@/server/modules/vehicles/VehicleRepository';
import { createMaintenanceSchema } from '@/server/database/schema';
import { parseSchema } from '@/server/shared/utils';

@Injectable()
export class MaintenanceValidator {
  constructor(
    private maintenanceRepository: MaintenanceRepository,
    private vehicleRepository: VehicleRepository,
  ) { }

  async validateCreateMaintenance(data) {
    return parseSchema(createMaintenanceSchema, data);
  }

  async checkMaintenanceExists(id: string) {
    const maintenance = await this.maintenanceRepository.getById(id);
    if (!maintenance) {
      throw new Error(t('maintenance.errors.notFound'));
    }
    return maintenance;
  }

  async checkVehicleExists(vehicleId: string) {
    const vehicle = await this.vehicleRepository.getById(vehicleId);
    if (!vehicle) {
      throw new Error(t('vehicles.errors.notFound'));
    }
    return vehicle;
  }

  validateMaintenanceType(type: string) {
    const validTypes = ['scheduled', 'repair', 'inspection', 'oil_change', 'filter_change', 'other'];
    if (!validTypes.includes(type)) {
      throw new Error(t('maintenance.errors.invalidType'));
    }
    return true;
  }

  validateMaintenanceStatus(status: string) {
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled', 'overdue'];
    if (!validStatuses.includes(status)) {
      throw new Error(t('maintenance.errors.invalidStatus'));
    }
    return true;
  }

  validateMaintenancePriority(priority: string) {
    const validPriorities = ['low', 'normal', 'high', 'critical'];
    if (!validPriorities.includes(priority)) {
      throw new Error(t('maintenance.errors.invalidPriority'));
    }
    return true;
  }

  validateScheduledDate(scheduledDate: string) {
    if (!scheduledDate) return true;

    // Check if it's a valid date string
    const date = new Date(scheduledDate);
    if (isNaN(date.getTime())) {
      throw new Error(t('common.invalidDate'));
    }

    // Check if the date is not in the past (allow today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const scheduledDateObj = new Date(scheduledDate);
    scheduledDateObj.setHours(0, 0, 0, 0);

    if (scheduledDateObj < today) {
      throw new Error(t('maintenance.errors.scheduledDateInPast'));
    }

    return true;
  }

  validateDueHours(dueHours: string | number) {
    if (!dueHours) return true;

    const numericHours = parseFloat(dueHours.toString());
    if (isNaN(numericHours) || numericHours < 0) {
      throw new Error(t('maintenance.errors.invalidDueHours'));
    }
    return true;
  }

  validateCost(cost: string | number) {
    if (!cost) return true;

    const numericCost = parseFloat(cost.toString());
    if (isNaN(numericCost) || numericCost < 0) {
      throw new Error(t('maintenance.errors.invalidCost'));
    }
    return true;
  }

  async validateDueHoursAgainstVehicle(vehicleId: string, dueHours: string | number) {
    if (!dueHours) return true;

    const vehicle = await this.checkVehicleExists(vehicleId);
    const numericDueHours = parseFloat(dueHours.toString());
    const currentHours = parseFloat(vehicle.currentHours?.toString() || '0');

    if (numericDueHours <= currentHours) {
      throw new Error(t('maintenance.errors.dueHoursPastCurrent'));
    }
    return true;
  }

  async checkMaintenanceCanBeModified(id: string) {
    const maintenance = await this.checkMaintenanceExists(id);
    
    if (maintenance.status === 'completed') {
      throw new Error(t('maintenance.errors.cannotModifyCompleted'));
    }
    
    return maintenance;
  }

  async checkMaintenanceCanBeDeleted(id: string) {
    const maintenance = await this.checkMaintenanceExists(id);
    
    if (maintenance.status === 'in_progress') {
      throw new Error(t('maintenance.errors.cannotDeleteInProgress'));
    }
    
    return maintenance;
  }

  async checkMaintenanceCanBeCompleted(id: string) {
    const maintenance = await this.checkMaintenanceExists(id);
    
    if (maintenance.status === 'completed') {
      throw new Error(t('maintenance.errors.alreadyCompleted'));
    }
    
    if (maintenance.status === 'cancelled') {
      throw new Error(t('maintenance.errors.cannotCompleteCancelled'));
    }
    
    return maintenance;
  }

  async checkNoDuplicateMaintenance(vehicleId: string, type: string, dueHours: string | number, excludeId?: string) {
    const existingMaintenances = await this.maintenanceRepository.getByVehicleId(vehicleId);
    
    const duplicate = existingMaintenances.find(m => 
      m.type === type && 
      m.dueHours === dueHours?.toString() && 
      m.status !== 'completed' && 
      m.status !== 'cancelled' &&
      m.id !== excludeId
    );

    if (duplicate) {
      throw new Error(t('maintenance.errors.duplicateMaintenanceExists'));
    }
    
    return true;
  }


}