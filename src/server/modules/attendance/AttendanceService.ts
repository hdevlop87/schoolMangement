import { Injectable, t } from 'najm-api';
import { AttendanceRepository } from './AttendanceRepository';
import { AttendanceValidator } from './AttendanceValidator';

@Injectable()
export class AttendanceService {

  constructor(
    private attendanceRepository: AttendanceRepository,
    private attendanceValidator: AttendanceValidator,
  ) { }

  async getAll(filter) {
    return await this.attendanceRepository.getAll(filter);
  }

  async getById(id) {
    await this.attendanceValidator.checkExists(id);
    return await this.attendanceRepository.getById(id);
  }

  async getByDate(date) {
    return await this.attendanceRepository.getByDate(date);
  }

  async getBySection(sectionId) {
    await this.attendanceValidator.checkSectionExists(sectionId);
    return await this.attendanceRepository.getBySection(sectionId);
  }

  async getByStudent(studentId) {
    await this.attendanceValidator.checkStudentExists(studentId);
    return await this.attendanceRepository.getByStudent(studentId);
  }

  async getToday() {
    return await this.attendanceRepository.getToday();
  }

  async getTeacherAssignmentId({ teacherId, subjectId, sectionId }) {

    await this.attendanceValidator.checkTeacherAssignmentExists(teacherId, subjectId, sectionId);
    const assignment = await this.attendanceRepository.getTeacherAssignment(teacherId, subjectId, sectionId);
    return assignment.id
  }

  async mark(data, user) {

    const {
      studentId,
      subjectId,
      sectionId,
      teacherId,
      date,
      status,
      notes
    } = data;

    await this.attendanceValidator.checkStudentInSection(studentId, sectionId);
    await this.attendanceValidator.checkTeacherInSection(teacherId, sectionId);
    await this.attendanceValidator.checkSubjectExists(subjectId);
    const teacherAssignmentId = await this.getTeacherAssignmentId(data);

    await this.attendanceValidator.checkDuplicateAttendance(
      studentId,
      teacherAssignmentId,
      date
    );

    const attendanceDetails = {
      studentId,
      teacherAssignmentId,
      date,
      status,
      notes,
      markedBy: user.id,
    };

    const newAttendance = await this.attendanceRepository.create(attendanceDetails);

    return newAttendance;
  }

 async update(id, data) {
    await this.attendanceValidator.checkExists(id);
    const validatedData = await this.attendanceValidator.validateUpdateAttendance(data);
    const attendanceData: any = {};
    
    if (validatedData.status !== undefined) {
      attendanceData.status = validatedData.status; 
    }
    
    if (validatedData.notes !== undefined) {
      attendanceData.notes = validatedData.notes;
    }

    await this.attendanceRepository.update(id, attendanceData);

    return await this.getById(id);
  }

  async delete(id) {
    await this.attendanceValidator.checkExists(id);
    const deletedAttendance = await this.attendanceRepository.delete(id);
    return deletedAttendance;
  }

  async deleteAll() {
    return await this.attendanceRepository.deleteAll();
  }

  async seedDemo(attendanceData) {
    const createdAttendance = [];

    for (const attendance of attendanceData) {
      try {
        const attendanceEntity = await this.attendanceRepository.create(attendance);
        createdAttendance.push(attendanceEntity);
      } catch (error) {
        continue;
      }
    }

    return createdAttendance;
  }

}