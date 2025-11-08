import { Injectable, User, Params, Ctx, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class ClassGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'class', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'class');
    ctx.set('filter', ids);
    return true;
  }

}

const checkAccess = createGuard(ClassGuards, 'checkAccess');
const checkAll = createGuard(ClassGuards, 'checkAll');

export const canAccessClass = () => combineGuards(Permission('read:classes'), checkAccess);
export const canUpdateClass = () => combineGuards(Permission('update:classes'), checkAccess);
export const canCreateClass = () => combineGuards(Permission('create:classes'), isAdministrator);
export const canDeleteClass = () => combineGuards(Permission('delete:classes'), isAdministrator);
export const canAccessAllClasses = () => combineGuards(Permission('read:classes'), checkAll);