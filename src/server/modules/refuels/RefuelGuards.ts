import { Injectable, User, Params, Ctx, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";

@Injectable()
export class RefuelGuards {

  async checkAccess(@User() user, @Params('id') id) {
    return true;
  }

  async checkAll(@User() user, @Ctx() ctx) {
    return true;
  }

}

const checkAccess = createGuard(RefuelGuards, 'checkAccess');
const checkAll = createGuard(RefuelGuards, 'checkAll');

export const canAccessRefuel = () => combineGuards(Permission('read:refuels'), checkAccess);
export const canUpdateRefuel = () => combineGuards(Permission('update:refuels'), isAdministrator);
export const canCreateRefuel = () => combineGuards(Permission('create:refuels'), isAdministrator);
export const canDeleteRefuel = () => combineGuards(Permission('delete:refuels'), isAdministrator);
export const canAccessAllRefuels = () => combineGuards(Permission('read:refuels'), checkAll);
