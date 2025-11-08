import { Injectable, User, Params, Ctx, Body, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class EventGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'event', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'event');
    ctx.set('filter', ids);
    return true;
  }

  async canAccessClass(@User() user, @Body() body) {
    const { classId } = body;
    if (!classId) return true; // No class specified, general event
    return this.ownership.canAccess(user, 'class', classId);
  }

  async canAccessSection(@User() user, @Body() body) {
    const { sectionId } = body;
    if (!sectionId) return true; // No section specified
    return this.ownership.canAccess(user, 'section', sectionId);
  }

  async canManageEvent(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'event', id);
  }

}

const checkAccess = createGuard(EventGuards, 'checkAccess');
const checkAll = createGuard(EventGuards, 'checkAll');
const canAccessClass = createGuard(EventGuards, 'canAccessClass');
const canAccessSection = createGuard(EventGuards, 'canAccessSection');
const canManageEvent = createGuard(EventGuards, 'canManageEvent');

export const canAccessEvent = () => combineGuards(Permission('read:events'), checkAccess);
export const canUpdateEvent = () => combineGuards(Permission('update:events'), checkAccess);
export const canCreateEvent = () => combineGuards(Permission('create:events'), canAccessClass, canAccessSection);
export const canDeleteEvent = () => combineGuards(Permission('delete:events'), checkAccess);
export const canAccessAllEvents = () => combineGuards(Permission('read:events'), checkAll);
export const canManageParticipants = () => combineGuards(Permission('manage:participants'));
