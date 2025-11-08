
import { DB } from '@/server/database/db'
import { roles, users, permissions, rolePermissions } from '@/server/database/schema';
import { eq, ne } from 'drizzle-orm';
import { Repository } from 'najm-api';

@Repository()
export class UserRepository {
  declare db: DB;

  private getUser() {
    return {
      id: users.id,
      email: users.email,
      emailVerified: users.emailVerified,
      image: users.image,
      status: users.status,
      roleId: users.roleId,
      role: roles.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    };
  }

  async getAll() {
    const allUsers = await this.db
      .select(this.getUser())
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id));

    // Add permissions to each user
    return Promise.all(allUsers.map(async (user) => ({
      ...user,
      permissions: await this.getUserPermissions(user.id)
    })));
  }

  async getById(id) {
    const [user] = await this.db
      .select(this.getUser())
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, id))
      .limit(1);

    if (!user) return user;

    return {
      ...user,
      permissions: await this.getUserPermissions(user.id)
    };
  }

  async getByEmail(email) {
    const [existingUser] = await this.db
      .select(this.getUser())
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.email, email));
    return existingUser;
  }


  async create(data) {
    const [newUser] = await this.db.insert(users).values(data).returning();
    return newUser;
  }

  async update(id, data) {
    const [updatedUser] = await this.db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async delete(id) {
    const [deletedUser] = await this.db.delete(users).where(eq(users.id, id)).returning();
    return deletedUser;
  }

  async deleteAll() {
    const adminRole = await this.db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, 'admin'))
      .limit(1);

    if (adminRole.length === 0) {
      const deletedUsers = await this.db.delete(users).returning();
      return deletedUsers;
    }
    const deletedUsers = await this.db
      .delete(users)
      .where(ne(users.roleId, adminRole[0].id))
      .returning();

    return deletedUsers;
  }

  async getRoleNameById(userId) {
    const [role] = await this.db.select({
      roleName: roles.name
    })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))

    return role.roleName
  }

  async getUserPassword(email) {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        password: users.password
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user.password;
  }

  async getUserPermissions(userId) {
    const [user] = await this.db
      .select({ roleId: users.roleId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.roleId) return [];

    const userPermissions = await this.db
      .select({
        name: permissions.name,
      })
      .from(rolePermissions)
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, user.roleId));

    return userPermissions.map(p => p.name).filter(name => name);
  }

}