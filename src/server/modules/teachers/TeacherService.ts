import { Injectable, Transactional } from 'najm-api';
import { TeacherRepository } from './TeacherRepository';
import { TeacherValidator } from './TeacherValidator';
import { UserService } from '../users/UserService';
import { formatDate, isEmpty, pickProps } from '@/server/shared';

@Injectable()
export class TeacherService {

  constructor(
    private teacherRepository: TeacherRepository,
    private teacherValidator: TeacherValidator,
    private userService: UserService,
  ) { }

  async getAll(filter) {
    return await this.teacherRepository.getAll(filter);
  }

  async getCount() {
    return await this.teacherRepository.getCount();
  }

  async getById(id) {
    await this.teacherValidator.checkExists(id);
    return await this.teacherRepository.getById(id);
  }

  async getByCin(cin) {
    await this.teacherValidator.checkCinExists(cin);
    return await this.teacherRepository.getByCin(cin);
  }

  async getByEmail(email) {
    await this.teacherValidator.checkEmailExists(email);
    return await this.teacherRepository.getByEmail(email);
  }

  async getByPhone(phone) {
    await this.teacherValidator.checkPhoneExists(phone);
    return await this.teacherRepository.getByPhone(phone);
  }

  async getBySpecialization(specialization) {
    return await this.teacherRepository.getBySpecialization(specialization);
  }

  async getClasses(id) {
    await this.teacherValidator.checkExists(id);
    return await this.teacherRepository.getClasses(id);
  }

  async getStudents(id) {
    await this.teacherValidator.checkExists(id);
    return await this.teacherRepository.getStudents(id);
  }

  private resolveImage(image, gender) {
    if (image) return image;
    if (gender === 'F') return '/images/teacherF.png';
    return '/images/teacherM.png';
  }

  @Transactional()
  async create(data) {

    data.image = this.resolveImage(data.image, data.gender);
    await this.teacherValidator.validate(data);

    const user = await this.userService.create({
      id: data.userId,
      email: data.email,
      image: data.image,
      role: 'teacher',
    });

    const teacher = await this.teacherRepository.create({
      id: data.id,
      userId: user.id,
      cin: data.cin,
      name: data.name,
      phone: data.phone,
      address: data.address,
      gender: data.gender,
      specialization: data.specialization,
      salary: data.salary,
      hireDate: formatDate(data.hireDate),
      yearsOfExperience: data.yearsOfExperience,
      bankAccount: data.bankAccount,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      employmentType: data.employmentType,
      workloadHours: data.workloadHours,
      academicDegrees: data.academicDegrees,
      status: data.status || 'active',
    });

    await this.processTeacherAssignments(teacher, data);

    return teacher;

  }

  async update(id, data) {
    const USER_UPDATE_KEYS = [
      'name', 'email', 'image', 'password'
    ];

    const TEACHER_UPDATE_KEYS = [
      'name', 'email', 'cin', 'phone', 'address', 'gender', 'specialization',
      'salary', 'hireDate', 'bankAccount', 'emergencyContact', 'yearsOfExperience',
      'emergencyPhone', 'status'
    ];

    await this.teacherValidator.validate(data, id);

    const teacher = await this.teacherRepository.getById(id);
    const userData = pickProps(data, USER_UPDATE_KEYS);
    const teacherData = pickProps(data, TEACHER_UPDATE_KEYS);

    if (!isEmpty(userData)) {
      await this.userService.update(teacher.userId, userData);
    }

    if (!isEmpty(teacherData)) {
      await this.teacherValidator.validateUpdate(teacherData);
      await this.teacherRepository.update(id, teacherData);
    }

    return await this.getById(id);
  }

  async delete(id) {
    await this.teacherValidator.checkExists(id);
    const deletedTeacher = await this.teacherRepository.delete(id);
    return deletedTeacher;
  }

  async deleteAll() {
    return await this.teacherRepository.deleteAll();
  }

  async seedDemoTeachers(teachersData) {
    const createdTeachers = [];

    for (const teacherData of teachersData) {
      try {
        const teacher = await this.create(teacherData);
        createdTeachers.push(teacher);
      } catch (error) {
        continue;
      }
    }
    return createdTeachers;
  }

  private async processTeacherAssignments(teacher, data) {

    const  assignments  = data?.assignments;
    const  teacherId  = teacher?.id;

    if (isEmpty(assignments)) return;

    for (const assignment of assignments) {
      const { classId, sectionIds, subjectIds } = assignment;

      for (const sectionId of sectionIds) {
        for (const subjectId of subjectIds) {
          await this.teacherRepository.createAssignment({
            classId,
            teacherId,
            subjectId,
            sectionId,
          });
        }
      }
    }
  }
}