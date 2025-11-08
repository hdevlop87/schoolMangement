import { Repository } from 'najm-api';
import { and, desc, eq, sql, asc, gte, lte, count, avg } from 'drizzle-orm';
import { assessments, grades, students, teacherAssignments, teachers, subjects, classes, sections, users } from '@/server/database/schema';
import { DB } from '@/server/database/db';
import {
  assessmentSelect,
  gradeSelect,
  subjectSelect,
  teacherSelect,
  classSelect,
  sectionSelect
} from '@/server/shared/selectDefinitions';
import { alias } from 'drizzle-orm/pg-core';

@Repository()
export class AssessmentRepository {
  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildAssessmentQuery() {
    const teacherUsers = alias(users, 'teacher_users');

    return this.db
      .select({
        ...assessmentSelect,
        subject: {
          id: subjects.id,
          name: subjects.name,
          code: subjects.code,
        },
        teacher: {
          id: teachers.id,
          name: teachers.name,
          image: teacherUsers.image,
        },
        class: {
          id: classes.id,
          name: classes.name,
        },
        section: {
          id: sections.id,
          name: sections.name,
        },
      })
      .from(assessments)
      .leftJoin(teacherAssignments, eq(assessments.teacherAssignmentId, teacherAssignments.id))
      .leftJoin(subjects, eq(teacherAssignments.subjectId, subjects.id))
      .leftJoin(teachers, eq(teacherAssignments.teacherId, teachers.id))
      .leftJoin(teacherUsers, eq(teachers.userId, teacherUsers.id))
      .leftJoin(sections, eq(teacherAssignments.sectionId, sections.id))
      .leftJoin(classes, eq(sections.classId, classes.id));
  }

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllAssessments();
    }
    return await this.getByIds(filter);
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildAssessmentQuery()
      .where(sql`${assessments.id} = ANY(${ids})`)
      .orderBy(desc(assessments.date));
  }

  async getAllAssessments() {
    return await this.buildAssessmentQuery()
      .orderBy(desc(assessments.date));
  }

  async getById(id) {
    const [result] = await this.buildAssessmentQuery()
      .where(eq(assessments.id, id))
      .limit(1);

    return result;
  }

  async getByType(type) {
    return await this.buildAssessmentQuery()
      .where(eq(assessments.type, type))
      .orderBy(desc(assessments.date));
  }

  async getByStatus(status) {
    return await this.buildAssessmentQuery()
      .where(eq(assessments.status, status))
      .orderBy(desc(assessments.date));
  }

  async getBySection(sectionId) {
    return await this.buildAssessmentQuery()
      .where(eq(teacherAssignments.sectionId, sectionId))
      .orderBy(desc(assessments.date));
  }

  async getByTeacherAssignment(teacherAssignmentId) {
    return await this.buildAssessmentQuery()
      .where(eq(assessments.teacherAssignmentId, teacherAssignmentId))
      .orderBy(desc(assessments.date));
  }

  async getBySubject(subjectId) {
    return await this.buildAssessmentQuery()
      .where(eq(teacherAssignments.subjectId, subjectId))
      .orderBy(desc(assessments.date));
  }

  async getByTeacher(teacherId) {
    return await this.buildAssessmentQuery()
      .where(eq(teacherAssignments.teacherId, teacherId))
      .orderBy(desc(assessments.date));
  }

  async getTodayAssessments() {
    const today = new Date().toISOString().split('T')[0];
    return await this.buildAssessmentQuery()
      .where(eq(assessments.date, today))
      .orderBy(asc(assessments.date));
  }

  async getCount() {
    const [result] = await this.db
      .select({ count: count() })
      .from(assessments);

    return result;
  }

  async create(assessmentData) {
    const [newAssessment] = await this.db
      .insert(assessments)
      .values(assessmentData)
      .returning();

    return await this.getById(newAssessment.id);
  }

  async update(id, assessmentData) {
    const [updatedAssessment] = await this.db
      .update(assessments)
      .set(assessmentData)
      .where(eq(assessments.id, id))
      .returning();

    return updatedAssessment;
  }

  async delete(id) {
    const [deletedAssessment] = await this.db
      .delete(assessments)
      .where(eq(assessments.id, id))
      .returning();

    return deletedAssessment;
  }

  async deleteAll() {
    const deletedAssessments = await this.db
      .delete(assessments)
      .returning();

    return {
      deletedCount: deletedAssessments.length,
      deletedAssessments: deletedAssessments
    };
  }

  async getTeacherAssignment(teacherId, subjectId, sectionId) {
    const [result] = await this.db
      .select()
      .from(teacherAssignments)
      .where(
        and(
          eq(teacherAssignments.teacherId, teacherId),
          eq(teacherAssignments.subjectId, subjectId),
          eq(teacherAssignments.sectionId, sectionId)
        )
      )
      .limit(1);

    return result;
  }

  async getAssessmentByParams(teacherId, subjectId, sectionId, assessmentTitle) {
    // First get the teacher assignment
    const teacherAssignment = await this.getTeacherAssignment(teacherId, subjectId, sectionId);

    if (!teacherAssignment) {
      return null;
    }

    // Then find the assessment by title and teacher assignment
    const [result] = await this.db
      .select()
      .from(assessments)
      .where(
        and(
          eq(assessments.teacherAssignmentId, teacherAssignment.id),
          eq(assessments.title, assessmentTitle)
        )
      )
      .limit(1);

    return result;
  }

  async checkAssessmentInUse(assessmentId) {
    const [result] = await this.db
      .select({ count: count() })
      .from(grades)
      .where(eq(grades.assessmentId, assessmentId));

    return result.count > 0;
  }

}