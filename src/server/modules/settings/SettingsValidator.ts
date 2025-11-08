import { Injectable, t } from 'najm-api';
import { SettingsRepository } from './SettingsRepository';
import { parseSchema } from '@/server/shared';
import { settingsSchema } from '@/lib/validations';


@Injectable()
export class SettingsValidator {
  constructor(
    private settingsRepository: SettingsRepository,
  ) {}

  async validateUpdateSettings(data) {
    return parseSchema(settingsSchema, data);
  }

  async isSettingsExists(id: string) {
    const existingSettings = await this.settingsRepository.getById(id);
    return !!existingSettings;
  }

  async isUserHasSettings(userId: string) {
    const userSettings = await this.settingsRepository.getByUserId(userId);
    return !!userSettings;
  }

  validateLanguage(language: string) {
    const validLanguages = ['en', 'fr', 'ar', 'es'];
    if (!validLanguages.includes(language)) {
      throw new Error(t('settings.errors.invalidLanguage'));
    }
    return true;
  }

  validateTheme(theme: string) {
    const validThemes = ['light', 'dark', 'system'];
    if (!validThemes.includes(theme)) {
      throw new Error(t('settings.errors.invalidTheme'));
    }
    return true;
  }

  validateTimeZone(timeZone: string) {
    // Basic timezone validation
    if (!timeZone || timeZone.trim().length === 0) {
      throw new Error(t('settings.errors.invalidTimeZone'));
    }
    return true;
  }

  validateSessionTimeout(timeout: string) {
    const numericTimeout = parseInt(timeout);
    if (isNaN(numericTimeout) || numericTimeout < 5 || numericTimeout > 1440) {
      throw new Error(t('settings.errors.invalidSessionTimeout'));
    }
    return true;
  }

  validateAttendanceRequirement(requirement: string) {
    const numericRequirement = parseFloat(requirement);
    if (isNaN(numericRequirement) || numericRequirement < 0 || numericRequirement > 100) {
      throw new Error(t('settings.errors.invalidAttendanceRequirement'));
    }
    return true;
  }

  validateLateSubmissionPenalty(penalty: string) {
    const numericPenalty = parseFloat(penalty);
    if (isNaN(numericPenalty) || numericPenalty < 0 || numericPenalty > 100) {
      throw new Error(t('settings.errors.invalidLateSubmissionPenalty'));
    }
    return true;
  }

  validateMaxClassSize(size: string) {
    const numericSize = parseInt(size);
    if (isNaN(numericSize) || numericSize < 1 || numericSize > 200) {
      throw new Error(t('settings.errors.invalidMaxClassSize'));
    }
    return true;
  }

  validateGradingPeriods(periods: string) {
    const numericPeriods = parseInt(periods);
    if (isNaN(numericPeriods) || numericPeriods < 1 || numericPeriods > 12) {
      throw new Error(t('settings.errors.invalidGradingPeriods'));
    }
    return true;
  }

  //======================= Existence Checks (throw errors)

  async checkSettingsExists(id: string) {
    const settingsExists = await this.isSettingsExists(id);
    if (!settingsExists) {
      throw new Error(t('settings.errors.notFound'));
    }
    return true;
  }

  async checkUserSettingsExists(userId: string) {
    const userSettings = await this.settingsRepository.getByUserId(userId);
    if (!userSettings) {
      throw new Error(t('settings.errors.userSettingsNotFound'));
    }
    return userSettings;
  }

  //======================= Business Rules Checks

  async checkCanUpdateSettings(userId: string, data: any) {
    // Validate individual fields if provided
    if (data.language) {
      this.validateLanguage(data.language);
    }

    if (data.theme) {
      this.validateTheme(data.theme);
    }

    if (data.timeZone) {
      this.validateTimeZone(data.timeZone);
    }

    if (data.sessionTimeout) {
      this.validateSessionTimeout(data.sessionTimeout);
    }

    if (data.attendanceRequirement) {
      this.validateAttendanceRequirement(data.attendanceRequirement);
    }

    if (data.maxClassSize) {
      this.validateMaxClassSize(data.maxClassSize);
    }

    if (data.gradingPeriods) {
      this.validateGradingPeriods(data.gradingPeriods);
    }

    return true;
  }

