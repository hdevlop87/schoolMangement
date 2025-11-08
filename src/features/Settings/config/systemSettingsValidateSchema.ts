import { z } from 'zod';

export const systemSettingsValidationSchema = (t) => z.object({
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
});

export const updateSystemSettingsValidationSchema = (t) => z.object({
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
});
