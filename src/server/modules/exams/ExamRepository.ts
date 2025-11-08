import { Repository } from 'najm-api';
import { and, desc, eq, sql, asc, count } from 'drizzle-orm';
import { exams, grades, students, teacherAssignments, teachers, subjects, classes, sections, users } from '@/server/database/schema';
import { DB } from '@/server/database/db';
import {
  subjectSelect,
  teacherSelect,
  classSelect,
  sectionSelect
} from '@/server/shared/selectDefinitions';
import { alias } from 'drizzle-orm/pg-core';

@Repository()
export class ExamRepository {
  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildExamQuery() {
    const teacherUsers = alias(users, 'teacher_users');

    return this.db
      .select({
        id: exams.id,
        teacherAssignmentId: exams.teacherAssignmentId,
        title: exams.title,
        description: exams.description,
        type: exams.type,
        date: exams.date,
        startTime: exams.startTime,
        endTime: exams.endTime,
        duration: exams.duration,
        totalMarks: exams.totalMarks,
        passingMarks: exams.passingMarks,
        roomNumber: exams.roomNumber,
        instructions: exams.instructions,
        status: exams.status,
        createdAt: exams.createdAt,
        updatedAt: exams.updatedAt,
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
      .from(exams)
      .leftJoin(teacherAssignments, eq(exams.teacherAssignmentId, teacherAssignments.id))
      .leftJoin(subjects, eq(teacherAssignments.subjectId, subjects.id))
      .leftJoin(teachers, eq(teacherAssignments.teacherId, teachers.id))
      .leftJoin(teacherUsers, eq(teachers.userId, teacherUsers.id))
      .leftJoin(sections, eq(teacherAssignments.sectionId, sections.id))
      .leftJoin(classes, eq(sections.classId, classes.id));
  }

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllExams();
    }
    return await this.getByIds(filter);
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildExamQuery()
      .where(sql`${exams.id} = ANY(${ids})`)
      .orderBy(desc(exams.date));
  }

  async getAllExams() {
    return await this.buildExamQuery()
      .orderBy(desc(exams.date));
  }

  async getById(id) {
    const [result] = await this.buildExamQuery()
      .where(eq(exams.id, id))
      .limit(1);

    return result;
  }

  async getByType(type) {
    return await this.buildExamQuery()
      .where(eq(exams.type, type))
      .orderBy(desc(exams.date));
  }

  async getByStatus(status) {
    return await this.buildExamQuery()
      .where(eq(exams.status, status))
      .orderBy(desc(exams.date));
  }

  async getBySection(sectionId) {
    return await this.buildExamQuery()
      .where(eq(teacherAssignments.sectionId, sectionId))
      .orderBy(desc(exams.date));
  }

  async getByTeacherAssignment(teacherAssignmentId) {
    return await this.buildExamQuery()
      .where(eq(exams.teacherAssignmentId, teacherAssignmentId))
      .orderBy(desc(exams.date));
  }

  async getBySubject(subjectId) {
    return await this.buildExamQuery()
      .where(eq(teacherAssignments.subjectId, subjectId))
      .orderBy(desc(exams.date));
  }

  async getByTeacher(teacherId) {
    return await this.buildExamQuery()
      .where(eq(teacherAssignments.teacherId, teacherId))
      .orderBy(desc(exams.date));
  }

  async getTodayExams() {
    const today = new Date().toISOString().split('T')[0];
    return await this.buildExamQuery()
      .where(eq(exams.date, today))
      .orderBy(asc(exams.startTime));
  }

  async getUpcomingExams() {
    const today = new Date().toISOString().split('T')[0];
    return await this.buildExamQuery()
      .where(sql`${exams.date} >= ${today}`)
      .orderBy(asc(exams.date), asc(exams.startTime));
  }

  async getCount() {
    const [result] = await this.db
      .select({ count: count() })
      .from(exams);

    return result;
  }

  async create(examData) {
    const [newExam] = await this.db
      .insert(exams)
      .values(examData)
      .returning();

    return await this.getById(newExam.id);
  }

  async update(id, examData) {
    const [updatedExam] = await this.db
      .update(exams)
      .set(examData)
      .where(eq(exams.id, id))
      .returning();

    return updatedExam;
  }

  async delete(id) {
    const [deletedExam] = await this.db
      .delete(exams)
      .where(eq(exams.id, id))
      .returning();

    return deletedExam;
  }

  async deleteAll() {
    const deletedExams = await this.db
      .delete(exams)
      .returning();

    return {
      deletedCount: deletedExams.length,
      deletedExams: deletedExams
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

  async getExamByParams(teacherId, subjectId, sectionId, examTitle) {
    // First get the teacher assignment
    const teacherAssignment = await this.getTeacherAssignment(teacherId, subjectId, sectionId);

    if (!teacherAssignment) {
      return null;
    }

    // Then find the exam by title and teacher assignment
    const [result] = await this.db
      .select()
      .from(exams)
      .where(
        and(
          eq(exams.teacherAssignmentId, teacherAssignment.id),
          eq(exams.title, examTitle)
        )
      )
      .limit(1);

    return result;
  }

  async checkExamInUse(examId) {
    const [result] = await this.db
      .select({ count: count() })
      .from(grades)
      .where(eq(grades.examId, examId));

    return result.count > 0;
  }

}