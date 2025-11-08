import { Injectable, User, Params, Ctx, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class ParentGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    
    return this.ownership.canAccess(user, 'parent', id);
  }
  
  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'parent');
    ctx.set('filter', ids);
    return true;
  }

}

const checkAccess = createGuard(ParentGuards, 'checkAccess');
const checkAll = createGuard(ParentGuards, 'checkAll');

export const canAccessParent = () => combineGuards(Permission('read:parents'), checkAccess);
export const canUpdateParent = () => combineGuards(Permission('update:parents'), checkAccess);
export const canCreateParent = () => combineGuards(Permission('create:parents'), isAdministrator);
export const canDeleteParent = () => combineGuards(Permission('delete:parents'), isAdministrator);
export const canAccessAllParents = () => combineGuards(Permission('read:parents'), checkAll);