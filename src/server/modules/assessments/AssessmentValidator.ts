import { Injectable, t } from 'najm-api';
import { AssessmentRepository } from './AssessmentRepository';
import { StudentValidator } from '../students/StudentValidator';
import { TeacherValidator } from '../teachers/TeacherValidator';
import { SectionValidator } from '../sections/SectionValidator';
import { SubjectValidator } from '../subjects/SubjectValidator';
import { parseSchema } from '@/server/shared';
import { assessmentSchema, bulkAssessmentSchema } from '@/lib/validations';

@Injectable()
export class AssessmentValidator {
  constructor(
    private assessmentRepository: AssessmentRepository,
    private studentValidator: StudentValidator,
    private teacherValidator: TeacherValidator,
    private sectionValidator: SectionValidator,
    private subjectValidator: SubjectValidator,
  ) { }

  // ========================================
  // SCHEMA_VALIDATION
  // ========================================

  async validateCreateSchema(data) {
    return parseSchema(assessmentSchema, data);
  }

  async validateUpdateShema(data) {
    const updateSchema = assessmentSchema.partial();
    return parseSchema(updateSchema, data);
  }

  async validateBulkShema(data) {
    return parseSchema(bulkAssessmentSchema, data);
  }

  // ========================================
  // EXISTENCE_CHECKS
  // ========================================

  async checkIdIsUnique(id: string) {
    const existing = await this.assessmentRepository.getById(id);
    if (existing) {
      throw new Error(t('assessments.errors.idExists'));
    }
    return true;
  }

  async isExists(id) {
    const existing = await this.assessmentRepository.getById(id);
    return !!existing;
  }

  async checkExists(id) {
    const exists = await this.isExists(id);
    if (!exists) {
      throw new Error(t('assessments.errors.notFound'));
    }
    return true;
  }

  async checkStudentExists(studentId) {
    return await this.studentValidator.checkExists(studentId);
  }

  async checkTeacherExists(teacherId) {
    return await this.teacherValidator.checkExists(teacherId);
  }

  async checkSectionExists(sectionId) {
    return await this.sectionValidator.checkExists(sectionId);
  }

  async checkSubjectExists(subjectId) {
    return await this.subjectValidator.checkExists(subjectId);
  }

  async checkTeacherAssignmentExists(teacherId, subjectId, sectionId) {
    return await this.teacherValidator.checkAssignmentExists(teacherId, subjectId, sectionId);
  }

  // ========================================
  // BUSINESS_RULES
  // ========================================

  async checkTeacherInSection(teacherId, sectionId) {
    return await this.teacherValidator.checkInSection(teacherId, sectionId);
  }

  async checkStudentInSection(studentId, sectionId) {
    return await this.studentValidator.checkInSection(studentId, sectionId);
  }

  async checkNotInUse(assessmentId) {
    const inUse = await this.assessmentRepository.checkAssessmentInUse(assessmentId);
    if (inUse) {
      throw new Error(t('assessments.errors.inUse'));
    }
    return true;
  }

  async checkStudentInAssessment(studentId, assessmentId) {
    const assessment = await this.assessmentRepository.getById(assessmentId);
    if (!assessment) {
      throw new Error(t('assessments.errors.notFound'));
    }

    const student = await this.studentValidator.checkExists(studentId);

    if (!assessment.section?.id) {
      throw new Error(t('assessments.errors.noSection'));
    }

    if (student.sectionId !== assessment.section.id) {
      throw new Error(t('assessments.errors.studentNotInSection'));
    }

    return true;
  }

  // ========================================
// ASSESSMENT_VALIDATIONS
// ========================================

async checkTeacherAssignmentOrTeacherProvided(data: {
  teacherAssignmentId?: string;
  teacherId?: string;
}) {
  if (!data.teacherAssignmentId && !data.teacherId) {
    throw new Error(
      t('assessments.errors.teacherRequired')
    );
  }
  return true;
}

async checkPassingMarksValid(passingMarks: number, totalMarks: number) {
  if (passingMarks > totalMarks) {
    throw new Error(t('assessments.errors.passingMarksExceedsTotal'));
  }
  return true;
}

async checkDateNotTooOld(date: Date, maxYears: number = 1) {
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - maxYears);
  minDate.setHours(0, 0, 0, 0);

  if (date < minDate) {
    throw new Error(
      t('assessments.errors.dateTooOld', { years: maxYears })
    );
  }
  return true;
}

async checkDateNotTooFarInFuture(date: Date, maxYears: number = 1) {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + maxYears);
  maxDate.setHours(23, 59, 59, 999);

  if (date > maxDate) {
    throw new Error(
      t('assessments.errors.dateTooFarInFuture', { years: maxYears })
    );
  }
  return true;
}

async checkTotalMarksInRange(
  totalMarks: number,
  type: string,
  assessmentTypeWeightages: Record<string, { min?: number; max?: number }>
) {
  const range = assessmentTypeWeightages[type];
  
  if (!range) {
    return true; // No range defined for this type
  }

  if (range.min !== undefined && totalMarks < range.min) {
    throw new Error(
      t('assessments.errors.marksBelowRecommended', {
        type,
        min: range.min,
      })
    );
  }

  if (range.max !== undefined && totalMarks > range.max) {
    throw new Error(
      t('assessments.errors.marksAboveRecommended', {
        type,
        max: range.max,
      })
    );
  }

  return true;
}

async validateAssessmentDate(date: Date) {
  await this.checkDateNotTooOld(date, 1);
  await this.checkDateNotTooFarInFuture(date, 1);
  return true;
}


}