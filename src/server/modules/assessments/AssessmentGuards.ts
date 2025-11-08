import { Injectable, User, Params, Ctx, Body, combineGuards, createGuard } from "najm-api";
import { Permission } from "../permissions";
import { isAdministrator } from "../roles";
import { OwnershipService } from "../ownership/OwnershipService";

@Injectable()
export class AssessmentGuards {

  constructor(private ownership: OwnershipService) { }

  async checkAccess(@User() user, @Params('id') id) {
    return this.ownership.canAccess(user, 'assessment', id);
  }

  async checkAll(@User() user, @Ctx() ctx) {
    const ids = await this.ownership.getAccessibleIds(user, 'assessment');
    ctx.set('filter', ids);
    return true;
  }

  async canAccessSection(@User() user, @Body() body) {
    const { sectionId } = body;
    return this.ownership.canAccess(user, 'section', sectionId);
  }

}

const checkAccess = createGuard(AssessmentGuards, 'checkAccess');
const checkAll = createGuard(AssessmentGuards, 'checkAll');
const canAccessSection = createGuard(AssessmentGuards, 'canAccessSection');

export const canAccessAssessment = () => combineGuards(Permission('read:assessments'), checkAccess);
export const canUpdateAssessment = () => combineGuards(Permission('update:assessments'), checkAccess);
export const canCreateAssessment = () => combineGuards(Permission('create:assessments'), canAccessSection);
export const canDeleteAssessment = () => combineGuards(Permission('delete:assessments'), checkAccess);
export const canAccessAllAssessments = () => combineGuards(Permission('read:assessments'), checkAll);
