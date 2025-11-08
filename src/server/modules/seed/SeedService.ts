import { Injectable, t } from 'najm-api';
import { UserService } from '../users/UserService';
import { RoleService } from '../roles';
import { PermissionService } from '../permissions';
import { StudentService } from '../students/StudentService';
import { TeacherService } from '../teachers/TeacherService';
import { ParentService } from '../parents/ParentService';
import { SubjectService } from '../subjects/SubjectService';
import { ClassService } from '../classes/ClassService';
import { AssessmentService } from '../assessments/AssessmentService';
import { GradeService } from '../grades/GradeService';
import { AttendanceService } from '../attendance/AttendanceService';
import { AlertService } from '../alerts/AlertService';
import { SettingsService } from '../settings/SettingsService';
import { FeeTypeService } from '../feeTypes/FeeTypeService';
import { DriverService } from '../drivers/DriverService';
import { VehicleService } from '../vehicles/VehicleService';

// Import seed data
import rolesData from './data/roles.json';
import permissionsData from './data/permissions.json';
import rolePermissionsData from './data/rolePermissions.json';
import subjectsData from './data/subjects.json';
import teachersData from './data/teachers.json';
import studentsData from './data/students.json';
import parentsData from './data/parents.json';
import classesData from './data/classes.json';
import sectionsData from './data/sections.json';
import assessmentsData from './data/assessments.json';
import attendanceData from './data/attendance.json';
import gradesData from './data/grades.json';
import alertsData from './data/alerts.json';
import feeTypesData from './data/feeTypes.json';
import driversData from './data/drivers.json';
import vehiclesData from './data/vehicles.json';
import { SectionService } from '../sections';

@Injectable()
export class SeedService {
  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private userService: UserService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private parentService: ParentService,
    private subjectService: SubjectService,
    private classService: ClassService,
    private sectionService: SectionService,
    private assessmentService: AssessmentService,
    private gradeService: GradeService,
    private attendanceService: AttendanceService,
    private alertService: AlertService,
    private settingsService: SettingsService,
    private feeTypeService: FeeTypeService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
  ) { }

  private validateSeedingPermissions(API_KEY) {
    const allowSeeding = process.env.ALLOW_SEEDING === 'true';
    const seedApiKey = process.env.NEXT_PUBLIC_SEED_API_KEY;

    if (!allowSeeding) {
      throw new Error(t('system.errors.seedingDisabled'));
    }

    if (!API_KEY || API_KEY !== seedApiKey) {
      throw new Error(t('system.errors.invalidSeedApiKey'));
    }
  }

  async seedSystem(API_KEY) {
    this.validateSeedingPermissions(API_KEY);

    console.log('🌱 Seeding system defaults...');

    const roles = await this.roleService.seedDefaultRoles(rolesData);
    console.log('✅ Roles seeded');

    const permissions = await this.permissionService.seedDefaultPermissions(permissionsData);
    console.log('✅ Permissions seeded');

    await this.permissionService.seedDefaultRolePermissions(rolePermissionsData);
    console.log('✅ Role permissions assigned');

    const adminUser = await this.userService.seedAdminUser();
    console.log('✅ admin user created');

    console.log('✅ System seeded successfully');
    return {
      roles,
      permissions,
      adminUser
    }
  }

  async seedDemo(API_KEY: string) {
    this.validateSeedingPermissions(API_KEY);

    await this.clearAll();

    console.log('🌱 Starting school demo data seeding...');

    await this.subjectService.seedDemoSubjects(subjectsData);
    console.log('✅ Subjects seeded');

    await this.classService.seedDemoClasses(classesData);
    console.log('✅ Classes seeded');

    await this.sectionService.seedDemoSections(sectionsData);
    console.log('✅ Sections seeded');

    await this.feeTypeService.seedDemoFeeTypes(feeTypesData);
    console.log('✅ Fee types seeded');

    await this.teacherService.seedDemoTeachers(teachersData);
    console.log('✅ Teachers seeded');

    await this.parentService.seedDemoParents(parentsData);
    console.log('✅ Parents seeded');

    await this.studentService.seedDemoStudents(studentsData);
    console.log('✅ Students seeded');

    await this.driverService.seedDemoDrivers(driversData);
    console.log('✅ Drivers seeded');

    await this.vehicleService.seedDemoVehicles(vehiclesData);
    console.log('✅ Vehicles seeded');

    // await this.assessmentService.seedDemoAssessments(assessmentsData);
    // console.log('✅ Assessments seeded');

    // await this.attendanceService.seedDemoAttendance(attendanceData);
    // console.log('✅ Attendance seeded');

    // await this.gradeService.seedDemoGrades(gradesData);
    // console.log('✅ Grades seeded');

    // await this.alertService.seedDemoAlerts(alertsData);
    // console.log('✅ Alerts seeded');

    // await this.settingsService.seedDemoSettings();
    // console.log('✅ Settings seeded');

    console.log('🎉 School demo system seeded successfully');
    return 'School demo system seeded successfully'
  }

  async clearAll(): Promise<string> {
    console.log('🧹 Clearing all school data...');

    // Delete in correct order to respect foreign key constraints
    // 1. Delete dependent records first
    await this.studentService.deleteAll();
    console.log('  - Students cleared');

    await this.gradeService.deleteAll();
    console.log('  - Grades cleared');

    await this.attendanceService.deleteAll();
    console.log('  - Attendance cleared');

    await this.assessmentService.deleteAll();
    console.log('  - Assessments cleared');

    await this.teacherService.deleteAll();
    console.log('  - Teachers cleared');

    await this.driverService.deleteAll();
    console.log('  - Drivers cleared');

    await this.vehicleService.deleteAll();
    console.log('  - Vehicles cleared');

    // 2. Delete sections (which references classes)
    await this.sectionService.deleteAll();
    console.log('  - Sections cleared');

    // 3. Then delete classes
    await this.classService.deleteAll();
    console.log('  - Classes cleared');

    // 4. Delete independent entities
    await this.parentService.deleteAll();
    console.log('  - Parents cleared');

    await this.subjectService.deleteAll();
    console.log('  - Subjects cleared');

    await this.feeTypeService.deleteAll();
    console.log('  - Fee types cleared');

    await this.alertService.deleteAll();
    console.log('  - Alerts cleared');

    console.log('✅ All school data cleared');
    return 'All school data cleared successfully';
  }


}