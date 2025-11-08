import { z } from 'zod';

export const securitySettingsSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.boolean().default(true),
  passwordExpiry: z.boolean().default(false),
  loginNotifications: z.boolean().default(true),
});

export type SecuritySettingsFormData = z.infer<typeof securitySettingsSchema>;
