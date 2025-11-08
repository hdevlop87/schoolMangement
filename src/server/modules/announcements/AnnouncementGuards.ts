import { Injectable, User, Params, Ctx, Body, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class AnnouncementGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'announcement', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'announcement');
    ctx.set('filter', ids);
    return true;
  }

  async canAccessClass(@User() user, @Body() body) {
    const { classId } = body;
    if (!classId) return true; // No class specified, general announcement
    return this.ownership.canAccess(user, 'class', classId);
  }

  async canAccessSection(@User() user, @Body() body) {
    const { sectionId } = body;
    if (!sectionId) return true; // No section specified
    return this.ownership.canAccess(user, 'section', sectionId);
  }

}

const checkAccess = createGuard(AnnouncementGuards, 'checkAccess');
const checkAll = createGuard(AnnouncementGuards, 'checkAll');
const canAccessClass = createGuard(AnnouncementGuards, 'canAccessClass');
const canAccessSection = createGuard(AnnouncementGuards, 'canAccessSection');

export const canAccessAnnouncement = () => combineGuards(Permission('read:announcements'), checkAccess);
export const canUpdateAnnouncement = () => combineGuards(Permission('update:announcements'), checkAccess);
export const canCreateAnnouncement = () => combineGuards(Permission('create:announcements'), canAccessClass, canAccessSection);
export const canDeleteAnnouncement = () => combineGuards(Permission('delete:announcements'), checkAccess);
export const canAccessAllAnnouncements = () => combineGuards(Permission('read:announcements'), checkAll);
export const canPublishAnnouncement = () => combineGuards(Permission('publish:announcements'), checkAccess);
