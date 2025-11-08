import { DB } from '@/server/database/db';
import { teachers, users, teacherAssignments, sections, subjects, students, grades, assessments, attendance, classes } from '@/server/database/schema';
import { Repository } from 'najm-api';
import { count, eq, desc, sql, and, sum, inArray, or } from 'drizzle-orm';
import {
  teacherSelect,
  studentSelect,
  classSelect,
  sectionSelect,
  subjectSelect
} from '@/server/shared/selectDefinitions';

@Repository()
export class TeacherRepository {

  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildTeacherQuery() {
    return this.db
      .select({
        ...teacherSelect,
        assignments: sql<Array<{
          classId: string;
          sectionIds: string[];
          subjectIds: string[];
        }>>`
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'classId', class_id,
                'sectionIds', section_ids,
                'subjectIds', subject_ids
              )
            )
            FROM (
              SELECT 
                ${classes.id} as class_id,
                array_agg(DISTINCT ${sections.id}) as section_ids,
                array_agg(DISTINCT ${subjects.id}) as subject_ids
              FROM ${teacherAssignments}
              INNER JOIN ${sections} ON ${teacherAssignments.sectionId} = ${sections.id}
              INNER JOIN ${classes} ON ${sections.classId} = ${classes.id}
              INNER JOIN ${subjects} ON ${teacherAssignments.subjectId} = ${subjects.id}
              WHERE ${teacherAssignments.teacherId} = ${teachers.id}
              GROUP BY ${classes.id}
            ) grouped
          ),
          '[]'::json
        )
      `.as('assignments')
      })
      .from(teachers)
      .leftJoin(users, eq(teachers.userId, users.id));
  }

  // ========================================
  // GET / READ METHODS
  // ========================================

  async getCount() {
    const [teachersCount] = await this.db
      .select({ count: count() })
      .from(teachers);
    return teachersCount;
  }

  async getAll(filter) {
    if (filter === 'ALL') return await this.getAllTeachers();
    return await this.getByIds(filter);
  }

  async getAllTeachers() {
    return await this.buildTeacherQuery()
      .orderBy(desc(teachers.createdAt));
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];
    return await this.buildTeacherQuery()
      .where(inArray(teachers.id, ids))
      .orderBy(desc(teachers.createdAt));
  }

  async getById(id: string) {
    const [teacher] = await this.buildTeacherQuery()
      .where(eq(teachers.id, id))
      .limit(1);
    if (!teacher) return null;
    return teacher
  }

  async getByStatus(status) {
    return await this.buildTeacherQuery()
      .where(eq(teachers.status, status))
      .orderBy(desc(teachers.createdAt));
  }

  async getBySpecialization(specialization) {
    return await this.buildTeacherQuery()
      .where(eq(teachers.specialization, specialization))
      .orderBy(teachers.name);
  }

  async getByCin(cin) {
    const [existingTeacher] = await this.buildTeacherQuery()
      .where(eq(teachers.cin, cin))
      .limit(1);
    return existingTeacher;
  }

  async getByEmail(email) {
    const [existingTeacher] = await this.buildTeacherQuery()
      .where(eq(users.email, email))
      .limit(1);
    return existingTeacher;
  }

  async getByPhone(phone) {
    const [existingTeacher] = await this.buildTeacherQuery()
      .where(eq(teachers.phone, phone))
      .limit(1);
    return existingTeacher;
  }

  async getStudents(teacherId) {
    return await this.db
      .select(studentSelect)
      .from(teacherAssignments)
      .innerJoin(sections, eq(teacherAssignments.sectionId, sections.id))
      .innerJoin(students, eq(sections.id, students.sectionId))
      .leftJoin(users, eq(students.userId, users.id))
      .where(
        and(
          eq(teacherAssignments.teacherId, teacherId),
          eq(students.status, 'active')
        )
      )
      .orderBy(students.name);
  }

  async getClasses(teacherId) {
    return await this.db
      .select({
        ...classSelect,
        section: sectionSelect,
        subject: subjectSelect,
      })
      .from(teacherAssignments)
      .innerJoin(sections, eq(teacherAssignments.sectionId, sections.id))
      .innerJoin(classes, eq(sections.classId, classes.id))
      .innerJoin(subjects, eq(teacherAssignments.subjectId, subjects.id))
      .where(eq(teacherAssignments.teacherId, teacherId))
      .orderBy(classes.name, sections.name, subjects.name);
  }

  async getTeacherAssignment(teacherId, subjectId, sectionId) {
    const [assignment] = await this.db
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

    return assignment;
  }

  async getTeacherAssignmentById(assignmentId) {
    const [assignment] = await this.db
      .select()
      .from(teacherAssignments)
      .where(eq(teacherAssignments.id, assignmentId))
      .limit(1);

    return assignment;
  }

  // ========================================
  // CREATE_METHODS
  // ========================================

  async create(data) {
    const [newTeacher] = await this.db
      .insert(teachers)
      .values(data)
      .returning();
    return newTeacher;
  }

  async createAssignment(data) {
    const [assignment] = await this.db
      .insert(teacherAssignments)
      .values(data)
      .returning();
    return assignment;
  }

  // ========================================
  // UPDATE_METHODS
  // ========================================

  async update(id, data) {
    const [updatedTeacher] = await this.db
      .update(teachers)
      .set(data)
      .where(eq(teachers.id, id))
      .returning();
    return updatedTeacher;
  }

  // ========================================
  // DELETE_METHODS
  // ========================================

  async delete(id) {
    const [deletedTeacher] = await this.db
      .delete(teachers)
      .where(eq(teachers.id, id))
      .returning();

    if (deletedTeacher?.userId) {
      await this.db
        .delete(users)
        .where(eq(users.id, deletedTeacher.userId));
    }
    return deletedTeacher;
  }

  async deleteAll() {
    const allTeachers = await this.buildTeacherQuery()
      .orderBy(desc(teachers.createdAt));

    const userIds = allTeachers
      .map(teacher => teacher.userId)
      .filter(userId => userId !== null);

    const deletedTeachers = await this.db
      .delete(teachers)
      .returning();

    let deletedUsers = [];

    if (userIds.length > 0) {
      deletedUsers = await this.db
        .delete(users)
        .where(inArray(users.id, userIds))
        .returning();
    }

    return {
      deletedCount: deletedTeachers.length,
      deletedTeachers: deletedTeachers
    };
  }

  // ========================================
  // VALIDATION_HELPERS
  // ========================================
  async checkInSection(teacherId, sectionId) {
    const [result] = await this.db
      .select({ id: teacherAssignments.id })
      .from(teacherAssignments)
      .where(
        and(
          eq(teacherAssignments.teacherId, teacherId),
          eq(teacherAssignments.sectionId, sectionId)
        )
      )
      .limit(1);

    return !!result;
  }
}