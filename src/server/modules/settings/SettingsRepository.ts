import { DB } from '@/server/database/db';
import { settings, users } from '@/server/database/schema';
import { Repository } from 'najm-api';
import { count, eq, desc, sql } from 'drizzle-orm';

@Repository()
export class SettingsRepository {

  declare db: DB;

  async getAll() {
    return await this.db
      .select()
      .from(settings)
      .orderBy(desc(settings.createdAt));
  }

  async getById(id: string) {
    const [existingSettings] = await this.db
      .select()
      .from(settings)
      .where(eq(settings.id, id))
      .limit(1);
    return existingSettings;
  }

  async getByUserId(userId: string) {
    const [userSettings] = await this.db
      .select()
      .from(settings)
      .where(eq(settings.userId, userId))
      .limit(1);
    return userSettings;
  }

  async getCount() {
    const [settingsCount] = await this.db
      .select({ count: count() })
      .from(settings);
    return settingsCount;
  }

  async create(data: any) {
    const [newSettings] = await this.db
      .insert(settings)
      .values(data)
      .returning();
    return newSettings;
  }

  async update(id: string, data: any) {
    const [updatedSettings] = await this.db
      .update(settings)
      .set(data)
      .where(eq(settings.id, id))
      .returning();
    return updatedSettings;
  }

  async updateByUserId(userId: string, data: any) {
    const [updatedSettings] = await this.db
      .update(settings)
      .set(data)
      .where(eq(settings.userId, userId))
      .returning();
    return updatedSettings;
  }

  async delete(id: string) {
    const [deletedSettings] = await this.db
      .delete(settings)
      .where(eq(settings.id, id))
      .returning();
    return deletedSettings;
  }

  async deleteByUserId(userId: string) {
    const [deletedSettings] = await this.db
      .delete(settings)
      .where(eq(settings.userId, userId))
      .returning();
    return deletedSettings;
  }

  async deleteAll() {
    const allSettings = await this.db
      .select()
      .from(settings)
      .orderBy(desc(settings.createdAt));

    const deletedSettings = await this.db
      .delete(settings)
      .returning();

    return {
      deletedCount: deletedSettings.length,
      deletedSettings: deletedSettings
    };
  }

  async createDefaultForUser(userId: string) {
    const defaultSettings = {
      userId,
      // School Information (admin Settings)
      schoolName: 'My School',
      schoolAddress: '123 Education Street, City, State 12345',
      schoolPhone: '+1234567890',
      schoolEmail: 'info@myschool.edu',
      currentAcademicYear: '2025-2026',

      // Grading System
      gradingScale: {
        A: { min: 90, max: 100, gpa: 4.0 },
        B: { min: 80, max: 89, gpa: 3.0 },
        C: { min: 70, max: 79, gpa: 2.0 },
        D: { min: 60, max: 69, gpa: 1.0 },
        F: { min: 0, max: 59, gpa: 0.0 }
      },

      // Academic Policies
      attendanceRequirement: '75.00', // Minimum attendance percentage
      maxClassSize: 34, // Default from schema

      // Notification Settings
      academicAlerts: true,
      attendanceAlerts: true,
      emailNotifications: true,
      smsNotifications: false,
      parentNotifications: true,

      // Security Settings
      twoFactorEnabled: false,
      sessionTimeout: '60', // Minutes as string in schema
      passwordRequireSymbols: true,
      loginNotifications: true,
      parentAccessEnabled: true,

      // System Preferences
      timeZone: 'UTC',
      language: 'en',
      theme: 'system',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12', // 12 or 24 hour

      // Academic Calendar Settings
      gradingPeriods: 4,
      schoolStartTime: '08:00',
      schoolEndTime: '15:00',
      lunchBreakDuration: 30, // minutes
    };

    return this.create(defaultSettings);
  }

  async upsert(userId: string, data: any) {
    const existing = await this.getByUserId(userId);
    if (existing) {
      return this.updateByUserId(userId, data);
    } else {
      return this.create({ ...data, userId });
    }
  }

