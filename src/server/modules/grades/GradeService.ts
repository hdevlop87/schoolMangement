import { Injectable, t } from 'najm-api';
import { GradeRepository } from './GradeRepository';
import { GradeValidator } from './GradeValidator';
import { AssessmentRepository } from '../assessments/AssessmentRepository';

@Injectable()
export class GradeService {

  constructor(
    private gradeRepository: GradeRepository,
    private gradeValidator: GradeValidator,
    private assessmentRepository: AssessmentRepository,
  ) { }

  async getAll(filter) {
    return await this.gradeRepository.getAll(filter);
  }

  async getById(id) {
    await this.gradeValidator.checkExists(id);
    return await this.gradeRepository.getById(id);
  }

  async getByAssessment(assessmentId) {
    await this.gradeValidator.checkAssessmentExists(assessmentId);
    return await this.gradeRepository.getByAssessment(assessmentId);
  }

  async getByStudent(studentId) {
    await this.gradeValidator.checkStudentExists(studentId);
    return await this.gradeRepository.getByStudent(studentId);
  }

  async getBySection(sectionId) {
    await this.gradeValidator.checkSectionExists(sectionId);
    return await this.gradeRepository.getBySection(sectionId);
  }

  async getBySubject(subjectId) {
    await this.gradeValidator.checkSubjectExists(subjectId);
    return await this.gradeRepository.getBySubject(subjectId);
  }

  async getByTeacher(teacherId) {
    await this.gradeValidator.checkTeacherExists(teacherId);
    return await this.gradeRepository.getByTeacher(teacherId);
  }

  async getCount() {
    return await this.gradeRepository.getCount();
  }

  async getAssessmentId({ teacherId, subjectId, sectionId, assessmentTitle }) {
    await this.gradeValidator.checkTeacherAssignmentExists(teacherId, subjectId, sectionId);
    const assessment = await this.assessmentRepository.getAssessmentByParams(
      teacherId,
      subjectId,
      sectionId,
      assessmentTitle
    );
    return assessment.id;
  }

  async create(data, user) {
    const {
      studentId,
      subjectId,
      sectionId,
      teacherId,
      assessmentId,
      marksObtained,
      feedback,
      status,
    } = data;

    await this.gradeValidator.checkStudentInSection(studentId, sectionId);
    await this.gradeValidator.checkTeacherInSection(teacherId, sectionId);
    await this.gradeValidator.checkSubjectExists(subjectId);
    await this.gradeValidator.checkAssessmentExists(assessmentId);
    await this.gradeValidator.checkDuplicateGrade(studentId, assessmentId);

    const gradeDetails = {
      studentId,
      assessmentId,
      marksObtained,
      feedback,
      status,
      gradedBy:user.id,
    };

    await this.gradeValidator.validateCreateSchema(gradeDetails);
    const newGrade = await this.gradeRepository.create(gradeDetails);

    return newGrade;
  }

  async update(id, data, user) {
    await this.gradeValidator.checkExists(id);

    const validatedData = await this.gradeValidator.validateUpdateSchema(data);
    const gradeData: any = {};

    if (validatedData.marksObtained !== undefined) {
      gradeData.marksObtained = validatedData.marksObtained;
    }

    if (validatedData.feedback !== undefined) {
      gradeData.feedback = validatedData.feedback;
    }

    if (validatedData.status !== undefined) {
      gradeData.status = validatedData.status;
    }

    if (Object.keys(gradeData).length > 0) {
      gradeData.gradedBy = user.teacherId || user.id;
      await this.gradeRepository.update(id, gradeData);
    }

    return await this.getById(id);
  }

  async delete(id) {
    await this.gradeValidator.checkExists(id);
    const deletedGrade = await this.gradeRepository.delete(id);
    return deletedGrade;
  }

  async deleteAll() {
    return await this.gradeRepository.deleteAll();
  }

  async seedDemoGrades(gradesData) {
    const createdGrades = [];

    for (const gradeData of gradesData) {
      try {
        const gradeEntity = await this.gradeRepository.create(gradeData);
        createdGrades.push(gradeEntity);
      } catch (error) {
        continue;
      }
    }

    return createdGrades;
  }

}