
import { tokens, users, roles, permissions, rolePermissions } from '@/server/database/schema';
import { eq } from 'drizzle-orm';
import { Repository } from 'najm-api';

@Repository()
export class TokenRepository {
  declare db: any;

  async storeRefreshToken(tokenData: { userId: string; token: string; expiresAt: string }) {
    return await this.db
      .insert(tokens)
      .values(tokenData)
      .onConflictDoUpdate({
        target: tokens.userId,
        set: {
          token: tokenData.token,
          expiresAt: tokenData.expiresAt,
        }
      }).returning();
  }

  async getRefreshToken(userId: string) {
    const [token] = await this.db.select().from(tokens).where(eq(tokens.userId, userId));
    return token?.token;
  }

  async revokeToken(userId: string) {
    const [deletedToken] = await this.db.delete(tokens).where(eq(tokens.userId, userId)).returning();
    return deletedToken;
  }

  async isUserExists(userId: string) {
    const [user] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return !!user;
  }

  async getRoleNameById(userId: string) {
    const [role] = await this.db.select({
      roleName: roles.name
    })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
      .limit(1);

    return role?.roleName;
  }

  async getUserPermissions(userId: string) {
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

  async getUser(userId: string) {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        status: users.status,
        roleId: users.roleId,
        roleName: roles.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
      .limit(1);

    return user ? { ...user, role: user.roleName } : null;
  }
}