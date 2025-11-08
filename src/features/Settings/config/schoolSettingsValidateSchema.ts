import { z } from 'zod';

export const schoolSettingsValidationSchema = (t) => z.object({
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
});

export const updateSchoolSettingsValidationSchema = (t) => schoolSettingsValidationSchema(t);
