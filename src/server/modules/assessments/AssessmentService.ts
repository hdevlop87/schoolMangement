import { Injectable } from 'najm-api';
import { AssessmentRepository } from './AssessmentRepository';
import { AssessmentValidator } from './AssessmentValidator';

@Injectable()
export class AssessmentService {

  constructor(
    private assessmentRepository: AssessmentRepository,
    private assessmentValidator: AssessmentValidator,
  ) { }

  async getAll(filter) {
    return await this.assessmentRepository.getAll(filter);
  }

  async getById(id) {
    await this.assessmentValidator.checkExists(id);
    return await this.assessmentRepository.getById(id);
  }

  async getBySection(sectionId) {
    await this.assessmentValidator.checkSectionExists(sectionId);
    return await this.assessmentRepository.getBySection(sectionId);
  }

  async getBySubject(subjectId) {
    await this.assessmentValidator.checkSubjectExists(subjectId);
    return await this.assessmentRepository.getBySubject(subjectId);
  }

  async getByTeacher(teacherId) {
    await this.assessmentValidator.checkTeacherExists(teacherId);
    return await this.assessmentRepository.getByTeacher(teacherId);
  }

  async getTodayAssessments() {
    return await this.assessmentRepository.getTodayAssessments();
  }

  async getTeacherAssignmentId({ teacherId, subjectId, sectionId }) {
    await this.assessmentValidator.checkTeacherAssignmentExists(teacherId, subjectId, sectionId);
    const assignment = await this.assessmentRepository.getTeacherAssignment(teacherId, subjectId, sectionId);
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
      duration,
      totalMarks,
      passingMarks,
      instructions,
      status,
    } = data;

    await this.assessmentValidator.checkTeacherInSection(teacherId, sectionId);
    await this.assessmentValidator.checkSubjectExists(subjectId);
    const teacherAssignmentId = await this.getTeacherAssignmentId(data);


    const assessmentDetails = {
      title,
      description,
      type,
      teacherAssignmentId,
      date,
      duration,
      totalMarks,
      passingMarks,
      instructions,
      status,
    };

    await this.assessmentValidator.validateCreateSchema(assessmentDetails);
    const newAssessment = await this.assessmentRepository.create(assessmentDetails);

    return newAssessment;
  }

  async update(id, data) {
    await this.assessmentValidator.checkExists(id);

    const assessmentData: any = {};

    if (data.title !== undefined) assessmentData.title = data.title;
    if (data.description !== undefined) assessmentData.description = data.description;
    if (data.type !== undefined) assessmentData.type = data.type;
    if (data.date !== undefined) assessmentData.date = data.date;
    if (data.duration !== undefined) assessmentData.duration = data.duration;
    if (data.totalMarks !== undefined) assessmentData.totalMarks = data.totalMarks;
    if (data.passingMarks !== undefined) assessmentData.passingMarks = data.passingMarks;
    if (data.instructions !== undefined) assessmentData.instructions = data.instructions;
    if (data.status !== undefined) assessmentData.status = data.status;

    // If updating teacher assignment via sectionId/subjectId/teacherId
    if (data.sectionId || data.subjectId || data.teacherId) {
      const { sectionId, subjectId, teacherId } = data;

      if (sectionId) await this.assessmentValidator.checkSectionExists(sectionId);
      if (subjectId) await this.assessmentValidator.checkSubjectExists(subjectId);
      if (teacherId) await this.assessmentValidator.checkTeacherExists(teacherId);

      if (sectionId && subjectId && teacherId) {
        await this.assessmentValidator.checkTeacherInSection(teacherId, sectionId);
        const teacherAssignmentId = await this.getTeacherAssignmentId({ teacherId, subjectId, sectionId });
        assessmentData.teacherAssignmentId = teacherAssignmentId;
      }
    }

    if (Object.keys(assessmentData).length > 0) {
      await this.assessmentRepository.update(id, assessmentData);
    }

    return await this.getById(id);
  }

  async delete(id) {
    await this.assessmentValidator.checkExists(id);
    await this.assessmentValidator.checkNotInUse(id);
    const deletedAssessment = await this.assessmentRepository.delete(id);
    return deletedAssessment;
  }

  async deleteAll() {
    return await this.assessmentRepository.deleteAll();
  }

  async seedDemoAssessments(assessmentsData) {
    const createdAssessments = [];

    for (const assessmentData of assessmentsData) {
      try {
        const assessmentEntity = await this.assessmentRepository.create(assessmentData);
        createdAssessments.push(assessmentEntity);
      } catch (error) {
        continue;
      }
    }

    return createdAssessments;
  }

}