import { Repository } from 'najm-api';
import { and, desc, eq, sql, asc, gte, lte, count, avg } from 'drizzle-orm';
import { attendance, students, teacherAssignments, teachers, subjects, classes, sections, users } from '@/server/database/schema';
import { DB } from '@/server/database/db';
import {
  attendanceSelect,
  studentSelect,
  subjectSelect,
  teacherSelect,
  classSelect,
  sectionSelect
} from '@/server/shared/selectDefinitions';
import { alias } from 'drizzle-orm/pg-core';

@Repository()
export class AttendanceRepository {
  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildAttendanceQuery() {
    const studentUsers = alias(users, 'student_users');
    const teacherUsers = alias(users, 'teacher_users');
    const markedByUsers = alias(users, 'marked_by_users');

    return this.db
      .select({
        ...attendanceSelect,
        student: {
          id: students.id,
          studentCode: students.studentCode,
          name: students.name,
          image: studentUsers.image,
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
        markedByUser: {
          id: markedByUsers.id,
          email: markedByUsers.email,
          image: markedByUsers.image,
        },
      })
      .from(attendance)
      .leftJoin(students, eq(attendance.studentId, students.id))
      .leftJoin(studentUsers, eq(students.userId, studentUsers.id))
      .leftJoin(teacherAssignments, eq(attendance.teacherAssignmentId, teacherAssignments.id))
      .leftJoin(teachers, eq(teacherAssignments.teacherId, teachers.id))
      .leftJoin(teacherUsers, eq(teachers.userId, teacherUsers.id))
      .leftJoin(sections, eq(teacherAssignments.sectionId, sections.id))
      .leftJoin(subjects, eq(teacherAssignments.subjectId, subjects.id))
      .leftJoin(classes, eq(sections.classId, classes.id))
      .leftJoin(markedByUsers, eq(attendance.markedBy, markedByUsers.id));
  }

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllAttendance();
    }
    return await this.getByIds(filter);
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildAttendanceQuery()
      .where(sql`${attendance.id} = ANY(${ids})`)
      .orderBy(desc(attendance.createdAt));
  }

  async getAllAttendance() {
    return await this.buildAttendanceQuery()
      .orderBy(desc(attendance.createdAt));
  }

  async getById(id) {
    const [result] = await this.buildAttendanceQuery()
      .where(eq(attendance.id, id))
      .limit(1);

    return result;
  }

  async getByDate(date) {
    return await this.buildAttendanceQuery()
      .where(eq(attendance.date, date))
      .orderBy(asc(classes.name), asc(sections.name), asc(students.name));
  }

  async getBySection(sectionId) {
    return await this.buildAttendanceQuery()
      .where(eq(teacherAssignments.sectionId, sectionId))
      .orderBy(desc(attendance.date), asc(students.name));
  }

  async getByStudent(studentId) {
    return await this.buildAttendanceQuery()
      .where(eq(attendance.studentId, studentId))
      .orderBy(desc(attendance.date));
  }

  async getByTeacherId(teacherId) {
    return await this.buildAttendanceQuery()
      .where(eq(teacherAssignments.teacherId, teacherId))
      .orderBy(desc(attendance.date), asc(students.name));
  }

  async getToday() {
    const today = new Date().toISOString().split('T')[0];
    return await this.getByDate(today);
  }

  async create(attendanceData) {
    const [newAttendance] = await this.db
      .insert(attendance)
      .values(attendanceData)
      .returning();

    return await this.getById(newAttendance.id);
  }

  async update(id, attendanceData) {
    const [updatedAttendance] = await this.db
      .update(attendance)
      .set(attendanceData)
      .where(eq(attendance.id, id))
      .returning();

    return updatedAttendance;
  }

  async delete(id) {
    const [deletedAttendance] = await this.db
      .delete(attendance)
      .where(eq(attendance.id, id))
      .returning();

    return deletedAttendance;
  }

  async deleteAll() {
    const deletedAttendance = await this.db
      .delete(attendance)
      .returning();

    return {
      deletedCount: deletedAttendance.length,
      deletedAttendance: deletedAttendance
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

  async checkDuplicateAttendance(studentId, teacherAssignmentId, date) {
    const [existing] = await this.db
      .select()
      .from(attendance)
      .where(and(
        eq(attendance.studentId, studentId),
        eq(attendance.teacherAssignmentId, teacherAssignmentId),
        eq(attendance.date, date)
      ))
      .limit(1);

    return existing;
  }

}