import { Injectable, User, Params, Ctx, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class StudentGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'student', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'student');
    ctx.set('filter', ids);
    return true;
  }

}

const checkAccess = createGuard(StudentGuards, 'checkAccess');
const checkAll = createGuard(StudentGuards, 'checkAll');

export const canAccessStudent = () => combineGuards(Permission('read:students'), checkAccess);
export const canUpdateStudent = () => combineGuards(Permission('update:students'), checkAccess);
export const canCreateStudent = () => combineGuards(Permission('create:students'), isAdministrator);
export const canDeleteStudent = () => combineGuards(Permission('delete:students'), isAdministrator);
export const canAccessAllStudents = () => combineGuards(Permission('read:students'), checkAll);

