import { z } from 'zod';

export const unifiedSettingsValidationSchema = (t: any) => z.object({
  // School Section
  schoolName: z.string().min(1, { message: t('settings.validation.schoolNameRequired') || 'School name is required' }),
  schoolAddress: z.string().min(1, { message: t('settings.validation.schoolAddressRequired') || 'School address is required' }),
  schoolPhone: z.string().min(1, { message: t('settings.validation.schoolPhoneRequired') || 'School phone is required' }),
  schoolEmail: z.string().email({ message: t('settings.validation.schoolEmailInvalid') || 'Invalid email address' }),
  currentAcademicYear: z.string()
    .min(1, { message: t('settings.validation.academicYearRequired') || 'Academic year is required' })
    .regex(/^\d{4}-\d{4}$/, { message: t('settings.validation.academicYearFormat') || 'Format must be YYYY-YYYY (e.g., 2025-2026)' }),
  schoolStartTime: z.string().min(1, { message: t('settings.validation.startTimeRequired') || 'School start time is required' }),
  schoolEndTime: z.string().min(1, { message: t('settings.validation.endTimeRequired') || 'School end time is required' }),
  lunchBreakDuration: z.number()
    .min(15, { message: t('settings.validation.lunchBreakMin') || 'Lunch break must be at least 15 minutes' })
    .max(120, { message: t('settings.validation.lunchBreakMax') || 'Lunch break cannot exceed 120 minutes' }),

  // Academic Section
  attendanceRequirement: z.string()
    .min(1, { message: t('settings.validation.attendanceRequired') || 'Attendance requirement is required' })
    .refine(val => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, { message: t('settings.validation.attendanceRange') || 'Attendance must be between 0 and 100' }),
  maxClassSize: z.number()
    .min(1, { message: t('settings.validation.maxClassSizeMin') || 'Class size must be at least 1' })
    .max(200, { message: t('settings.validation.maxClassSizeMax') || 'Class size cannot exceed 200' }),
  gradingPeriods: z.number()
    .min(1, { message: t('settings.validation.gradingPeriodsMin') || 'Must have at least 1 grading period' })
    .max(12, { message: t('settings.validation.gradingPeriodsMax') || 'Cannot exceed 12 grading periods' }),

  // System Section
  timeZone: z.string().min(1, { message: t('settings.validation.timeZoneRequired') || 'Time zone is required' }),
  language: z.enum(['en', 'fr', 'ar', 'es'], {
    message: t('settings.validation.languageRequired') || 'Language is required'
  }),
  theme: z.enum(['light', 'dark', 'system'], {
    message: t('settings.validation.themeRequired') || 'Theme is required'
  }),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], {
    message: t('settings.validation.dateFormatRequired') || 'Date format is required'
  }),
  timeFormat: z.enum(['12', '24'], {
    message: t('settings.validation.timeFormatRequired') || 'Time format is required'
  }),
  currency: z.string().min(1, { message: t('settings.validation.currencyRequired') || 'Currency is required' }),

  // Security Section
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.boolean().default(true),
  passwordExpiry: z.boolean().default(false),
  loginNotifications: z.boolean().default(true),
  parentAccessEnabled: z.boolean().default(true),

  // Notification Section
  academicAlerts: z.boolean().default(true),
  attendanceAlerts: z.boolean().default(true),
  eventAlerts: z.boolean().default(true),
  homeworkAlerts: z.boolean().default(true),
  feesReminder: z.boolean().default(true),
  emailNotifications: z.boolean().default(false),
  smsNotifications: z.boolean().default(false),
  parentNotifications: z.boolean().default(true),
});

export type UnifiedSettingsFormData = z.infer<ReturnType<typeof unifiedSettingsValidationSchema>>;