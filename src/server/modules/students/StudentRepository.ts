import { DB } from '@/server/database/db';
import { students, users, classes, sections, subjects, grades, assessments, attendance, parents, studentParents, teacherAssignments, teachers } from '@/server/database/schema';
import { Repository, t } from 'najm-api';
import { count, eq, desc, sql, and, isNotNull, sum, avg, inArray } from 'drizzle-orm';
import {
  studentSelect,
  classSelect,
  sectionSelect,
  gradeSelect,
  assessmentSelect,
  attendanceSelect,
  parentSelect,
  subjectSelect
} from '@/server/shared/selectDefinitions';

@Repository()
export class StudentRepository {

  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildStudentQuery() {
    return this.db
      .select({
        ...studentSelect,
        class: {
          id: classes.id,
          name: classes.name,
        },
        section: {
          id: sections.id,
          name: sections.name,
        }
      })
      .from(students)
      .leftJoin(users, eq(students.userId, users.id))
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(sections, eq(students.sectionId, sections.id));
  }

  // ========================================
  // ALL_METHODS
  // ========================================

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllStudents();
    }
    return await this.getByIds(filter);
  }

  private async getAllStudents() {
    return await this.buildStudentQuery()
      .orderBy(desc(students.createdAt));
  }

  private async getByIds(ids) {
    if (!ids || ids.length === 0) return [];
    return await this.buildStudentQuery()
      .where(inArray(students.id, ids))
      .orderBy(desc(students.createdAt));
  }

  async getById(id) {
    const [existingStudent] = await this.buildStudentQuery()
      .where(eq(students.id, id))
      .limit(1);

    if (!existingStudent) return null;
    return existingStudent;
  }

  async getByEmail(email) {
    const [existingStudent] = await this.buildStudentQuery()
      .where(eq(users.email, email))
      .limit(1);
    return existingStudent;
  }

  async getByPhone(phone) {
    const [existingStudent] = await this.buildStudentQuery()
      .where(eq(students.phone, phone))
      .limit(1);
    return existingStudent;
  }

  async getByStudentCode(studentCode) {
    const [existingStudent] = await this.buildStudentQuery()
      .where(eq(students.studentCode, studentCode))
      .limit(1);
    return existingStudent;
  }

  async create(data) {
    const [newStudent] = await this.db
      .insert(students)
      .values(data)
      .returning();
    return newStudent;
  }

  async update(id, data) {
    const [updatedStudent] = await this.db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return updatedStudent;
  }

  async delete(id) {
    const [deletedStudent] = await this.db
      .delete(students)
      .where(eq(students.id, id))
      .returning();

    if (deletedStudent?.userId) {
      await this.db
        .delete(users)
        .where(eq(users.id, deletedStudent.userId));
    }
    return deletedStudent;
  }

  async deleteAll() {
    const allStudents = await this.db
      .select({
        id: students.id,
        userId: students.userId
      })
      .from(students);

    const userIds = allStudents
      .map(student => student.userId)
      .filter(userId => userId !== null);

    const deletedStudents = await this.db
      .delete(students)
      .returning();

    if (userIds.length > 0) {
      await this.db
        .delete(users)
        .where(inArray(users.id, userIds));
    }

    return {
      deletedCount: deletedStudents.length,
      deletedStudents: deletedStudents
    };
  }

  // ========================================
  // COMMENTED - ADDITIONAL METHODS (Available on demand)
  // ========================================

  // async getCount() {
  //   const [studentsCount] = await this.db
  //     .select({ count: count() })
  //     .from(students);
  //   return studentsCount;
  // }

  // async getByStatus(status) {
  //   return await this.buildStudentQuery()
  //     .where(eq(students.status, status))
  //     .orderBy(desc(students.createdAt));
  // }

  // async getByClass(classId) {
  //   return await this.buildStudentQuery()
  //     .where(eq(students.classId, classId))
  //     .orderBy(students.name);
  // }

  // async getBySection(sectionId) {
  //   return await this.buildStudentQuery()
  //     .where(eq(students.sectionId, sectionId))
  //     .orderBy(students.name);
  // }





  // async getByTeacherId(teacherId) {
  //   return await this.buildStudentQuery()
  //     .innerJoin(teacherAssignments, eq(students.sectionId, teacherAssignments.sectionId))
  //     .where(
  //       and(
  //         eq(teacherAssignments.teacherId, teacherId),
  //         eq(students.status, 'active')
  //       )
  //     )
  //     .orderBy(students.name);
  // }

  // async getByParentId(parentId) {
  //   return await this.buildStudentQuery()
  //     .innerJoin(studentParents, eq(students.id, studentParents.studentId))
  //     .where(
  //       and(
  //         eq(studentParents.parentId, parentId),
  //         eq(students.status, 'active')
  //       )
  //     )
  //     .orderBy(students.name);
  // }

  // async getTodayAttendance(studentId) {
  //   const today = new Date().toISOString().split('T')[0];

  //   return await this.db
  //     .select({
  //       ...attendanceSelect,
  //       subject: subjectSelect,
  //       section: sectionSelect,
  //     })
  //     .from(attendance)
  //     .leftJoin(teacherAssignments, eq(attendance.teacherAssignmentId, teacherAssignments.id))
  //     .leftJoin(subjects, eq(teacherAssignments.subjectId, subjects.id))
  //     .leftJoin(sections, eq(teacherAssignments.sectionId, sections.id))
  //     .where(and(
  //       eq(attendance.studentId, studentId),
  //       eq(attendance.date, today)
  //     ))
  //     .orderBy(attendance.createdAt);
  // }

  // async getGradeAverage(studentId) {
  //   const [gradeData] = await this.db
  //     .select({
  //       averageGrade: avg(sql`(${grades.marksObtained} / ${assessments.totalMarks}) * 100`),
  //       totalGrades: count(grades.id),
  //     })
  //     .from(grades)
  //     .innerJoin(assessments, eq(grades.assessmentId, assessments.id))
  //     .where(
  //       and(
  //         eq(grades.studentId, studentId),
  //         isNotNull(grades.marksObtained)
  //       )
  //     );

  //   return {
  //     averageGrade: Number(gradeData.averageGrade) || 0,
  //     totalGrades: Number(gradeData.totalGrades) || 0,
  //   };
  // }

  // async getAttendanceStats(studentId) {
  //   const [attendanceData] = await this.db
  //     .select({
  //       totalClasses: count(attendance.id),
  //       presentClasses: sum(sql`CASE WHEN ${attendance.status} = 'present' THEN 1 ELSE 0 END`),
  //       absentClasses: sum(sql`CASE WHEN ${attendance.status} = 'absent' THEN 1 ELSE 0 END`),
  //       lateClasses: sum(sql`CASE WHEN ${attendance.status} = 'late' THEN 1 ELSE 0 END`),
  //     })
  //     .from(attendance)
  //     .where(eq(attendance.studentId, studentId));

  //   const totalClasses = Number(attendanceData.totalClasses) || 0;
  //   const presentClasses = Number(attendanceData.presentClasses) || 0;
  //   const absentClasses = Number(attendanceData.absentClasses) || 0;
  //   const lateClasses = Number(attendanceData.lateClasses) || 0;

  //   const attendanceRate = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  //   return {
  //     totalClasses,
  //     presentClasses,
  //     absentClasses,
  //     lateClasses,
  //     attendanceRate: Math.round(attendanceRate * 100) / 100,
  //   };
  // }

  // async getRecentGrades(studentId) {
  //   return await this.buildGradesQuery()
  //     .where(eq(grades.studentId, studentId))
  //     .orderBy(desc(grades.updatedAt))
  //     .limit(5);
  // }

  // async getRecentAttendance(studentId) {
  //   return await this.buildAttendanceQuery()
  //     .where(eq(attendance.studentId, studentId))
  //     .orderBy(desc(attendance.date))
  //     .limit(5);
  // }

  // async getAnalytics(studentId) {
  //   const gradeData = await this.getGradeAverage(studentId);
  //   const attendanceData = await this.getAttendanceStats(studentId);
  //   const classData = await this.getClassCount(studentId);

  //   // Get recent records
  //   const recentGrades = await this.getRecentGrades(studentId);
  //   const recentAttendance = await this.getRecentAttendance(studentId);

  //   return {
  //     // Academic performance
  //     averageGrade: gradeData.averageGrade,
  //     totalGrades: gradeData.totalGrades,

  //     // Attendance metrics
  //     attendanceRate: attendanceData.attendanceRate,
  //     totalClasses: attendanceData.totalClasses,
  //     presentClasses: attendanceData.presentClasses,
  //     absentClasses: attendanceData.absentClasses,
  //     lateClasses: attendanceData.lateClasses,

  //     // Class enrollment
  //     enrolledClasses: classData.totalClasses,
  //     activeClasses: classData.activeClasses,
  //     completedClasses: classData.completedClasses,

  //     // Recent records (5 most recent)
  //     recentGrades,
  //     recentAttendance,
  //   };
  // }

  // async getClassAndSection(studentId) {
  //   const [result] = await this.db
  //     .select({
  //       student: {
  //         id: students.id,
  //         classId: students.classId,
  //         sectionId: students.sectionId,
  //         enrollmentDate: students.enrollmentDate,
  //         status: students.status,
  //       },
  //       class: classSelect,
  //       section: sectionSelect,
  //     })
  //     .from(students)
  //     .leftJoin(classes, eq(students.classId, classes.id))
  //     .leftJoin(sections, eq(students.sectionId, sections.id))
  //     .where(eq(students.id, studentId))
  //     .limit(1);

  //   return result || null;
  // }

  // async getGrades(studentId) {
  //   return await this.buildGradesQuery()
  //     .where(eq(grades.studentId, studentId))
  //     .orderBy(desc(grades.updatedAt));
  // }

  // async getAttendance(studentId) {
  //   return await this.buildAttendanceQuery()
  //     .where(eq(attendance.studentId, studentId))
  //     .orderBy(desc(attendance.date));
  // }

  // async getAssessments(studentId) {
  //   return await this.db
  //     .select({
  //       ...assessmentSelect,
  //       subject: subjectSelect,
  //       section: sectionSelect,
  //       grade: gradeSelect,
  //     })
  //     .from(assessments)
  //     .innerJoin(teacherAssignments, eq(assessments.teacherAssignmentId, teacherAssignments.id))
  //     .innerJoin(subjects, eq(teacherAssignments.subjectId, subjects.id))
  //     .innerJoin(sections, eq(teacherAssignments.sectionId, sections.id))
  //     .innerJoin(students, eq(students.sectionId, sections.id))
  //     .leftJoin(grades, and(
  //       eq(grades.assessmentId, assessments.id),
  //       eq(grades.studentId, studentId)
  //     ))
  //     .where(eq(students.id, studentId))
  //     .orderBy(desc(assessments.date));
  // }

  //   async getClassCount(studentId) {
  //   const [student] = await this.db
  //     .select({
  //       classId: students.classId,
  //       sectionId: students.sectionId,
  //       status: students.status,
  //     })
  //     .from(students)
  //     .where(eq(students.id, studentId))
  //     .limit(1);

  //   if (!student) {
  //     return {
  //       totalClasses: 0,
  //       activeClasses: 0,
  //       completedClasses: 0,
  //     };
  //   }

  //   const [sectionData] = await this.db
  //     .select({
  //       sectionStatus: sections.status,
  //     })
  //     .from(sections)
  //     .where(eq(sections.id, student.sectionId))
  //     .limit(1);

  //   const isActive = sectionData?.sectionStatus === 'active';
  //   const isCompleted = student.status === 'graduated';

  //   return {
  //     totalClasses: 1,
  //     activeClasses: isActive ? 1 : 0,
  //     completedClasses: isCompleted ? 1 : 0,
  //   };
  // }

  // async countByClass(classId) {
  //   const [result] = await this.db
  //     .select({ count: count() })
  //     .from(students)
  //     .where(eq(students.classId, classId));
  //   return result.count;
  // }

  // async countBySection(sectionId) {
  //   const [result] = await this.db
  //     .select({ count: count() })
  //     .from(students)
  //     .where(eq(students.sectionId, sectionId));
  //   return result.count;
  // }

  // async getStudentsByGender() {
  //   const genderCounts = await this.db
  //     .select({
  //       gender: students.gender,
  //       count: count(students.id),
  //     })
  //     .from(students)
  //     .where(eq(students.status, 'active'))
  //     .groupBy(students.gender);

  //   return genderCounts
  //     .filter(item => item.gender === 'M' || item.gender === 'F')
  //     .map(item => ({
  //       name: item.gender === 'M' ? t('common.male') : t('common.female'),
  //       value: Number(item.count) || 0,
  //     }));
  // }

  //   private buildAttendanceQuery() {
  //   return this.db
  //     .select({
  //       ...attendanceSelect,
  //       subject: subjectSelect,
  //       section: sectionSelect,
  //     })
  //     .from(attendance)
  //     .leftJoin(teacherAssignments, eq(attendance.teacherAssignmentId, teacherAssignments.id))
  //     .leftJoin(subjects, eq(teacherAssignments.subjectId, subjects.id))
  //     .leftJoin(sections, eq(teacherAssignments.sectionId, sections.id));
  // }

  // private buildGradesQuery() {
  //   return this.db
  //     .select({
  //       ...gradeSelect,
  //       assessment: assessmentSelect,
  //     })
  //     .from(grades)
  //     .innerJoin(assessments, eq(grades.assessmentId, assessments.id));
  // }

  //   private async getParents(studentId) {
  //   return await this.db
  //     .select(parentSelect)
  //     .from(studentParents)
  //     .innerJoin(parents, eq(studentParents.parentId, parents.id))
  //     .leftJoin(users, eq(parents.userId, users.id))
  //     .where(eq(studentParents.studentId, studentId))
  //     .orderBy(parents.isEmergencyContact, parents.relationshipType);
  // }

}