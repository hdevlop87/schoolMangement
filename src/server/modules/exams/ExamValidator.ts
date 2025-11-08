import { Injectable, t } from 'najm-api';
import { ExamRepository } from './ExamRepository';
import { StudentValidator } from '../students/StudentValidator';
import { TeacherValidator } from '../teachers/TeacherValidator';
import { SectionValidator } from '../sections/SectionValidator';
import { SubjectValidator } from '../subjects/SubjectValidator';
import { parseSchema } from '@/server/shared';
import { examSchema } from '@/lib/validations';

@Injectable()
export class ExamValidator {
  constructor(
    private examRepository: ExamRepository,
    private studentValidator: StudentValidator,
    private teacherValidator: TeacherValidator,
    private sectionValidator: SectionValidator,
    private subjectValidator: SubjectValidator,
  ) { }

  // ========================================
  // SCHEMA_VALIDATION
  // ========================================

  async validateCreateSchema(data) {
    return parseSchema(examSchema, data);
  }

  async validateUpdateShema(data) {
    const updateSchema = examSchema.partial();
    return parseSchema(updateSchema, data);
  }


  // ========================================
  // EXISTENCE_CHECKS
  // ========================================

  async checkIdIsUnique(id: string) {
    const existing = await this.examRepository.getById(id);
    if (existing) {
      throw new Error(t('exams.errors.idExists'));
    }
    return true;
  }

  async isExists(id) {
    const existing = await this.examRepository.getById(id);
    return !!existing;
  }

  async checkExists(id) {
    const exists = await this.isExists(id);
    if (!exists) {
      throw new Error(t('exams.errors.notFound'));
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

  async checkNotInUse(examId) {
    const inUse = await this.examRepository.checkExamInUse(examId);
    if (inUse) {
      throw new Error(t('exams.errors.inUse'));
    }
    return true;
  }

  async checkStudentInExam(studentId, examId) {
    const exam = await this.examRepository.getById(examId);
    if (!exam) {
      throw new Error(t('exams.errors.notFound'));
    }

    const student = await this.studentValidator.checkExists(studentId);

    if (!exam.section?.id) {
      throw new Error(t('exams.errors.noSection'));
    }

    if (student.sectionId !== exam.section.id) {
      throw new Error(t('exams.errors.studentNotInSection'));
    }

    return true;
  }

  // ========================================
// EXAM_VALIDATIONS
// ========================================

async checkTeacherAssignmentOrTeacherProvided(data: {
  teacherAssignmentId?: string;
  teacherId?: string;
}) {
  if (!data.teacherAssignmentId && !data.teacherId) {
    throw new Error(t('exams.errors.teacherRequired'));
  }
  return true;
}

async checkPassingMarksValid(passingMarks: number, totalMarks: number) {
  if (passingMarks > totalMarks) {
    throw new Error(t('exams.errors.passingMarksExceedsTotal'));
  }
  return true;
}

async checkDateNotTooOld(date: Date, maxMonths: number = 6) {
  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - maxMonths);
  minDate.setHours(0, 0, 0, 0);

  if (date < minDate) {
    throw new Error(
      t('exams.errors.dateTooOld', { months: maxMonths })
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
      t('exams.errors.dateTooFarInFuture', { years: maxYears })
    );
  }
  return true;
}

async checkEndTimeAfterStartTime(startTime: string, endTime: string) {
  // Assuming times are in HH:mm format
  const start = startTime.split(':').map(Number);
  const end = endTime.split(':').map(Number);
  
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];

  if (endMinutes <= startMinutes) {
    throw new Error(t('exams.errors.endTimeBeforeStart'));
  }
  return true;
}

async checkTotalMarksInRange(
  totalMarks: number,
  type: string,
  examTypeWeightages: Record<string, { min?: number; max?: number }>
) {
  const range = examTypeWeightages[type];
  
  if (!range) {
    return true; // No range defined for this type
  }

  if (range.min !== undefined && totalMarks < range.min) {
    throw new Error(
      t('exams.errors.marksBelowRecommended', {
        type,
        min: range.min,
      })
    );
  }

  if (range.max !== undefined && totalMarks > range.max) {
    throw new Error(
      t('exams.errors.marksAboveRecommended', {
        type,
        max: range.max,
      })
    );
  }

  return true;
}

async validateExamDate(date: Date) {
  await this.checkDateNotTooOld(date, 6);
  await this.checkDateNotTooFarInFuture(date, 1);
  return true;
}

}
