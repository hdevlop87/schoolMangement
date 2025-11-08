import { Injectable, User, Params, Ctx, Body, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class ExamGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'exam', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'exam');
    ctx.set('filter', ids);
    return true;
  }

  async canAccessSection(@User() user, @Body() body) {
    const { sectionId } = body;
    return this.ownership.canAccess(user, 'section', sectionId);
  }

}

const checkAccess = createGuard(ExamGuards, 'checkAccess');
const checkAll = createGuard(ExamGuards, 'checkAll');
const canAccessSection = createGuard(ExamGuards, 'canAccessSection');

export const canAccessExam = () => combineGuards(Permission('read:exams'), checkAccess);
export const canUpdateExam = () => combineGuards(Permission('update:exams'), checkAccess);
export const canCreateExam = () => combineGuards(Permission('create:exams'), canAccessSection);
export const canDeleteExam = () => combineGuards(Permission('delete:exams'), checkAccess);
export const canAccessAllExams = () => combineGuards(Permission('read:exams'), checkAll);
