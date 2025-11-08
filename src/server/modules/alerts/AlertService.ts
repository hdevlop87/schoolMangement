import { Injectable } from 'najm-api';
import { AlertRepository } from './AlertRepository';
import { AlertValidator } from './AlertValidator';

@Injectable()
export class AlertService {
  constructor(
    private alertRepository: AlertRepository,
    private alertValidator: AlertValidator,
  ) { }

  async getAll() {
    return await this.alertRepository.getAll();
  }

  async getById(id) {
    return await this.alertRepository.getById(id);
  }

  async getByType(type) {

    return await this.alertRepository.getByType(type);
  }

  async getByStatus(status) {
    return await this.alertRepository.getByStatus(status);
  }

  async getByPriority(priority) {
    return await this.alertRepository.getByPriority(priority);
  }

  async getByStudentId(studentId) {
    await this.alertValidator.checkStudentExists(studentId);
    return await this.alertRepository.getByStudentId(studentId);
  }

  async getByTeacherId(teacherId) {
    await this.alertValidator.checkTeacherExists(teacherId);
    return await this.alertRepository.getByTeacherId(teacherId);
  }

  async getByClassId(classId) {
    await this.alertValidator.checkClassExists(classId);
    return await this.alertRepository.getByClassId(classId);
  }

  async getBySubjectId(subjectId) {
    await this.alertValidator.checkSubjectExists(subjectId);
    return await this.alertRepository.getBySubjectId(subjectId);
  }

  async getActiveAlerts() {
    return await this.alertRepository.getActiveAlerts();
  }

  async getCriticalAlerts() {
    return await this.alertRepository.getCriticalAlerts();
  }

  async getRecentAlertsByHours(hours: number = 24) {
    return await this.alertRepository.getRecentAlertsByHours(hours);
  }

  async getRecentAlerts(limit: number = 10) {
    return await this.alertRepository.getRecentAlerts(limit);
  }

  async getCount() {
    return await this.alertRepository.getCount();
  }

  async getStatusCounts() {
    return await this.alertRepository.getStatusCounts();
  }

  async getPriorityCounts() {
    return await this.alertRepository.getPriorityCounts();
  }

  async getTypeCounts() {
    return await this.alertRepository.getTypeCounts();
  }

  async create(data) {
    await this.alertValidator.validateAlert(data);

    if (data.studentId) {
      await this.alertValidator.checkStudentExists(data.studentId);
    }
    if (data.teacherId) {
      await this.alertValidator.checkTeacherExists(data.teacherId);
    }
    if (data.classId) {
      await this.alertValidator.checkClassExists(data.classId);
    }
    if (data.subjectId) {
      await this.alertValidator.checkSubjectExists(data.subjectId);
    }
    await this.alertValidator.checkDuplicateAlert(
      data.type,
      data.studentId,
      data.teacherId,
      data.classId
    );

    const alertData = {
      ...data,
      status: 'active'
    };

    const newAlert = await this.alertRepository.create(alertData);
    return await this.getById(newAlert.id);
  }

  async update(id, data) {
    await this.alertValidator.checkAlertExists(id);
    await this.alertValidator.validateAlert(data);

    if (data.studentId) {
      await this.alertValidator.checkStudentExists(data.studentId);
    }
    if (data.teacherId) {
      await this.alertValidator.checkTeacherExists(data.teacherId);
    }
    if (data.classId) {
      await this.alertValidator.checkClassExists(data.classId);
    }
    if (data.subjectId) {
      await this.alertValidator.checkSubjectExists(data.subjectId);
    }

    return await this.alertRepository.update(id, data);
  }

  async updateStatus(id, status) {
    await this.alertValidator.checkAlertExists(id);
    return await this.alertRepository.updateStatus(id, status);
  }

  async delete(id) {
    await this.alertValidator.checkAlertExists(id);
    return await this.alertRepository.delete(id);
  }

  async deleteAll() {
    return await this.alertRepository.deleteAll();
  }

  async deleteResolved() {
    return await this.alertRepository.deleteResolved();
  }

  async createAcademicAlert(studentId, alertType, details?) {
    let title, message, priority;

    switch (alertType) {
      case 'low_grade':
        priority = details?.grade < 50 ? 'critical' : details?.grade < 60 ? 'high' : 'medium';
        title = 'Low Academic Performance';
        message = `Student has received a low grade of ${details?.grade || 'unknown'}% in ${details?.subject || 'a subject'}. Intervention may be required.`;
        break;
      case 'missing_assignment':
        priority = details?.daysOverdue > 7 ? 'high' : 'medium';
        title = 'Missing Assignment';
        message = `Student has a missing assignment in ${details?.subject || 'a subject'}${details?.daysOverdue ? ` (${details.daysOverdue} days overdue)` : ''}.`;
        break;
      case 'exam_failure':
        priority = 'critical';
        title = 'Exam Failure';
        message = `Student failed an exam in ${details?.subject || 'a subject'} with ${details?.grade || 'unknown'}%. Immediate attention required.`;
        break;
      default:
        priority = 'medium';
        title = 'Academic Alert';
        message = details?.message || 'Academic performance issue detected.';
    }

    const alertData = {
      type: 'academic',
      title,
      message,
      priority,
      studentId,
      classId: details?.classId,
      subjectId: details?.subjectId
    };

    return await this.create(alertData);
  }

