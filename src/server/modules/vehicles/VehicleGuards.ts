import { Injectable, User, Params, Ctx, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class VehicleGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'vehicle', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'vehicle');
    ctx.set('filter', ids);
    return true;
  }

}

const checkAccess = createGuard(VehicleGuards, 'checkAccess');
const checkAll = createGuard(VehicleGuards, 'checkAll');

export const canAccessVehicle = () => combineGuards(Permission('read:vehicles'), checkAccess);
export const canUpdateVehicle = () => combineGuards(Permission('update:vehicles'), checkAccess);
export const canCreateVehicle = () => combineGuards(Permission('create:vehicles'), isAdministrator);
export const canDeleteVehicle = () => combineGuards(Permission('delete:vehicles'), isAdministrator);
export const canAccessAllVehicles = () => combineGuards(Permission('read:vehicles'), checkAll);