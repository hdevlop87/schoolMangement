import { z } from 'zod';

export const academicSettingsValidationSchema = (t) => z.object({
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
});

export const updateAcademicSettingsValidationSchema = (t) => academicSettingsValidationSchema(t);
