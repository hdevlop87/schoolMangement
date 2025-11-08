import { DB } from '@/server/database/db';
import { drivers, users, vehicles } from '@/server/database/schema';
import { count, eq, desc, and, gte, lte, inArray } from 'drizzle-orm';
import { Repository } from 'najm-api';
import { driverSelect } from '@/server/shared/selectDefinitions';

@Repository()
export class DriverRepository {

  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildDriverQuery() {
    return this.db
      .select(driverSelect)
      .from(drivers)
      .leftJoin(users, eq(drivers.userId, users.id));
  }

  // ========================================
  // GET / READ METHODS
  // ========================================

  async getCount() {
    const [driverCount] = await this.db
      .select({ count: count() })
      .from(drivers);
    return driverCount;
  }

  async getAll() {
    return await this.getAllDrivers();
  }

  async getAllDrivers() {
    return await this.buildDriverQuery()
      .orderBy(desc(drivers.createdAt));
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildDriverQuery()
      .where(inArray(drivers.id, ids))
      .orderBy(desc(drivers.createdAt));
  }

  async getById(id) {
    const [existingDriver] = await this.buildDriverQuery()
      .where(eq(drivers.id, id))
      .limit(1);

    return existingDriver || null;
  }

  async getByStatus(status) {
    return await this.buildDriverQuery()
      .where(eq(drivers.status, status))
      .orderBy(desc(drivers.createdAt));
  }

  async getByCin(cin) {
    const [existingDriver] = await this.buildDriverQuery()
      .where(eq(drivers.cin, cin))
      .limit(1);
    return existingDriver;
  }

  async getByLicenseNumber(licenseNumber) {
    const [existingDriver] = await this.buildDriverQuery()
      .where(eq(drivers.licenseNumber, licenseNumber))
      .limit(1);
    return existingDriver;
  }

  async getLicenseExpiringDrivers(daysAhead: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return await this.buildDriverQuery()
      .where(
        and(
          eq(drivers.status, 'active'),
          lte(drivers.licenseExpiry, futureDate.toISOString().split('T')[0]),
          gte(drivers.licenseExpiry, new Date().toISOString().split('T')[0])
        )
      )
      .orderBy(drivers.licenseExpiry);
  }

  async getAssignedVehicles(driverId) {
    return await this.db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        brand: vehicles.brand,
        model: vehicles.model,
        type: vehicles.type,
        status: vehicles.status,
        licensePlate: vehicles.licensePlate,
        createdAt: vehicles.createdAt,
      })
      .from(vehicles)
      .where(
        and(
          eq(vehicles.driverId, driverId),
          eq(vehicles.status, 'active')
        )
      )
      .orderBy(vehicles.name);
  }

  async getByEmail(email) {
    const [existingDriver] = await this.buildDriverQuery()
      .where(eq(users.email, email))
      .limit(1);
    return existingDriver;
  }

  async getByPhone(phone) {
    const [existingDriver] = await this.buildDriverQuery()
      .where(eq(drivers.phone, phone))
      .limit(1);
    return existingDriver;
  }

  // ========================================
  // CREATE_METHODS
  // ========================================

  async create(data) {
    const [newDriver] = await this.db
      .insert(drivers)
      .values(data)
      .returning();
    return newDriver;
  }

  // ========================================
  // UPDATE_METHODS
  // ========================================

  async update(id, data) {
    const [updatedDriver] = await this.db
      .update(drivers)
      .set(data)
      .where(eq(drivers.id, id))
      .returning();
    return updatedDriver;
  }

  // ========================================
  // DELETE_METHODS
  // ========================================

  async delete(id) {
    const [deletedDriver] = await this.db
      .delete(drivers)
      .where(eq(drivers.id, id))
      .returning();

    if (deletedDriver?.userId) {
      await this.db
        .delete(users)
        .where(eq(users.id, deletedDriver.userId));
    }
    return deletedDriver;
  }

  async deleteAll() {
    const allDrivers = await this.buildDriverQuery()
      .orderBy(desc(drivers.createdAt));
    const userIds = allDrivers
      .map(driver => driver.userId)
      .filter(userId => userId !== null);

    const deletedDrivers = await this.db
      .delete(drivers)
      .returning();

    let deletedUsers = [];

    if (userIds.length > 0) {
      deletedUsers = await this.db
        .delete(users)
        .where(inArray(users.id, userIds))
        .returning();
    }

    return {
      deletedCount: deletedDrivers.length,
      deletedDrivers: deletedDrivers
    };
  }
}
