import { Injectable, t } from 'najm-api';
import { GradeRepository } from './GradeRepository';
import { StudentValidator } from '../students/StudentValidator';
import { TeacherValidator } from '../teachers/TeacherValidator';
import { SectionValidator } from '../sections/SectionValidator';
import { SubjectValidator } from '../subjects/SubjectValidator';
import { AssessmentValidator } from '../assessments/AssessmentValidator';
import { parseSchema } from '@/server/shared';
import { gradeSchema } from '@/lib/validations';

@Injectable()
export class GradeValidator {
  constructor(
    private gradeRepository: GradeRepository,
    private studentValidator: StudentValidator,
    private teacherValidator: TeacherValidator,
    private sectionValidator: SectionValidator,
    private subjectValidator: SubjectValidator,
    private assessmentValidator: AssessmentValidator,
  ) { }

  // ========================================
  // SCHEMA_VALIDATION (Zod handles: format, range, required fields, enum values)
  // ========================================

  async validateCreateSchema(data) {
    return parseSchema(gradeSchema, data);
  }

  async validateUpdateSchema(data) {
    const updateSchema = gradeSchema.partial();
    return parseSchema(updateSchema, data);
  }

  // ========================================
  // EXISTENCE_CHECKS (Database-level validation - cannot be done in Zod)
  // ========================================

  async checkExists(id) {
    const existingGrade = await this.gradeRepository.getById(id);
    if (!existingGrade) {
      throw new Error(t('grades.errors.notFound'));
    }
    return true;
  }

  async checkGradeIdIsUnique(id: string) {
    const existingGrade = await this.gradeRepository.getById(id);
    if (existingGrade) {
      throw new Error(t('grades.errors.idExists'));
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

  async checkAssessmentExists(assessmentId) {
    return await this.assessmentValidator.checkExists(assessmentId);
  }

  // ========================================
  // BUSINESS_RULES (Cross-entity validation - cannot be done in Zod)
  // ========================================

  async checkDuplicateGrade(studentId, assessmentId) {
    const existing = await this.gradeRepository.checkGradeExists(studentId, assessmentId);
    if (existing) {
      throw new Error(t('grades.errors.alreadyExists'));
    }
    return true;
  }

  async checkStudentInSection(studentId, sectionId) {
    return await this.studentValidator.checkInSection(studentId, sectionId);
  }

  async checkTeacherInSection(teacherId, sectionId) {
    return await this.teacherValidator.checkInSection(teacherId, sectionId);
  }

  async checkTeacherAssignmentExists(teacherId, subjectId, sectionId) {
    return await this.teacherValidator.checkAssignmentExists(teacherId, subjectId, sectionId);
  }

  async checkStudentInAssessment(studentId, assessmentId) {
    return await this.assessmentValidator.checkStudentInAssessment(studentId, assessmentId);
  }

  async checkAssessmentOrTeacherProvided(data: {
    assessmentId?: string;
    teacherId?: string;
  }) {
    if (!data.assessmentId && !data.teacherId) {
      throw new Error(
        t('grades.errors.assessmentOrTeacherRequired')
      );
    }
    return true;
  }

}