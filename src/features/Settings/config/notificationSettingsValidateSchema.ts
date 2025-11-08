import { z } from 'zod';

export const notificationSettingsSchema = z.object({
  academicAlerts: z.boolean().default(true),
  attendanceAlerts: z.boolean().default(true),
  emailNotifications: z.boolean().default(false),
  smsNotifications: z.boolean().default(false),
  parentNotifications: z.boolean().default(true),
});

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