  async createAttendanceAlert(studentId, alertType, details?) {
    let title, message, priority;

    switch (alertType) {
      case 'chronic_absence':
        priority = details?.attendanceRate < 50 ? 'critical' : details?.attendanceRate < 70 ? 'high' : 'medium';
        title = 'Chronic Absence';
        message = `Student attendance rate is ${details?.attendanceRate || 'unknown'}%. Below required threshold.`;
        break;
      case 'consecutive_absence':
        priority = details?.days > 5 ? 'critical' : details?.days > 3 ? 'high' : 'medium';
        title = 'Consecutive Absences';
        message = `Student has been absent for ${details?.days || 'multiple'} consecutive days.`;
        break;
      case 'tardiness':
        priority = 'medium';
        title = 'Frequent Tardiness';
        message = `Student has been late ${details?.count || 'multiple'} times this week.`;
        break;
      default:
        priority = 'medium';
        title = 'Attendance Alert';
        message = details?.message || 'Attendance issue detected.';
    }

    const alertData = {
      type: 'attendance',
      title,
      message,
      priority,
      studentId,
      classId: details?.classId
    };

    return await this.create(alertData);
  }

  async createBehavioralAlert(studentId, alertType, details?) {
    let title, message, priority;

    switch (alertType) {
      case 'disciplinary_action':
        priority = 'high';
        title = 'Disciplinary Action Required';
        message = `Student behavior requires disciplinary intervention: ${details?.reason || 'behavioral issue'}.`;
        break;
      case 'classroom_disruption':
        priority = 'medium';
        title = 'Classroom Disruption';
        message = `Student has been disruptive in ${details?.subject || 'class'}. Teacher intervention noted.`;
        break;
      case 'positive_behavior':
        priority = 'low';
        title = 'Positive Behavior Recognition';
        message = `Student demonstrated exceptional behavior: ${details?.reason || 'positive achievement'}.`;
        break;
      default:
        priority = 'medium';
        title = 'Behavioral Alert';
        message = details?.message || 'Behavioral concern detected.';
    }

    const alertData = {
      type: 'behavioral',
      title,
      message,
      priority,
      studentId,
      teacherId: details?.teacherId,
      classId: details?.classId
    };

    return await this.create(alertData);
  }

  async createHealthAlert(studentId, alertType, details?) {
    let title, message, priority;

    switch (alertType) {
      case 'medical_emergency':
        priority = 'critical';
        title = 'Medical Emergency';
        message = `Medical emergency for student: ${details?.condition || 'immediate attention required'}.`;
        break;
      case 'medication_reminder':
        priority = 'high';
        title = 'Medication Reminder';
        message = `Student requires medication administration: ${details?.medication || 'as prescribed'}.`;
        break;
      case 'health_concern':
        priority = 'medium';
        title = 'Health Concern';
        message = `Health concern noted for student: ${details?.concern || 'requires monitoring'}.`;
        break;
      default:
        priority = 'medium';
        title = 'Health Alert';
        message = details?.message || 'Health-related issue detected.';
    }

    const alertData = {
      type: 'health',
      title,
      message,
      priority,
      studentId
    };

    return await this.create(alertData);
  }

  async createSystemAlert(message, priority = 'medium') {
    const alertData = {
      type: 'system',
      title: 'System Alert',
      message,
      priority
    };

    return await this.create(alertData);
  }

  async createAnnouncementAlert(title, message, targetAudience, authorId, classId?) {
    const alertData = {
      type: 'announcement',
      title: `Announcement: ${title}`,
      message,
      priority: 'medium',
      targetAudience,
      authorId,
      classId
    };

    return await this.create(alertData);
  }

  async createReminderAlert(title, message, targetAudience, authorId, details?) {
    const alertData = {
      type: 'reminder',
      title: `Reminder: ${title}`,
      message,
      priority: details?.priority || 'low',
      targetAudience,
      authorId,
      studentId: details?.studentId,
      teacherId: details?.teacherId,
      classId: details?.classId
    };

    return await this.create(alertData);
  }

  async createEmergencyAlert(title, message, details?) {
    const alertData = {
      type: 'emergency',
      title: `EMERGENCY: ${title}`,
      message,
      priority: 'critical',
      targetAudience: 'all',
      authorId: details?.authorId,
      studentId: details?.studentId,
      classId: details?.classId
    };

    return await this.create(alertData);
  }

  async generateAttendanceAlerts() {
    // This would integrate with attendance tracking to auto-generate alerts
    // For now, returning a placeholder structure
    return {
      chronicAbsenceAlerts: 0,
      tardynessAlerts: 0,
      totalCreated: 0,
      alerts: []
    };
  }

  async generateAcademicAlerts() {
    // This would integrate with grading system to auto-generate alerts
    // For now, returning a placeholder structure
    return {
      lowGradeAlerts: 0,
      missingAssignmentAlerts: 0,
      examFailureAlerts: 0,
      totalCreated: 0,
      alerts: []
    };
  }

  async getDashboardSummary() {
    const [active, critical, recent, statusCounts, typeCounts] = await Promise.all([
      this.getActiveAlerts(),
      this.getCriticalAlerts(),
      this.getRecentAlertsByHours(24),
      this.getStatusCounts(),
      this.getTypeCounts()
    ]);

    return {
      activeCount: active.length,
      criticalCount: critical.length,
      recentCount: recent.length,
      statusBreakdown: statusCounts,
      typeBreakdown: typeCounts,
      criticalAlerts: critical.slice(0, 5), 
      recentAlerts: recent.slice(0, 10) 
    };
  }

  async seedDemoAlerts(alertsData) {
    const createdAlerts = [];
    for (const alert of alertsData) {
      try {
        const createdAlert = await this.create(alert);
        createdAlerts.push(createdAlert);
      } catch (error) {
        continue;
      }
    }

    return createdAlerts;
  }
}