import { Injectable } from 'najm-api';
import { ExamRepository } from './ExamRepository';
import { ExamValidator } from './ExamValidator';

@Injectable()
export class ExamService {

  constructor(
    private examRepository: ExamRepository,
    private examValidator: ExamValidator,
  ) { }

  async getAll(filter) {
    return await this.examRepository.getAll(filter);
  }

  async getById(id) {
    await this.examValidator.checkExists(id);
    return await this.examRepository.getById(id);
  }

  async getBySection(sectionId) {
    await this.examValidator.checkSectionExists(sectionId);
    return await this.examRepository.getBySection(sectionId);
  }

  async getBySubject(subjectId) {
    await this.examValidator.checkSubjectExists(subjectId);
    return await this.examRepository.getBySubject(subjectId);
  }

  async getByTeacher(teacherId) {
    await this.examValidator.checkTeacherExists(teacherId);
    return await this.examRepository.getByTeacher(teacherId);
  }

  async getTodayExams() {
    return await this.examRepository.getTodayExams();
  }

  async getUpcomingExams() {
    return await this.examRepository.getUpcomingExams();
  }

  async getTeacherAssignmentId({ teacherId, subjectId, sectionId }) {
    await this.examValidator.checkTeacherAssignmentExists(teacherId, subjectId, sectionId);
    const assignment = await this.examRepository.getTeacherAssignment(teacherId, subjectId, sectionId);
    return assignment.id;
  }

  async create(data) {
    const {
      title,
      description,
      type,
      sectionId,
      subjectId,
      teacherId,
      date,
      startTime,
      endTime,
      duration,
      totalMarks,
      passingMarks,
      roomNumber,
      allowedMaterials,
      instructions,
      status,
    } = data;

    await this.examValidator.checkTeacherInSection(teacherId, sectionId);
    await this.examValidator.checkSubjectExists(subjectId);
    const teacherAssignmentId = await this.getTeacherAssignmentId(data);


    const examDetails = {
      title,
      description,
      type,
      teacherAssignmentId,
      date,
      startTime,
      endTime,
      duration,
      totalMarks,
      passingMarks,
      roomNumber,
      allowedMaterials,
      instructions,
      status,
    };

    await this.examValidator.validateCreateSchema(examDetails);
    const newExam = await this.examRepository.create(examDetails);

    return newExam;
  }

  async update(id, data) {
    await this.examValidator.checkExists(id);

    const examData: any = {};

    if (data.title !== undefined) examData.title = data.title;
    if (data.description !== undefined) examData.description = data.description;
    if (data.type !== undefined) examData.type = data.type;
    if (data.date !== undefined) examData.date = data.date;
    if (data.startTime !== undefined) examData.startTime = data.startTime;
    if (data.endTime !== undefined) examData.endTime = data.endTime;
    if (data.duration !== undefined) examData.duration = data.duration;
    if (data.totalMarks !== undefined) examData.totalMarks = data.totalMarks;
    if (data.passingMarks !== undefined) examData.passingMarks = data.passingMarks;
    if (data.roomNumber !== undefined) examData.roomNumber = data.roomNumber;
    if (data.allowedMaterials !== undefined) examData.allowedMaterials = data.allowedMaterials;
    if (data.instructions !== undefined) examData.instructions = data.instructions;
    if (data.status !== undefined) examData.status = data.status;

    // If updating teacher assignment via sectionId/subjectId/teacherId
    if (data.sectionId || data.subjectId || data.teacherId) {
      const { sectionId, subjectId, teacherId } = data;

      if (sectionId) await this.examValidator.checkSectionExists(sectionId);
      if (subjectId) await this.examValidator.checkSubjectExists(subjectId);
      if (teacherId) await this.examValidator.checkTeacherExists(teacherId);

      if (sectionId && subjectId && teacherId) {
        await this.examValidator.checkTeacherInSection(teacherId, sectionId);
        const teacherAssignmentId = await this.getTeacherAssignmentId({ teacherId, subjectId, sectionId });
        examData.teacherAssignmentId = teacherAssignmentId;
      }
    }

    if (Object.keys(examData).length > 0) {
      await this.examRepository.update(id, examData);
    }

    return await this.getById(id);
  }

  async delete(id) {
    await this.examValidator.checkExists(id);
    await this.examValidator.checkNotInUse(id);
    const deletedExam = await this.examRepository.delete(id);
    return deletedExam;
  }

  async deleteAll() {
    return await this.examRepository.deleteAll();
  }

  async seedDemoExams(examsData) {
    const createdExams = [];

    for (const examData of examsData) {
      try {
        const examEntity = await this.examRepository.create(examData);
        createdExams.push(examEntity);
      } catch (error) {
        continue;
      }
    }

    return createdExams;
  }

}
