import { Injectable, User, Params, Ctx, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator} from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class TeacherGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'teacher', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'teacher');
    ctx.set('filter', ids);
    return true;
  }

}

const checkAccess = createGuard(TeacherGuards, 'checkAccess');
const checkAll = createGuard(TeacherGuards, 'checkAll');

export const canAccessTeacher = () => combineGuards(Permission('read:teachers'), checkAccess);
export const canUpdateTeacher = () => combineGuards(Permission('update:teachers'), checkAccess);
export const canCreateTeacher = () => combineGuards(Permission('create:teachers'), isAdministrator);
export const canDeleteTeacher = () => combineGuards(Permission('delete:teachers'), isAdministrator);
export const canAccessAllTeachers = () => combineGuards(Permission('read:teachers'), checkAll);