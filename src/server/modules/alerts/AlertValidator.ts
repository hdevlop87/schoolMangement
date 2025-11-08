import { Injectable, t } from 'najm-api';
import { AlertRepository } from './AlertRepository';
import { StudentRepository } from '@/server/modules/students/StudentRepository';
import { TeacherRepository } from '@/server/modules/teachers/TeacherRepository';
import { ClassRepository } from '@/server/modules/classes/ClassRepository';
import { SubjectRepository } from '@/server/modules/subjects/SubjectRepository';
import { parseSchema } from '@/server/shared';
import { alertSchema } from '@/lib/validations';

@Injectable()
export class AlertValidator {
  constructor(
    private alertRepository: AlertRepository,
    private studentRepository: StudentRepository,
    private teacherRepository: TeacherRepository,
    private classRepository: ClassRepository,
    private subjectRepository: SubjectRepository,
  ) { }

  async validateAlert(data) {
    return parseSchema(alertSchema, data);
  }

  async checkAlertExists(id: string) {
    const alert = await this.alertRepository.getById(id);
    if (!alert) {
      throw new Error(t('alerts.errors.notFound'));
    }
    return alert;
  }

  async checkStudentExists(studentId: string) {
    if (!studentId) return;

    const student = await this.studentRepository.getById(studentId);
    if (!student) {
      throw new Error(t('students.errors.notFound'));
    }
    return student;
  }

  async checkTeacherExists(teacherId: string) {
    if (!teacherId) return;

    const teacher = await this.teacherRepository.getById(teacherId);
    if (!teacher) {
      throw new Error(t('teachers.errors.notFound'));
    }
    return teacher;
  }

  async checkClassExists(classId: string) {
    if (!classId) return;

    const classEntity = await this.classRepository.getById(classId);
    if (!classEntity) {
      throw new Error(t('classes.errors.notFound'));
    }
    return classEntity;
  }

  async checkSubjectExists(subjectId: string) {
    if (!subjectId) return;

    const subject = await this.subjectRepository.getById(subjectId);
    if (!subject) {
      throw new Error(t('subjects.errors.notFound'));
    }
    return subject;
  }

  async checkDuplicateAlert(type: string, studentId?: string, teacherId?: string, classId?: string) {
    const existingAlert = await this.alertRepository.checkDuplicateAlert(type, studentId, teacherId, classId);

    if (existingAlert) {
      throw new Error(t('alerts.errors.duplicateActiveAlert'));
    }

    return true;
  }
}