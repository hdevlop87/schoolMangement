

import { DB } from '@/server/database/db'
import { roles } from '@/server/database/schema';
import { eq } from 'drizzle-orm';
import { Repository } from 'najm-api';

@Repository()
export class RoleRepository {

  declare db: DB;

  async getAll() {
    return await this.db.select().from(roles);
  }

  async getById(id:string) {
    const [existingRole] = await this.db.select().from(roles).where(eq(roles.id, id));
    return existingRole;
  }

  async getByName(name:string) {
    const [existingRole] = await this.db.select().from(roles).where(eq(roles.name, name));
    return existingRole
  }

  async create(data) {
    const [newRole] = await this.db.insert(roles).values(data).returning();
    return newRole
  }

  async update(id, data) {
    const [updatedRole] = await this.db.update(roles)
      .set(data)
      .where(eq(roles.id, id))
      .returning();

      return updatedRole
  }

  async delete(id) {
    const [deletedRole] = await this.db.delete(roles)
      .where(eq(roles.id, id))
      .returning();
      return deletedRole
  }
}
