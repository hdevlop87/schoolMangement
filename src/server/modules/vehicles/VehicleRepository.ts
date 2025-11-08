import { DB } from '@/server/database/db';
import { vehicles, refuels, alerts, maintenance, users, drivers } from '@/server/database/schema';
import { count, eq, desc, sql, and, gte, sum } from 'drizzle-orm';
import { Repository } from 'najm-api';

@Repository()
export class VehicleRepository {

  declare db: DB;

  private getRefuel() {
    return {
      id: refuels.id,
      vehicleId: refuels.vehicleId,
      datetime: refuels.datetime,
      voucherNumber: refuels.voucherNumber,
      liters: refuels.liters,
      costPerLiter: refuels.costPerLiter,
      totalCost: refuels.totalCost,
      mileageAtRefuel: refuels.mileageAtRefuel,
      fuelLevelAfter: refuels.fuelLevelAfter,
      attendant: refuels.attendant,
      notes: refuels.notes,
      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        type: vehicles.type,
        status: vehicles.status,
      },
      driver: {
        id: drivers.id,
        name: drivers.name,
        image: users.image,
      }
    };
  }

  private getMaintenance() {
    return {
      id: maintenance.id,
      vehicleId: maintenance.vehicleId,
      type: maintenance.type,
      title: maintenance.title,
      scheduledDate: maintenance.scheduledDate,
      status: maintenance.status,
      dueHours: maintenance.dueHours,
      cost: maintenance.cost,
      priority: maintenance.priority,
      partsUsed: maintenance.partsUsed,
      assignedTo: maintenance.assignedTo,
      notes: maintenance.notes,
      completedAt: maintenance.completedAt,
      createdAt: maintenance.createdAt,
      updatedAt: maintenance.updatedAt,
      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        type: vehicles.type,
        status: vehicles.status,
      },
    };
  }



  async getCount() {
    const [vehiclesCount] = await this.db
      .select({ count: count() })
      .from(vehicles);
    return vehiclesCount;
  }

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllVehicles();
    }
    return await this.getByIds(filter);
  }

  private async getAllVehicles() {
    return await this.db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        year: vehicles.year,
        type: vehicles.type,
        capacity: vehicles.capacity,
        licensePlate: vehicles.licensePlate,
        driverId: vehicles.driverId,
        purchaseDate: vehicles.purchaseDate,
        purchasePrice: vehicles.purchasePrice,
        initialMileage: vehicles.initialMileage,
        currentMileage: vehicles.currentMileage,
        status: vehicles.status,
        notes: vehicles.notes,
        createdAt: vehicles.createdAt,
        updatedAt: vehicles.updatedAt,
        driver: {
          id: drivers.id,
          name: drivers.name,
          image: users.image,
        }
      })
      .from(vehicles)
      .leftJoin(drivers, eq(vehicles.driverId, drivers.id))
      .leftJoin(users, eq(drivers.userId, users.id))
      .orderBy(desc(vehicles.createdAt));
  }

  private async getByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }
    return await this.db
      .select()
      .from(vehicles)
      .where(sql`${vehicles.id} = ANY(${ids})`)
      .orderBy(desc(vehicles.createdAt));
  }

  async getById(id) {
    const [existingVehicle] = await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1);

    if (!existingVehicle) return null;

    const analytics = await this.getVehicleAnalytics(id);

    const totalMileageCalculated = existingVehicle?.currentMileage && existingVehicle?.initialMileage
      ? parseFloat(existingVehicle.currentMileage) - parseFloat(existingVehicle.initialMileage)
      : 0;

    return {
      ...existingVehicle,
      totalMileageCalculated,
      analytics
    };
  }

  async getByType(type) {
    return await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.type, type))
      .orderBy(desc(vehicles.createdAt));
  }

  async getByStatus(status) {
    return await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.status, status))
  }

  async getByLicensePlate(licensePlate) {
    const [existingVehicle] = await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.licensePlate, licensePlate))
      .limit(1);
    return existingVehicle;
  }

  async getByDriverId(driverId) {
    const [vehicle] = await this.db
      .select()
      .from(vehicles)
      .where(eq(vehicles.driverId, driverId))
      .limit(1);
    return vehicle;
  }

  async getUnassignedVehicles() {
    return await this.db
      .select()
      .from(vehicles)
      .where(sql`${vehicles.driverId} IS NULL`)
      .orderBy(vehicles.name);
  }

  async getAssignedVehicles() {
    return await this.db
      .select()
      .from(vehicles)
      .where(sql`${vehicles.driverId} IS NOT NULL`)
      .orderBy(vehicles.name);
  }

  async getVehicleTypes() {
    const types = await this.db
      .selectDistinct({
        type: vehicles.type,
        count: sql<number>`count(*)`
      })
      .from(vehicles)
      .groupBy(vehicles.type)
      .orderBy(vehicles.type);
    return types;
  }

  async create(data) {
    const [newVehicle] = await this.db
      .insert(vehicles)
      .values(data)
      .returning();
    return newVehicle;
  }

  async update(id, data) {
    const [updatedVehicle] = await this.db
      .update(vehicles)
      .set(data)
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  async delete(id) {
    const [deletedVehicle] = await this.db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning();
    return deletedVehicle;
  }

  async getUsageStats(vehicleId: string) {
    // Get total fuel records count
    const [refuelsCount] = await this.db
      .select({ count: count() })
      .from(refuels)
      .where(eq(refuels.vehicleId, vehicleId));

    // Get total maintenance count
    const [maintenanceCount] = await this.db
      .select({ count: count() })
      .from(maintenance)
      .where(eq(maintenance.vehicleId, vehicleId));

    // Get latest refuel
    const [latestRefuel] = await this.db
      .select({
        datetime: refuels.datetime,
        mileageAtRefuel: refuels.mileageAtRefuel,
        liters: refuels.liters
      })
      .from(refuels)
      .where(eq(refuels.vehicleId, vehicleId))
      .orderBy(desc(refuels.datetime))
      .limit(1);

    return {
      totalFuelRecords: refuelsCount.count,
      totalMaintenanceRecords: maintenanceCount.count,
      lastRefuel: latestRefuel,
    };
  }

  async deleteAll() {
    const allVehicles = await this.db
      .select()
      .from(vehicles)
      .orderBy(desc(vehicles.createdAt));

    const deletedVehicles = await this.db
      .delete(vehicles)
      .returning();

    return {
      deletedCount: deletedVehicles.length,
      deletedVehicles: deletedVehicles
    };
  }

  async getStatusDistribution() {
    const result = await this.db
      .select({
        status: vehicles.status,
        count: sql<number>`count(*)`
      })
      .from(vehicles)
      .groupBy(vehicles.status)
      .orderBy(vehicles.status);

    return result.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: Number(item.count),
      status: item.status,
      color: item.status === 'active' ? '#22c55e' :
        item.status === 'maintenance' ? '#f59e0b' : '#ef4444'
    }));
  }

  async getTypeDistribution() {
    const result = await this.db
      .select({
        type: vehicles.type,
        count: sql<number>`count(*)`
      })
      .from(vehicles)
      .groupBy(vehicles.type)
      .orderBy(desc(sql<number>`count(*)`));

    return result.map(item => ({
      name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      value: Number(item.count),
      type: item.type,
      fill: '#3b82f6'
    }));
  }

  async getAgeAnalysis() {
    const currentYear = new Date().getFullYear();

    const result = await this.db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        year: vehicles.year,
        type: vehicles.type,
        age: sql<number>`${currentYear} - ${vehicles.year}`
      })
      .from(vehicles);

    // Group by age ranges for chart
    const ageGroups = result.reduce((acc, vehicle) => {
      const ageGroup = vehicle.age <= 2 ? 'New (0-2 years)' :
        vehicle.age <= 5 ? 'Recent (3-5 years)' :
          vehicle.age <= 10 ? 'Mature (6-10 years)' :
            'Older (10+ years)';

      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});

    return {
      chartData: Object.entries(ageGroups).map(([ageGroup, count]) => ({
        name: ageGroup,
        value: count,
        fill: '#8b5cf6'
      })),
      details: result.map(vehicle => ({
        ...vehicle,
        ageGroup: vehicle.age <= 2 ? 'New' :
          vehicle.age <= 5 ? 'Recent' :
            vehicle.age <= 10 ? 'Mature' : 'Older'
      })),
      averageAge: result.length > 0 ? result.reduce((sum, v) => sum + v.age, 0) / result.length : 0
    };
  }

  async getTotalFleetValue() {
    const [result] = await this.db
      .select({
        totalValue: sql<number>`SUM(CAST(${vehicles.purchasePrice} AS DECIMAL))`
      })
      .from(vehicles)
      .where(sql`${vehicles.purchasePrice} IS NOT NULL AND ${vehicles.purchasePrice} != ''`);

    return result?.totalValue || 0;
  }

  async getAverageAge() {
    const currentYear = new Date().getFullYear();

    const [result] = await this.db
      .select({
        averageAge: sql<number>`AVG(${currentYear} - ${vehicles.year})`
      })
      .from(vehicles);

    return Math.round(result?.averageAge || 0);
  }

  async getTotalFleetMileage() {
    const [result] = await this.db
      .select({
        totalMileage: sql<number>`COALESCE(SUM(CAST(${vehicles.currentMileage} AS NUMERIC) - CAST(${vehicles.initialMileage} AS NUMERIC)), 0)`,
        vehicleCount: count()
      })
      .from(vehicles)
      .where(eq(vehicles.status, 'active'));

    return {
      totalMileage: Number(result.totalMileage) || 0,
      vehicleCount: Number(result.vehicleCount) || 0
    };
  }

  async getVehicleAnalytics(vehicleId) {
    const fuelData = await this.getFuelConsumption(vehicleId);
    const maintenanceData = await this.getMaintenanceCount(vehicleId);

    // Get recent records using direct queries
    const recentRefuels = await this.getRecentRefuels(vehicleId);
    const recentMaintenance = await this.getRecentMaintenance(vehicleId);

    // Calculate derived analytics
    const avgFuelCostPerRefuel = fuelData.refuelCount > 0
      ? fuelData.totalCost / fuelData.refuelCount
      : 0;

    return {

      totalFuelCost: fuelData.totalCost || 0,
      totalFuelLiters: fuelData.totalLiters || 0,
      totalRefuels: fuelData.refuelCount || 0,
      totalMaintenance: maintenanceData.count || 0,

      avgFuelCostPerRefuel,

      recentRefuels,
      recentMaintenance,

    };
  }

  async getFuelConsumption(vehicleId) {
    const [result] = await this.db
      .select({
        totalCost: sql<number>`COALESCE(SUM(CAST(${refuels.totalCost} AS NUMERIC)), 0)`,
        totalLiters: sql<number>`COALESCE(SUM(CAST(${refuels.liters} AS NUMERIC)), 0)`,
        refuelCount: count()
      })
      .from(refuels)
      .where(eq(refuels.vehicleId, vehicleId));
    return result;
  }

  async getMaintenanceCount(vehicleId) {
    const [result] = await this.db
      .select({ count: count() })
      .from(maintenance)
      .where(eq(maintenance.vehicleId, vehicleId));
    return result;
  }

  async getRecentRefuels(vehicleId) {
    return await this.db
      .select(this.getRefuel())
      .from(refuels)
      .leftJoin(vehicles, eq(refuels.vehicleId, vehicles.id))
      .leftJoin(drivers, eq(refuels.drivers, drivers.id)) 
      .leftJoin(users, eq(drivers.userId, users.id))
      .where(eq(refuels.vehicleId, vehicleId))
      .orderBy(desc(refuels.datetime))
      .limit(3);
  }

  async getRecentMaintenance(vehicleId) {
    return await this.db
      .select(this.getMaintenance())
      .from(maintenance)
      .leftJoin(vehicles, eq(maintenance.vehicleId, vehicles.id))
      .where(eq(maintenance.vehicleId, vehicleId))
      .orderBy(desc(maintenance.createdAt))
      .limit(3);
  }


}