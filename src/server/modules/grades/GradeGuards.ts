import { Injectable, User, Params, Ctx, Body, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class GradeGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'grade', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'grade');
    ctx.set('filter', ids);
    return true;
  }

  async canAccessStudent(@User() user, @Body() body) {
    const { studentId } = body;
    return this.ownership.canAccess(user, 'student', studentId);
  }

}

const checkAccess = createGuard(GradeGuards, 'checkAccess');
const checkAll = createGuard(GradeGuards, 'checkAll');
const canAccessStudent = createGuard(GradeGuards, 'canAccessStudent');

export const canAccessGrade = () => combineGuards(Permission('read:grades'), checkAccess);
export const canUpdateGrade = () => combineGuards(Permission('update:grades'), checkAccess);
export const canCreateGrade = () => combineGuards(Permission('create:grades'), canAccessStudent);
export const canDeleteGrade = () => combineGuards(Permission('delete:grades'), checkAccess);
export const canAccessAllGrades = () => combineGuards(Permission('read:grades'), checkAll);