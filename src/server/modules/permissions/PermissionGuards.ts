import { createGuard, Injectable, GuardParams, Headers, Ctx } from "najm-api";
import { TokenService } from "../tokens";


@Injectable()
export class PermissionGuards {
  constructor(private tokenService: TokenService) { }

  private async getUserPermissions(auth) {
    const permissions = await this.tokenService.getUserPermissions(auth);
    if (!permissions || !Array.isArray(permissions)) return null;
    return permissions;
  }

  private checkPermissionMatch(permissions: string[], requiredPermission: string): boolean {
    if (permissions.includes(requiredPermission)) {
      return true;
    }

    const [requiredAction, requiredResource] = requiredPermission.split(':');
    if (requiredAction && requiredResource) {
      if (permissions.includes(`${requiredAction}:*`)) {
        return true;
      }
      if (permissions.includes(`*:${requiredResource}`)) {
        return true;
      }
    }
    if (permissions.includes('*:*')) {
      return true;
    }
    return false;
  }


  async hasPermission(@Headers('authorization') auth, @Ctx() ctx, @GuardParams() requiredPermission) {
    
    await this.tokenService.storeUserInCache(auth, ctx);
    const permissions = await this.getUserPermissions(auth);
    if (!permissions) return false;
    const check = this.checkPermissionMatch(permissions, requiredPermission);
    return check
  }
}

export const Permission = (...permissions) => createGuard(PermissionGuards, 'hasPermission')(...permissions);

