// access-control/OwnershipRepository.ts
import { Repository } from 'najm-api';
import { DB } from '@/server/database/db';
import { students, teachers, parents, grades, classes, sections, teacherAssignments, studentParents, attendance } from '@/server/database/schema';
import { eq, inArray } from 'drizzle-orm';

@Repository()
export class OwnershipRepository {
    declare db: DB;

    // ============ STUDENT OWNERSHIP ============

    async getOwnStudentIds(userId: string): Promise<string[]> {
        const [student] = await this.db
            .select({ id: students.id })
            .from(students)
            .where(eq(students.userId, userId));
        return student ? [student.id] : [];
    }

    async getTeacherStudentIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: students.id })
            .from(teachers)
            .innerJoin(teacherAssignments, eq(teachers.id, teacherAssignments.teacherId))
            .innerJoin(students, eq(teacherAssignments.sectionId, students.sectionId))
            .where(eq(teachers.userId, userId));
        return ids.map(r => r.id);
    }

    async getParentStudentIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: students.id })
            .from(parents)
            .innerJoin(studentParents, eq(parents.id, studentParents.parentId))
            .innerJoin(students, eq(studentParents.studentId, students.id)) 
            .where(eq(parents.userId, userId));
        return ids.map(r => r.id);
    }

    // ============ TEACHER ACCESS ============ //

    async getOwnTeacherIds(userId: string): Promise<string[]> {
        const results = await this.db
            .select({ id: teachers.id })
            .from(teachers)
            .where(eq(teachers.userId, userId));
        return results.map(r => r.id);
    }

    // ============ PARENT ACCESS ============ //

    async getOwnParentIds(userId: string): Promise<string[]> {
        const results = await this.db
            .select({ id: parents.id })
            .from(parents)
            .where(eq(parents.userId, userId));
        return results.map(r => r.id);
    }

    async getTeacherParentIds(userId: string): Promise<string[]> {
        const results = await this.db
            .select({ id: parents.id })
            .from(teachers)
            .innerJoin(teacherAssignments, eq(teachers.id, teacherAssignments.teacherId))
            .innerJoin(students, eq(teacherAssignments.sectionId, students.sectionId))
            .innerJoin(studentParents, eq(students.id, studentParents.studentId))
            .innerJoin(parents, eq(studentParents.parentId, parents.id))
            .where(eq(teachers.userId, userId));
        return [...new Set(results.map(r => r.id))];
    }

    async getStudentParentIds(userId: string): Promise<string[]> {
        const results = await this.db
            .select({ id: parents.id })
            .from(students)
            .innerJoin(studentParents, eq(students.id, studentParents.studentId))
            .innerJoin(parents, eq(studentParents.parentId, parents.id))
            .where(eq(students.userId, userId));
        return results.map(r => r.id);
    }

    // ============ GRADE OWNERSHIP ============

    async getOwnGradeIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: grades.id })
            .from(grades)
            .innerJoin(students, eq(grades.studentId, students.id))
            .where(eq(students.userId, userId));
        return ids.map(r => r.id);
    }

    async getTeacherGradeIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: grades.id })
            .from(grades)
            .innerJoin(students, eq(grades.studentId, students.id))
            .innerJoin(teacherAssignments, eq(students.sectionId, teacherAssignments.sectionId))
            .innerJoin(teachers, eq(teacherAssignments.teacherId, teachers.id))
            .where(eq(teachers.userId, userId));
        return ids.map(r => r.id);
    }

    async getParentGradeIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: grades.id })
            .from(grades)
            .innerJoin(students, eq(grades.studentId, students.id))
            .innerJoin(studentParents, eq(students.id, studentParents.studentId))
            .innerJoin(parents, eq(studentParents.parentId, parents.id))
            .where(eq(parents.userId, userId));
        return ids.map(r => r.id);
    }

    // ============ CLASS OWNERSHIP ============

    async getStudentClassIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: classes.id })
            .from(classes)
            .innerJoin(students, eq(classes.id, students.classId))
            .where(eq(students.userId, userId));
        return ids.map(r => r.id);
    }

    async getTeacherClassIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: classes.id })
            .from(classes)
            .innerJoin(sections, eq(classes.id, sections.classId))
            .innerJoin(teacherAssignments, eq(sections.id, teacherAssignments.sectionId))
            .innerJoin(teachers, eq(teacherAssignments.teacherId, teachers.id))
            .where(eq(teachers.userId, userId))
            .groupBy(classes.id);
        return ids.map(r => r.id);
    }

    async getParentClassIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: classes.id })
            .from(classes)
            .innerJoin(students, eq(classes.id, students.classId))
            .innerJoin(studentParents, eq(students.id, studentParents.studentId))
            .innerJoin(parents, eq(studentParents.parentId, parents.id))
            .where(eq(parents.userId, userId))
            .groupBy(classes.id);
        return ids.map(r => r.id);
    }

    // ============ SECTION OWNERSHIP ============

    async getStudentSectionIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: sections.id })
            .from(sections)
            .innerJoin(students, eq(sections.id, students.sectionId))
            .where(eq(students.userId, userId));
        return ids.map(r => r.id);
    }

    async getTeacherSectionIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: sections.id })
            .from(sections)
            .innerJoin(teacherAssignments, eq(sections.id, teacherAssignments.sectionId))
            .innerJoin(teachers, eq(teacherAssignments.teacherId, teachers.id))
            .where(eq(teachers.userId, userId));
        return ids.map(r => r.id);
    }

    async getParentSectionIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: sections.id })
            .from(sections)
            .innerJoin(students, eq(sections.id, students.sectionId))
            .innerJoin(studentParents, eq(students.id, studentParents.studentId))
            .innerJoin(parents, eq(studentParents.parentId, parents.id))
            .where(eq(parents.userId, userId))
            .groupBy(sections.id);
        return ids.map(r => r.id);
    }

    // ============ ATTENDANCE OWNERSHIP ============

    async getOwnAttendanceIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: attendance.id })
            .from(attendance)
            .innerJoin(students, eq(attendance.studentId, students.id))
            .where(eq(students.userId, userId));
        return ids.map(r => r.id);
    }

    async getTeacherAttendanceIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: attendance.id })
            .from(attendance)
            .innerJoin(teacherAssignments, eq(attendance.teacherAssignmentId, teacherAssignments.id))
            .innerJoin(teachers, eq(teacherAssignments.teacherId, teachers.id))
            .where(eq(teachers.userId, userId));
        return ids.map(r => r.id);
    }

    async getParentAttendanceIds(userId: string): Promise<string[]> {
        const ids = await this.db
            .select({ id: attendance.id })
            .from(attendance)
            .innerJoin(students, eq(attendance.studentId, students.id))
            .innerJoin(studentParents, eq(students.id, studentParents.studentId))
            .innerJoin(parents, eq(studentParents.parentId, parents.id))
            .where(eq(parents.userId, userId));
        return ids.map(r => r.id);
    }

    // Add more resources as needed...
}