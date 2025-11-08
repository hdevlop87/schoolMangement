import { Injectable } from 'najm-api';
import { SettingsRepository } from './SettingsRepository';
import { SettingsValidator } from './SettingsValidator';

@Injectable()
export class SettingsService {
  constructor(
    private settingsRepository: SettingsRepository,
    private settingsValidator: SettingsValidator,
  ) {}

  async getAll() {
    return await this.settingsRepository.getAll();
  }

  async getById(id: string) {
    await this.settingsValidator.checkSettingsExists(id);
    return await this.settingsRepository.getById(id);
  }

  async getByUserId(userId: string) {
    let userSettings = await this.settingsRepository.getByUserId(userId);
    
    // If no settings exist for user, create default settings
    if (!userSettings) {
      userSettings = await this.settingsRepository.createDefaultForUser(userId);
    }
    
    return userSettings;
  }

  async getCount() {
    return await this.settingsRepository.getCount();
  }

  async create(data: any) {
    try {
      await this.settingsValidator.validateUpdateSettings(data);
      await this.settingsValidator.checkCanUpdateSettings(data.userId, data);
      
      return await this.settingsRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, data: any) {
    await this.settingsValidator.checkSettingsExists(id);
    
    const settings = await this.settingsRepository.getById(id);
    await this.settingsValidator.checkCanUpdateSettings(settings.userId, data);
    
    return await this.settingsRepository.update(id, data);
  }

  async updateByUserId(userId: string, data: any) {
    try {
      await this.settingsValidator.validateUpdateSettings(data);
      await this.settingsValidator.checkCanUpdateSettings(userId, data);
      
      // Upsert settings (create if doesn't exist, update if exists)
      const updatedSettings = await this.settingsRepository.upsert(userId, data);
      
      return updatedSettings;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    await this.settingsValidator.checkSettingsExists(id);
    return await this.settingsRepository.delete(id);
  }

  async deleteByUserId(userId: string) {
    await this.settingsValidator.checkUserSettingsExists(userId);
    return await this.settingsRepository.deleteByUserId(userId);
  }

  async resetUserSettings(userId: string) {
    try {
      await this.settingsValidator.checkCanResetSettings(userId);
      
      // Delete existing settings
      await this.settingsRepository.deleteByUserId(userId);
      
      // Create new default settings
      const defaultSettings = await this.settingsRepository.createDefaultForUser(userId);
      
      return defaultSettings;
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    await this.settingsValidator.checkCanDeleteAllSettings();
    return await this.settingsRepository.deleteAll();
  }

  // Helper methods to get specific preference types
  async getUserPreference(userId: string, preference: string) {
    const settings = await this.getByUserId(userId);
    return settings[preference];
  }

  async updateUserPreference(userId: string, preference: string, value: any) {
    const updateData = { [preference]: value };
    return this.updateByUserId(userId, updateData);
  }

  // Get language preference for user
  async getUserLanguage(userId: string) {
    return await this.settingsRepository.getUserLanguage(userId);
  }

  // Get theme preference for user
  async getUserTheme(userId: string) {
    return await this.settingsRepository.getUserTheme(userId);
  }

  // Get notification preferences for user
  async getNotificationPreferences(userId: string) {
    return await this.settingsRepository.getNotificationSettings(userId);
  }

  // Get security preferences for user
  async getSecurityPreferences(userId: string) {
    return await this.settingsRepository.getSecuritySettings(userId);
  }

  // Get academic preferences for user
  async getAcademicPreferences(userId: string) {
    return await this.settingsRepository.getAcademicSettings(userId);
  }

  // Get school settings for user (admin only)
  async getSchoolPreferences(userId: string) {
    return await this.settingsRepository.getSchoolSettings(userId);
  }

  // Get system preferences for user
  async getSystemPreferences(userId: string) {
    return await this.settingsRepository.getPreferenceSettings(userId);
  }

  // Update specific preference categories with validation
  async updateNotificationPreferences(userId: string, data: any) {
    this.settingsValidator.validateNotificationPreferences(data);
    return this.updateByUserId(userId, data);
  }

  async updateSecurityPreferences(userId: string, data: any) {
    this.settingsValidator.validateSecuritySettings(data);
    return this.updateByUserId(userId, data);
  }

  async updateAcademicPreferences(userId: string, data: any) {
    this.settingsValidator.validateAcademicSettings(data);
    return this.updateByUserId(userId, data);
  }

  async updateSchoolPreferences(userId: string, data: any) {
    this.settingsValidator.validateSchoolSettings(data);
    this.settingsValidator.validateSchoolPreferences(data);
    return this.updateByUserId(userId, data);
  }

  async updateSystemPreferences(userId: string, data: any) {
    this.settingsValidator.validateSystemPreferences(data);
    return this.updateByUserId(userId, data);
  }

  // Analytics methods
  async getLanguageDistribution() {
    return await this.settingsRepository.getLanguageDistribution();
  }

  async getThemeDistribution() {
    return await this.settingsRepository.getThemeDistribution();
  }

  async getNotificationAnalytics() {
    return await this.settingsRepository.getNotificationEnabledCount();
  }

  async getSettingsWithUsers() {
    return await this.settingsRepository.getSettingsWithUsers();
  }

  // New analytics methods for student management
  async getAcademicYearDistribution() {
    return await this.settingsRepository.getAcademicYearDistribution();
  }

  async getAttendanceRequirementStats() {
    return await this.settingsRepository.getAttendanceRequirementStats();
  }

  async getClassSizeDistribution() {
    return await this.settingsRepository.getClassSizeDistribution();
  }

  async getSystemPreferencesAnalytics() {
    return await this.settingsRepository.getSystemPreferencesAnalytics();
  }

  // Comprehensive settings analytics dashboard
  async getSettingsAnalytics() {
    const [
      languageDistribution,
      themeDistribution,
      notificationAnalytics,
      academicYearDistribution,
      attendanceStats,
      classSizeDistribution,
      systemAnalytics
    ] = await Promise.all([
      this.getLanguageDistribution(),
      this.getThemeDistribution(),
      this.getNotificationAnalytics(),
      this.getAcademicYearDistribution(),
      this.getAttendanceRequirementStats(),
      this.getClassSizeDistribution(),
      this.getSystemPreferencesAnalytics()
    ]);

    return {
      preferences: {
        language: languageDistribution,
        theme: themeDistribution,
      },
      notifications: notificationAnalytics,
      academic: {
        academicYears: academicYearDistribution,
        attendanceRequirements: attendanceStats,
        classSizes: classSizeDistribution,
      },
      system: systemAnalytics,
    };
  }

  // Seed demo settings for multiple users
  async seedDemoSettings(settingsData: any[]) {
    const createdSettings = [];
    for (const settingData of settingsData) {
      try {
        const settings = await this.create(settingData);
        createdSettings.push(settings);
      } catch (error) {
        continue;
      }
    }

    return createdSettings;
  }

  // Helper methods for specific academic settings
  async getCurrentAcademicYear(userId: string) {
    const settings = await this.getByUserId(userId);
    return settings?.currentAcademicYear || '2025-2026';
  }

  async getGradingScale(userId: string) {
    const settings = await this.getByUserId(userId);
    return settings?.gradingScale || {
      A: { min: 90, max: 100, gpa: 4.0 },
      B: { min: 80, max: 89, gpa: 3.0 },
      C: { min: 70, max: 79, gpa: 2.0 },
      D: { min: 60, max: 69, gpa: 1.0 },
      F: { min: 0, max: 59, gpa: 0.0 }
    };
  }

  async getAttendanceRequirement(userId: string) {
    const settings = await this.getByUserId(userId);
    return settings?.attendanceRequirement || 75.00;
  }

  async getMaxClassSize(userId: string) {
    const settings = await this.getByUserId(userId);
    return settings?.maxClassSize || 30;
  }
}