  async getNotificationSettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      academicAlerts: userSettings.academicAlerts,
      attendanceAlerts: userSettings.attendanceAlerts,
      emailNotifications: userSettings.emailNotifications,
      smsNotifications: userSettings.smsNotifications,
      parentNotifications: userSettings.parentNotifications,
    };
  }

  async getSecuritySettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      twoFactorEnabled: userSettings.twoFactorEnabled,
      sessionTimeout: userSettings.sessionTimeout,
      passwordRequireSymbols: userSettings.passwordRequireSymbols,
      loginNotifications: userSettings.loginNotifications,
      parentAccessEnabled: userSettings.parentAccessEnabled,
    };
  }

  async getAcademicSettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      attendanceRequirement: userSettings.attendanceRequirement,
      maxClassSize: userSettings.maxClassSize,
      gradingScale: userSettings.gradingScale,
      gradingPeriods: userSettings.gradingPeriods,
    };
  }

  async getSchoolSettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      schoolName: userSettings.schoolName,
      schoolAddress: userSettings.schoolAddress,
      schoolPhone: userSettings.schoolPhone,
      schoolEmail: userSettings.schoolEmail,
      currentAcademicYear: userSettings.currentAcademicYear,
      schoolStartTime: userSettings.schoolStartTime,
      schoolEndTime: userSettings.schoolEndTime,
      lunchBreakDuration: userSettings.lunchBreakDuration,
    };
  }

  async getPreferenceSettings(userId: string) {
    const userSettings = await this.getByUserId(userId);
    if (!userSettings) return null;

    return {
      timeZone: userSettings.timeZone,
      language: userSettings.language,
      theme: userSettings.theme,
      dateFormat: userSettings.dateFormat,
      timeFormat: userSettings.timeFormat,
    };
  }

  async getUserLanguage(userId: string) {
    const userSettings = await this.getByUserId(userId);
    return userSettings?.language || 'en';
  }

  async getUserTheme(userId: string) {
    const userSettings = await this.getByUserId(userId);
    return userSettings?.theme || 'system';
  }

  async getLanguageDistribution() {
    const result = await this.db
      .select({
        language: settings.language,
        count: sql<number>`count(*)`
      })
      .from(settings)
      .groupBy(settings.language)
      .orderBy(desc(sql<number>`count(*)`));

    return result.map(item => ({
      name: item.language,
      value: Number(item.count),
      language: item.language
    }));
  }

  async getThemeDistribution() {
    const result = await this.db
      .select({
        theme: settings.theme,
        count: sql<number>`count(*)`
      })
      .from(settings)
      .groupBy(settings.theme)
      .orderBy(desc(sql<number>`count(*)`));

    return result.map(item => ({
      name: item.theme,
      value: Number(item.count),
      theme: item.theme
    }));
  }

  async getNotificationEnabledCount() {
    const [result] = await this.db
      .select({
        academicAlertsCount: sql<number>`count(*) FILTER (WHERE ${settings.academicAlerts} = true)`,
        attendanceAlertsCount: sql<number>`count(*) FILTER (WHERE ${settings.attendanceAlerts} = true)`,
        emailNotificationsCount: sql<number>`count(*) FILTER (WHERE ${settings.emailNotifications} = true)`,
        smsNotificationsCount: sql<number>`count(*) FILTER (WHERE ${settings.smsNotifications} = true)`,
        parentNotificationsCount: sql<number>`count(*) FILTER (WHERE ${settings.parentNotifications} = true)`,
      })
      .from(settings);

    return result;
  }

  async getSettingsWithUsers() {
    return await this.db
      .select({
        id: settings.id,
        userId: settings.userId,
        userName: users.email, // Using email as name since users table doesn't have name
        userEmail: users.email,
        schoolName: settings.schoolName,
        currentAcademicYear: settings.currentAcademicYear,
        language: settings.language,
        theme: settings.theme,
        academicAlerts: settings.academicAlerts,
        attendanceAlerts: settings.attendanceAlerts,
        emailNotifications: settings.emailNotifications,
        parentNotifications: settings.parentNotifications,
        attendanceRequirement: settings.attendanceRequirement,
        maxClassSize: settings.maxClassSize,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      })
      .from(settings)
      .leftJoin(users, eq(settings.userId, users.id))
      .orderBy(desc(settings.createdAt));
  }

  async getAcademicYearDistribution() {
    const result = await this.db
      .select({
        academicYear: settings.currentAcademicYear,
        count: sql<number>`count(*)`
      })
      .from(settings)
      .groupBy(settings.currentAcademicYear)
      .orderBy(desc(sql<number>`count(*)`));

    return result.map(item => ({
      name: item.academicYear,
      value: Number(item.count),
      academicYear: item.academicYear
    }));
  }

  async getAttendanceRequirementStats() {
    const [result] = await this.db
      .select({
        averageRequirement: sql<number>`avg(${settings.attendanceRequirement})`,
        minRequirement: sql<number>`min(${settings.attendanceRequirement})`,
        maxRequirement: sql<number>`max(${settings.attendanceRequirement})`,
        standardDeviation: sql<number>`stddev(${settings.attendanceRequirement})`,
      })
      .from(settings);

    return {
      average: Number(result.averageRequirement).toFixed(2),
      minimum: Number(result.minRequirement),
      maximum: Number(result.maxRequirement),
      standardDeviation: Number(result.standardDeviation).toFixed(2),
    };
  }

  async getClassSizeDistribution() {
    const result = await this.db
      .select({
        maxClassSize: settings.maxClassSize,
        count: sql<number>`count(*)`
      })
      .from(settings)
      .groupBy(settings.maxClassSize)
      .orderBy(settings.maxClassSize);

    return result.map(item => ({
      size: item.maxClassSize,
      count: Number(item.count)
    }));
  }

  async getSystemPreferencesAnalytics() {
    const [result] = await this.db
      .select({
        twoFactorEnabledCount: sql<number>`count(*) FILTER (WHERE ${settings.twoFactorEnabled} = true)`,
        parentAccessEnabledCount: sql<number>`count(*) FILTER (WHERE ${settings.parentAccessEnabled} = true)`,
        averageSessionTimeout: sql<number>`avg(cast(${settings.sessionTimeout} as numeric))`,
        averageGradingPeriods: sql<number>`avg(${settings.gradingPeriods})`,
      })
      .from(settings);

    return {
      security: {
        twoFactorEnabled: Number(result.twoFactorEnabledCount),
        parentAccessEnabled: Number(result.parentAccessEnabledCount),
        averageSessionTimeout: Number(result.averageSessionTimeout).toFixed(1),
      },
      academic: {
        averageGradingPeriods: Number(result.averageGradingPeriods).toFixed(1),
      }
    };
  }
}