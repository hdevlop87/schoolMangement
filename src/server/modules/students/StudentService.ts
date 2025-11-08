import { Injectable, Transactional } from 'najm-api';
import { StudentRepository } from './StudentRepository';
import { StudentValidator } from './StudentValidator';
import { UserService } from '../users/UserService';
import { ParentService } from '../parents/ParentService';
import { FeeService } from '../fees/FeeService';
import { calculateAge, formatDate, pickProps, isEmpty } from '@/server/shared';

@Injectable()
export class StudentService {

  constructor(
    private studentRepository: StudentRepository,
    private studentValidator: StudentValidator,
    private userService: UserService,
    private parentService: ParentService,
    private feeService: FeeService,
  ) { }

  private resolveStudentImage(data) {
    const { image, gender } = data
    if (image) return image;
    if (gender === 'F') return '/images/girl.png';
    return '/images/boy.png';
  }

  // ========== RETRIEVAL METHODS ==========

  async getAll(filter) {
    return await this.studentRepository.getAll(filter);
  }

  async getById(id) {
    await this.studentValidator.checkExists(id);
    return await this.studentRepository.getById(id);
  }

  // ========== CREATE-METHOD ==========
  @Transactional()
  async create(data) {

    const { fees, parents } = data

    await this.studentValidator.validate(data);

    const studentImage = this.resolveStudentImage(data);

    const user = await this.userService.create({
      id: data.userId,
      email: data.email,
      image: studentImage,
      role: 'student',
    });

    const student = await this.studentRepository.create({
      id: data.id,
      userId: user.id,
      classId: data.classId,
      sectionId: data.sectionId,
      studentCode: data.studentCode,
      name: data.name,
      phone: data.phone,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      age: calculateAge(data.dateOfBirth),
      gender: data.gender,
      gradeLevel: data.gradeLevel,
      enrollmentDate: data.enrollmentDate,
      graduationDate: data.graduationDate,
      medicalConditions: data.medicalConditions,
      status: data.status,
    });

    await this.parentService.processParents(student, parents);
    await this.feeService.processFees(student, fees, user);
    
    return student;

  }

  // ========== UPDATE-METHOD ==========

  async update(id, data) {

    const USER_UPDATE_KEYS = [
      'name', 'email', 'image', 'password'
    ];

    const STUDENT_UPDATE_KEYS = [
      'name', 'email', 'studentCode', 'phone', 'address', 'gender',
      'dateOfBirth', 'enrollmentDate', 'graduationDate', 'medicalConditions',
      'status', 'classId', 'sectionId', 'previousSchool'
    ];

    await this.studentValidator.validate(data, id);

    const student = await this.studentRepository.getById(id);
    const userData = pickProps(data, USER_UPDATE_KEYS);
    const studentData = pickProps(data, STUDENT_UPDATE_KEYS);

    studentData.age = calculateAge(studentData.dateOfBirth);
    
    await this.userService.update(student.userId, userData);
    await this.studentValidator.validateUpdate(studentData);

    return await this.studentRepository.update(id, studentData);

  }

  // ========== DELETE-METHODS ==========

  async delete(id) {
    await this.studentValidator.checkExists(id);
    return await this.studentRepository.delete(id);
  }

  async deleteAll() {
    return await this.studentRepository.deleteAll();
  }

  // ========== SEED METHOD ==========

  async seedDemoStudents(studentsData) {
    const createdStudents = [];

    for (const studentData of studentsData) {
      try {
        const student = await this.create(studentData);
        createdStudents.push(student);
      } catch (error) {
        continue;
      }
    }

    return createdStudents;
  }

  // ========== COMMENTED - ADDITIONAL RETRIEVAL METHODS (Available on demand) ==========

  // async getCount() {
  //   return await this.studentRepository.getCount();
  // }

  // async getStudentsByGender() {
  //   return await this.studentRepository.getStudentsByGender();
  // }

  // async getByStudentCode(studentCode) {
  //   await this.studentValidator.checkCodeExists(studentCode);
  //   return await this.studentRepository.getByStudentCode(studentCode);
  // }

  // async getByEmail(email) {
  //   await this.studentValidator.checkEmailExists(email);
  //   return await this.studentRepository.getByEmail(email);
  // }

  // async getByPhone(phone) {
  //   await this.studentValidator.checkPhoneExists(phone);
  //   return await this.studentRepository.getByPhone(phone);
  // }

  // async getStudentGrades(id) {
  //   await this.studentValidator.checkExists(id);
  //   return await this.studentRepository.getGrades(id);
  // }

  // async getStudentAttendance(id) {
  //   await this.studentValidator.checkExists(id);
  //   return await this.studentRepository.getAttendance(id);
  // }

  // async getStudentAssessments(id) {
  //   await this.studentValidator.checkExists(id);
  //   return await this.studentRepository.getAssessments(id);
  // }

  // async getStudentParents(id) {
  //   await this.studentValidator.checkExists(id);
  //   return await this.studentRepository.getParents(id);
  // }

  // async getAnalytics(id) {
  //   await this.studentValidator.checkExists(id);
  //   return await this.studentRepository.getAnalytics(id);
  // }
}