import { Injectable, User, Params, Ctx, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class SectionGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'section', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'section');
    ctx.set('filter', ids);
    return true;
  }

}

const checkAccess = createGuard(SectionGuards, 'checkAccess');
const checkAll = createGuard(SectionGuards, 'checkAll');

export const canAccessSection = () => combineGuards(Permission('read:sections'), checkAccess);
export const canUpdateSection = () => combineGuards(Permission('update:sections'), checkAccess);
export const canCreateSection = () => combineGuards(Permission('create:sections'), isAdministrator);
export const canDeleteSection = () => combineGuards(Permission('delete:sections'), isAdministrator);
export const canAccessAllSections = () => combineGuards(Permission('read:sections'), checkAll);