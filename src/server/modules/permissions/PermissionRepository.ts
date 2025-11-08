
import { DB } from '@/server/database/db';
import { permissions, rolePermissions, roles } from '@/server/database/schema';
import { eq, and } from 'drizzle-orm';
import { Repository } from 'najm-api';

@Repository()
export class PermissionRepository {
  declare db: DB;

  async getAll() {
    return await this.db.select().from(permissions);
  }

  async getById(id: string) {
    const [existingPermission] = await this.db
      .select()
      .from(permissions)
      .where(eq(permissions.id, id));
    return existingPermission;
  }

  async getByName(name: string) {
    const [existingPermission] = await this.db
      .select()
      .from(permissions)
      .where(eq(permissions.name, name));
    return existingPermission;
  }

  async create(data) {
    const [newPermission] = await this.db
      .insert(permissions)
      .values(data)
      .returning();
    return newPermission;
  }

  async update(id: string, data) {
    const [updatedPermission] = await this.db
      .update(permissions)
      .set(data)
      .where(eq(permissions.id, id))
      .returning();
    return updatedPermission;
  }

  async delete(id: string) {
    const [deletedPermission] = await this.db
      .delete(permissions)
      .where(eq(permissions.id, id))
      .returning();
    return deletedPermission;
  }

  async getPermissionsByRole(roleId: string) {
    return await this.db
      .select({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description,
        resource: permissions.resource,
        action: permissions.action,
      })
      .from(rolePermissions)
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));
  }

  async getRolesByPermission(permissionId: string) {
    return await this.db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
      })
      .from(rolePermissions)
      .leftJoin(roles, eq(rolePermissions.roleId, roles.id))
      .where(eq(rolePermissions.permissionId, permissionId));
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    const [newRolePermission] = await this.db
      .insert(rolePermissions)
      .values({ roleId, permissionId })
      .returning();
    return newRolePermission;
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    const [deletedRolePermission] = await this.db
      .delete(rolePermissions)
      .where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId)))
      .returning();
    return deletedRolePermission;
  }

  async checkRoleHasPermission(roleId: string, permissionId: string) {
    const [rolePermission] = await this.db
      .select()
      .from(rolePermissions)
      .where(and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId)));
    return !!rolePermission;
  }

  async deleteAll() {
    // First delete all role-permission relationships
    await this.db.delete(rolePermissions);

    // Then delete all permissions
    const deletedPermissions = await this.db
      .delete(permissions)
      .returning();

    return deletedPermissions;
  }
}