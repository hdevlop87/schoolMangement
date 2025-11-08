import { Injectable, t } from 'najm-api';
import { StudentService } from '../students/StudentService';
import { TeacherService } from '../teachers/TeacherService';
import { ParentService } from '../parents/ParentService';
import { FeeService } from '../fees/FeeService';
import { ExpenseService } from '../expenses';

@Injectable()
export class DashboardService {

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private parentService: ParentService,
    private feeService: FeeService,
    private expenseService: ExpenseService,
  ) { }

  async getAdminWidgets() {
    const studentsCount = await this.studentService.getCount();
    const teachersCount = await this.teacherService.getCount();
    const parentsCount = await this.parentService.getCount();
    const earnings = await this.feeService.getRevenue();
    const expenses = await this.expenseService.getTotalExpenses()

    return [
      {
        title: t('dashboard.widgets.totalStudents'),
        icon: 'studentImage',
        value: studentsCount.count || 0,
      },
      {
        title: t('dashboard.widgets.totalTeachers'),
        icon: 'teacherImage',
        value: teachersCount.count || 0,
      },
      {
        title: t('dashboard.widgets.totalParents'),
        icon: 'parentsImage',
        value: parentsCount.count || 0,
      },
      {
        title: t('dashboard.widgets.totalEarnings'),
        icon: 'feesImage',
        value: `${earnings || 0} DH`,
      },
      {
        title: t('dashboard.widgets.totalExpenses'),
        icon: 'expensesImage',
        value: `${expenses || 0} DH`,
      }
    ];
  }

  async getStudentsByGender() {
    return await this.studentService.getStudentsByGender();
  }

  async getTeacherWidgets(userId: string) {
    // Get teacher by userId to find teacherId
  }

  async getStudentWidgets(userId: string) {
    // Get student by userId to find studentId
  }

  async getParentWidgets(userId: string) {
    // Get parent by userId to find parentId
  }
}