  async checkCanResetSettings(userId: string) {
    // Ensure user exists and has settings
    await this.checkUserSettingsExists(userId);
    return true;
  }

  async checkCanDeleteAllSettings() {
    // Get settings count for confirmation
    const count = await this.settingsRepository.getCount();
    if (count.count === 0) {
      throw new Error(t('settings.errors.noSettingsToDelete'));
    }

    return {
      settingsCount: count.count,
      canDelete: true
    };
  }

  //======================= Input Validation Helpers

  validateNotificationPreferences(data: any) {
    const validBooleanFields = [
      'academicAlerts',
      'attendanceAlerts',
      'eventAlerts',
      'homeworkAlerts',
      'feesReminder',
      'emailNotifications',
      'smsNotifications',
      'parentNotifications'
    ];

    for (const field of validBooleanFields) {
      if (data[field] !== undefined && typeof data[field] !== 'boolean') {
        throw new Error(t('settings.errors.invalidNotificationPreference', { field }));
      }
    }
    return true;
  }

  validateSecuritySettings(data: any) {
    const validBooleanFields = [
      'twoFactorEnabled',
      'passwordRequireSymbols',
      'loginNotifications'
    ];

    for (const field of validBooleanFields) {
      if (data[field] !== undefined && typeof data[field] !== 'boolean') {
        throw new Error(t('settings.errors.invalidSecuritySetting', { field }));
      }
    }

    if (data.sessionTimeout) {
      this.validateSessionTimeout(data.sessionTimeout);
    }

    return true;
  }

  validateAcademicSettings(data: any) {
    if (data.attendanceRequirement) {
      this.validateAttendanceRequirement(data.attendanceRequirement);
    }

    if (data.maxClassSize) {
      this.validateMaxClassSize(data.maxClassSize);
    }

    if (data.gradingPeriods) {
      this.validateGradingPeriods(data.gradingPeriods);
    }

    return true;
  }

  validateSchoolSettings(data: any) {
    // Validate required school information fields
    if (data.schoolName && (!data.schoolName.trim() || data.schoolName.length < 2)) {
      throw new Error(t('settings.errors.invalidSchoolName'));
    }

    if (data.currentAcademicYear && !data.currentAcademicYear.match(/^\d{4}-\d{4}$/)) {
      throw new Error(t('settings.errors.invalidAcademicYear'));
    }

    if (data.schoolEmail && data.schoolEmail && !data.schoolEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error(t('settings.errors.invalidSchoolEmail'));
    }

    if (data.schoolPhone && data.schoolPhone && data.schoolPhone.length < 10) {
      throw new Error(t('settings.errors.invalidSchoolPhone'));
    }

    return true;
  }

  validateCurrency(currency: string) {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'MAD', 'AED', 'SAR', 'EGP'];
    if (!validCurrencies.includes(currency)) {
      throw new Error(t('settings.errors.invalidCurrency'));
    }
    return true;
  }

  validateSystemPreferences(data: any) {
    if (data.timeZone) {
      this.validateTimeZone(data.timeZone);
    }

    if (data.language) {
      this.validateLanguage(data.language);
    }

    if (data.theme) {
      this.validateTheme(data.theme);
    }

    // Validate date and time formats
    const validDateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
    if (data.dateFormat && !validDateFormats.includes(data.dateFormat)) {
      throw new Error(t('settings.errors.invalidDateFormat'));
    }

    const validTimeFormats = ['12', '24'];
    if (data.timeFormat && !validTimeFormats.includes(data.timeFormat)) {
      throw new Error(t('settings.errors.invalidTimeFormat'));
    }

    if (data.currency) {
      this.validateCurrency(data.currency);
    }

    return true;
  }

  validateSchoolPreferences(data: any) {
    // Validate school time settings
    if (data.schoolStartTime && !data.schoolStartTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      throw new Error(t('settings.errors.invalidSchoolStartTime'));
    }

    if (data.schoolEndTime && !data.schoolEndTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      throw new Error(t('settings.errors.invalidSchoolEndTime'));
    }

    // Validate lunch break duration (in minutes)
    if (data.lunchBreakDuration) {
      const duration = parseInt(data.lunchBreakDuration);
      if (isNaN(duration) || duration < 15 || duration > 120) {
        throw new Error(t('settings.errors.invalidLunchBreakDuration'));
      }
    }

    return true;
  }
}