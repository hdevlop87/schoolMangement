import { Repository } from 'najm-api';
import { DB } from '@/server/database/db';
import { sections, classes, students, teacherAssignments, teachers, users, studentParents, parents } from '@/server/database/schema';
import { eq, count, and, inArray } from 'drizzle-orm';
import { sectionSelect, classSelect, teacherSelect, parentSelect } from '@/server/shared/selectDefinitions';

@Repository()
export class SectionRepository {
  db: DB;
  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildSectionQuery() {
    return this.db
      .select({
        ...sectionSelect,
        class: classSelect,
      })
      .from(sections)
      .innerJoin(classes, eq(sections.classId, classes.id));
  }

  // ============ GET ALL METHODS ============ //

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllSections();
    }
    return await this.getByIds(filter);
  }

  async getAllSections() {
    return await this.buildSectionQuery()
      .orderBy(classes.createdAt, classes.name, sections.name);
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildSectionQuery()
      .where(inArray(sections.id, ids))
      .orderBy(classes.academicYear, classes.name, sections.name);
  }

  async getById(id) {
    const [result] = await this.buildSectionQuery()
      .where(eq(sections.id, id))
      .limit(1);
    return result;
  }

  async getByClass(classId) {
    return await this.db
      .select(sectionSelect)
      .from(sections)
      .where(eq(sections.classId, classId))
      .orderBy(sections.name);
  }

  async getByTeacherId(teacherId) {
    return await this.buildSectionQuery()
      .innerJoin(teacherAssignments, eq(sections.id, teacherAssignments.sectionId))
      .where(eq(teacherAssignments.teacherId, teacherId))
      .orderBy(classes.academicYear, classes.name, sections.name);
  }

  async getStudents(sectionId) {
    return await this.db
      .select({
        id: students.id,
        studentCode: students.studentCode,
        name: students.name,
        email: students.email,
        status: students.status,
        enrollmentDate: students.enrollmentDate,
      })
      .from(students)
      .where(eq(students.sectionId, sectionId))
      .orderBy(students.name);
  }

  async getAnalytics(sectionId) {
    // Get total students count
    const [studentsCount] = await this.db
      .select({ count: count() })
      .from(students)
      .where(eq(students.sectionId, sectionId));

    // Get active students count
    const [activeStudentsCount] = await this.db
      .select({ count: count() })
      .from(students)
      .where(and(
        eq(students.sectionId, sectionId),
        eq(students.status, 'active')
      ));

    // Get section capacity
    const [sectionInfo] = await this.db
      .select({
        maxStudents: sections.maxStudents,
      })
      .from(sections)
      .where(eq(sections.id, sectionId))
      .limit(1);

    const utilizationRate = sectionInfo?.maxStudents > 0
      ? (studentsCount.count / sectionInfo.maxStudents) * 100
      : 0;

    return {
      totalStudents: studentsCount.count || 0,
      activeStudents: activeStudentsCount.count || 0,
      maxStudents: sectionInfo?.maxStudents || 0,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
    };
  }

  async getClasses(sectionId) {
    const [result] = await this.db
      .select(classSelect)
      .from(classes)
      .innerJoin(sections, eq(sections.classId, classes.id))
      .where(eq(sections.id, sectionId))
      .limit(1);
    return result;
  }

  async getTeachers(sectionId) {
    return await this.db
      .select({
        ...teacherSelect,
        subjectId: teacherAssignments.subjectId,
      })
      .from(teachers)
      .innerJoin(users, eq(teachers.userId, users.id))
      .innerJoin(teacherAssignments, eq(teachers.id, teacherAssignments.teacherId))
      .where(eq(teacherAssignments.sectionId, sectionId))
      .orderBy(teachers.name);
  }

  async getParents(sectionId) {
    return await this.db
      .select({
        ...parentSelect,
        studentId: studentParents.studentId,
      })
      .from(parents)
      .leftJoin(users, eq(parents.userId, users.id))
      .innerJoin(studentParents, eq(parents.id, studentParents.parentId))
      .innerJoin(students, eq(studentParents.studentId, students.id))
      .where(eq(students.sectionId, sectionId))
      .orderBy(parents.name);
  }

  async create(data) {
    const [newSection] = await this.db
      .insert(sections)
      .values(data)
      .returning();
    return newSection;
  }

  async update(id, data) {
    const [updatedSection] = await this.db
      .update(sections)
      .set(data)
      .where(eq(sections.id, id))
      .returning();
    return updatedSection;
  }

  async delete(id) {
    const [deletedSection] = await this.db
      .delete(sections)
      .where(eq(sections.id, id))
      .returning();
    return deletedSection;
  }

  async deleteAll() {
    const deletedSections = await this.db
      .delete(sections)
      .returning();
    return {
      deletedCount: deletedSections.length,
      deletedSections: deletedSections
    };
  }

  async checkHasStudents(sectionId) {
    const [result] = await this.db
      .select({ count: count() })
      .from(students)
      .where(eq(students.sectionId, sectionId))
      .limit(1);
    return result.count > 0;
  }

  async checkNameExistsInClass(classId, name, excludeId?) {
    let query = this.db
      .select({ id: sections.id })
      .from(sections)
      .where(and(
        eq(sections.classId, classId),
        eq(sections.name, name)
      ));

    if (excludeId) {
      query = this.db
        .select({ id: sections.id })
        .from(sections)
        .where(and(
          eq(sections.classId, classId),
          eq(sections.name, name),
        ));
    }

    const [result] = await query.limit(1);

    if (excludeId && result && result.id === excludeId) {
      return false; 
    }

    return !!result;
  }
}