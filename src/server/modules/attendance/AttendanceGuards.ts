import { Injectable, User, Params, Ctx, Body, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class AttendanceGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'attendance', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'attendance');
    ctx.set('filter', ids);
    return true;
  }

  async canAccessStudent(@User() user, @Body() body) {
    const { studentId } = body;
    return this.ownership.canAccess(user, 'student', studentId);
  }

}

const checkAccess = createGuard(AttendanceGuards, 'checkAccess');
const checkAll = createGuard(AttendanceGuards, 'checkAll');
const canAccessStudent = createGuard(AttendanceGuards, 'canAccessStudent');

export const canAccessAttendance = () => combineGuards(Permission('read:attendance'), checkAccess);
export const canUpdateAttendance = () => combineGuards(Permission('update:attendance'), checkAccess);
export const canCreateAttendance = () => combineGuards(Permission('create:attendance'), canAccessStudent);
export const canDeleteAttendance = () => combineGuards(Permission('delete:attendance'), checkAccess);
export const canAccessAllAttendance = () => combineGuards(Permission('read:attendance'), checkAll);