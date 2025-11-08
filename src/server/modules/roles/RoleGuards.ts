import { Injectable, Headers, createGuard, GuardParams, Ctx } from "najm-api";
import { TokenService } from "../tokens";

// ============ CONSTANTS ============ //

export const ROLES = {
  ADMIN: 'admin',
  PRINCIPAL: 'principal',
  ACCOUNTING: 'accounting',
  SECRETARY: 'secretary',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export const ROLE_GROUPS = {
  ADMINISTRATORS: [ROLES.ADMIN, ROLES.PRINCIPAL],
  FINANCIAL: [ROLES.ADMIN, ROLES.ACCOUNTING],
  STAFF: [ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.ACCOUNTING, ROLES.SECRETARY, ROLES.TEACHER],
  END_USERS: [ROLES.STUDENT, ROLES.PARENT],
  ALL: [ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.ACCOUNTING, ROLES.SECRETARY, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
export type RoleGroup = typeof ROLE_GROUPS[keyof typeof ROLE_GROUPS];

// ============ ROLE CHECKER (Injectable for Services) ============ //

@Injectable()
export class RoleChecker {
  isInGroup(userRole, group: readonly string[]): boolean {
    return group.includes(userRole?.toLowerCase());
  }

  isAdministrator(userRole): boolean {
    return this.isInGroup(userRole, ROLE_GROUPS.ADMINISTRATORS);
  }

  isStaff(userRole): boolean {
    return this.isInGroup(userRole, ROLE_GROUPS.STAFF);
  }

  hasAnyRole(userRole, roles: readonly string[]): boolean {
    return roles.includes(userRole?.toLowerCase());
  }

  hasExactRole(userRole, requiredRole): boolean {
    return userRole?.toLowerCase() === requiredRole?.toLowerCase();
  }

}

// ============ ROLE GUARDS (Injectable for Decorators) ============ //

@Injectable()
export class RoleGuards {
  constructor(
    private roleChecker: RoleChecker,
    private tokenService: TokenService
  ) { }

  async isAuth(@Headers('authorization') auth, @Ctx() ctx) {
    const user = await this.tokenService.storeUserInCache(auth, ctx);
    return !!user;
  }

  async hasRoles(@Headers('authorization') auth, @Ctx() ctx, @GuardParams() roles) {
    try {
      const user = await this.tokenService.storeUserInCache(auth, ctx);
      if (!user?.role) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return this.roleChecker.hasAnyRole(user.role, roleArray);
    } catch {
      return false;
    }
  }
}

// ============ EXPORTED GUARD DECORATORS ============ //

export const isAdmin = () => Role('admin');
export const isPrincipal = () => Role('principal');
export const isAccounting = () => Role('accounting');
export const isSecretary = () => Role('secretary');
export const isTeacher = () => Role('teacher');
export const isParent = () => Role('parent');
export const isStudent = () => Role('student');
export const isAdministrator = () => Role('admin', 'principal');
export const isFinancial = () => Role('admin', 'accounting');
export const isStaff = () => Role('admin', 'principal', 'accounting', 'secretary', 'teacher');
export const isAuth = createGuard(RoleGuards, 'isAuth');

export const Role = (...roles) => createGuard(RoleGuards, 'hasRoles')(...roles);
