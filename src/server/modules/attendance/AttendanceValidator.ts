import { Injectable, t } from 'najm-api';
import { AttendanceRepository } from './AttendanceRepository';
import { StudentValidator } from '../students/StudentValidator';
import { TeacherValidator } from '../teachers/TeacherValidator';
import { SectionValidator } from '../sections/SectionValidator';
import { SubjectValidator } from '../subjects/SubjectValidator';
import { parseSchema } from '@/server/shared';
import { attendanceSchema } from '@/lib/validations';


@Injectable()
export class AttendanceValidator {
  constructor(
    private attendanceRepository: AttendanceRepository,
    private studentValidator: StudentValidator,
    private teacherValidator: TeacherValidator,
    private sectionValidator: SectionValidator,
    private subjectValidator: SubjectValidator,
  ) { }

  // ========================================
  // SCHEMA_VALIDATION
  // ========================================

  async validateCreateAttendance(data) {
    return parseSchema(attendanceSchema, data);
  }

  async validateUpdateAttendance(data) {
    const updateSchema = attendanceSchema.partial();
    return parseSchema(updateSchema, data);
  }

  // ========================================
  // EXISTENCE_CHECKS
  // ========================================

  async checkExists(id) {
    const existingAttendance = await this.attendanceRepository.getById(id);
    if (!existingAttendance) {
      throw new Error(t('attendance.errors.notFound'));
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

  async checkStudentInSection(studentId, sectionId) {
    return await this.studentValidator.checkInSection(studentId, sectionId);
  }

  async checkTeacherInSection(teacherId, sectionId) {
    return await this.teacherValidator.checkInSection(teacherId, sectionId);
  }

  async checkDuplicateAttendance(studentId, teacherAssignmentId, date) {
    const existing = await this.attendanceRepository.checkDuplicateAttendance(
      studentId,
      teacherAssignmentId,
      date
    );

    if (existing) {
      throw new Error(t('attendance.errors.alreadyMarked'));
    }

    return true;
  }

  // ========================================
  // DATE_VALIDATIONS
  // ========================================

  async checkDateNotInFuture(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      throw new Error(t('attendance.errors.futureDate'));
    }
    return true;
  }

  async checkDateNotTooOld(date: Date, maxDaysOld: number = 30) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = new Date(today);
    minDate.setDate(today.getDate() - maxDaysOld);

    if (date < minDate) {
      throw new Error(t('attendance.errors.dateTooOld', { days: maxDaysOld }));
    }
    return true;
  }

  async validateAttendanceDate(date: Date) {
    await this.checkDateNotInFuture(date);
    await this.checkDateNotTooOld(date, 30);
    return true;
  }
}