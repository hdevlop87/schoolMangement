import { Repository } from 'najm-api';
import { and, desc, eq, sql, asc, count } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { grades, students, assessments, teacherAssignments, subjects, teachers, classes, sections, users } from '@/server/database/schema';
import { DB } from '@/server/database/db';
import {gradeSelect} from '@/server/shared/selectDefinitions';

@Repository()
export class GradeRepository {
  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildGradeQuery() {
    const studentUsers = alias(users, 'student_users');
    const teacherUsers = alias(users, 'teacher_users');
    const gradedByUsers = alias(users, 'graded_by_users');

    return this.db
      .select({
        ...gradeSelect,
        student: {
          id: students.id,
          studentCode: students.studentCode,
          name: students.name,
          image: studentUsers.image,
        },
        assessment: {
          id: assessments.id,
          title: assessments.title,
          type: assessments.type,
          date: assessments.date,
          totalMarks: assessments.totalMarks,
          passingMarks: assessments.passingMarks,
        },
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
        gradedByUser: {
          id: gradedByUsers.id,
          email: gradedByUsers.email,
          image: gradedByUsers.image,
        },
      })
      .from(grades)
      .leftJoin(students, eq(grades.studentId, students.id))
      .leftJoin(studentUsers, eq(students.userId, studentUsers.id))
      .leftJoin(assessments, eq(grades.assessmentId, assessments.id))
      .leftJoin(teacherAssignments, eq(assessments.teacherAssignmentId, teacherAssignments.id))
      .leftJoin(subjects, eq(teacherAssignments.subjectId, subjects.id))
      .leftJoin(teachers, eq(teacherAssignments.teacherId, teachers.id))
      .leftJoin(teacherUsers, eq(teachers.userId, teacherUsers.id))
      .leftJoin(sections, eq(teacherAssignments.sectionId, sections.id))
      .leftJoin(classes, eq(sections.classId, classes.id))
      .leftJoin(gradedByUsers, eq(grades.gradedBy, gradedByUsers.id));
  }

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllGrades();
    }
    return await this.getByIds(filter);
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildGradeQuery()
      .where(sql`${grades.id} = ANY(${ids})`)
      .orderBy(desc(grades.createdAt));
  }

  async getAllGrades() {
    return await this.buildGradeQuery()
      .orderBy(desc(grades.createdAt));
  }

  async getById(id) {
    const [result] = await this.buildGradeQuery()
      .where(eq(grades.id, id))
      .limit(1);

    return result;
  }

  async getByAssessment(assessmentId) {
    return await this.buildGradeQuery()
      .where(eq(grades.assessmentId, assessmentId))
      .orderBy(asc(students.name));
  }

  async getByStudent(studentId) {
    return await this.buildGradeQuery()
      .where(eq(grades.studentId, studentId))
      .orderBy(desc(assessments.date));
  }

  async getBySection(sectionId) {
    return await this.buildGradeQuery()
      .where(eq(teacherAssignments.sectionId, sectionId))
      .orderBy(desc(assessments.date), asc(students.name));
  }

  async getByTeacherAssignment(teacherAssignmentId) {
    return await this.buildGradeQuery()
      .where(eq(assessments.teacherAssignmentId, teacherAssignmentId))
      .orderBy(desc(assessments.date), asc(students.name));
  }

  async getBySubject(subjectId) {
    return await this.buildGradeQuery()
      .where(eq(teacherAssignments.subjectId, subjectId))
      .orderBy(desc(assessments.date), asc(students.name));
  }

  async getByTeacher(teacherId) {
    return await this.buildGradeQuery()
      .where(eq(teacherAssignments.teacherId, teacherId))
      .orderBy(desc(assessments.date), asc(students.name));
  }

  async getCount() {
    const [result] = await this.db
      .select({ count: count() })
      .from(grades);

    return result;
  }

  async create(gradeData) {
    const [newGrade] = await this.db
      .insert(grades)
      .values(gradeData)
      .returning();
    return newGrade;
  }

  async update(id, gradeData) {
    const [updatedGrade] = await this.db
      .update(grades)
      .set(gradeData)
      .where(eq(grades.id, id))
      .returning();

    return updatedGrade;
  }

  async delete(id) {
    const [deletedGrade] = await this.db
      .delete(grades)
      .where(eq(grades.id, id))
      .returning();

    return deletedGrade;
  }

  async deleteAll() {
    const deletedGrades = await this.db
      .delete(grades)
      .returning();

    return {
      deletedCount: deletedGrades.length,
      deletedGrades: deletedGrades
    };
  }

  async checkGradeExists(studentId, assessmentId) {
    const [existing] = await this.db
      .select()
      .from(grades)
      .where(and(
        eq(grades.studentId, studentId),
        eq(grades.assessmentId, assessmentId)
      ))
      .limit(1);

    return existing;
  }

}