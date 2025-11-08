'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import NForm from '@/components/NForm';
import { unifiedSettingsValidationSchema } from '../config/unifiedSettingsValidateSchema';
import {
  useMySchoolSettings,
  useMySystemPreferences,
  useMySecurityPreferences,
  useMyNotificationPreferences,
  useUpdateMySchoolSettings,
  useUpdateMySystemPreferences,
  useUpdateMySecurityPreferences,
  useUpdateMyNotificationPreferences,
} from '../hooks/useSettings';
import DatabaseSection from './sections/DatabaseSection';
import SchoolSection from './sections/SchoolSection';
import AcademicSection from './sections/AcademicSection';
import SystemSection from './sections/SystemSection';
import SecuritySection from './sections/SecuritySection';
import NotificationSection from './sections/NotificationSection';
import { Separator } from '@/components/ui/separator';

const UnifiedSettingsForm: React.FC = () => {
  const { t } = useTranslation();

  // Fetch all settings data
  const { schoolSettings, isLoading: isSchoolLoading } = useMySchoolSettings();
  const { systemPreferences, isLoading: isSystemLoading } = useMySystemPreferences();
  const { securityPreferences, isLoading: isSecurityLoading } = useMySecurityPreferences();
  const { notificationPreferences, isLoading: isNotificationLoading } = useMyNotificationPreferences();

  // Update mutations
  const { mutate: updateSchoolSettings } = useUpdateMySchoolSettings();
  const { mutate: updateSystemPreferences } = useUpdateMySystemPreferences();
  const { mutate: updateSecurityPreferences } = useUpdateMySecurityPreferences();
  const { mutate: updateNotificationPreferences } = useUpdateMyNotificationPreferences();

  const schema = unifiedSettingsValidationSchema(t);

  // Combine all settings into default values
  const defaultValues = {
    // School settings
    schoolName: schoolSettings?.schoolName || 'My School',
    schoolAddress: schoolSettings?.schoolAddress || '',
    schoolPhone: schoolSettings?.schoolPhone || '',
    schoolEmail: schoolSettings?.schoolEmail || '',
    currentAcademicYear: schoolSettings?.currentAcademicYear || '2025-2026',
    schoolStartTime: schoolSettings?.schoolStartTime || '08:00',
    schoolEndTime: schoolSettings?.schoolEndTime || '15:00',
    lunchBreakDuration: schoolSettings?.lunchBreakDuration || 30,
    attendanceRequirement: schoolSettings?.attendanceRequirement?.toString() || '75',
    maxClassSize: schoolSettings?.maxClassSize || 30,
    gradingPeriods: schoolSettings?.gradingPeriods || 4,

    // System preferences
    timeZone: systemPreferences?.timeZone || 'UTC',
    language: systemPreferences?.language || 'en',
    theme: systemPreferences?.theme || 'system',
    dateFormat: systemPreferences?.dateFormat || 'MM/DD/YYYY',
    timeFormat: systemPreferences?.timeFormat || '12',
    currency: systemPreferences?.currency || 'USD',

    // Security preferences
    twoFactorAuth: securityPreferences?.twoFactorAuth ?? false,
    sessionTimeout: securityPreferences?.sessionTimeout ?? true,
    passwordExpiry: securityPreferences?.passwordExpiry ?? false,
    loginNotifications: securityPreferences?.loginNotifications ?? true,
    parentAccessEnabled: securityPreferences?.parentAccessEnabled ?? true,

    // Notification preferences
    academicAlerts: notificationPreferences?.academicAlerts ?? true,
    attendanceAlerts: notificationPreferences?.attendanceAlerts ?? true,
    eventAlerts: notificationPreferences?.eventAlerts ?? true,
    homeworkAlerts: notificationPreferences?.homeworkAlerts ?? true,
    feesReminder: notificationPreferences?.feesReminder ?? true,
    emailNotifications: notificationPreferences?.emailNotifications ?? false,
    smsNotifications: notificationPreferences?.smsNotifications ?? false,
    parentNotifications: notificationPreferences?.parentNotifications ?? true,
  };

  const handleSubmit = (data: any) => {
    // Split data and send to appropriate endpoints
    const schoolData = {
      schoolName: data.schoolName,
      schoolAddress: data.schoolAddress,
      schoolPhone: data.schoolPhone,
      schoolEmail: data.schoolEmail,
      currentAcademicYear: data.currentAcademicYear,
      schoolStartTime: data.schoolStartTime,
      schoolEndTime: data.schoolEndTime,
      lunchBreakDuration: data.lunchBreakDuration,
      attendanceRequirement: data.attendanceRequirement,
      maxClassSize: data.maxClassSize,
      gradingPeriods: data.gradingPeriods,
    };

    const systemData = {
      timeZone: data.timeZone,
      language: data.language,
      theme: data.theme,
      dateFormat: data.dateFormat,
      timeFormat: data.timeFormat,
      currency: data.currency,
    };

    const securityData = {
      twoFactorAuth: data.twoFactorAuth,
      sessionTimeout: data.sessionTimeout,
      passwordExpiry: data.passwordExpiry,
      loginNotifications: data.loginNotifications,
      parentAccessEnabled: data.parentAccessEnabled,
    };

    const notificationData = {
      academicAlerts: data.academicAlerts,
      attendanceAlerts: data.attendanceAlerts,
      eventAlerts: data.eventAlerts,
      homeworkAlerts: data.homeworkAlerts,
      feesReminder: data.feesReminder,
      emailNotifications: data.emailNotifications,
      smsNotifications: data.smsNotifications,
      parentNotifications: data.parentNotifications,
    };

    // Update all settings
    updateSchoolSettings(schoolData);
    updateSystemPreferences(systemData);
    updateSecurityPreferences(securityData);
    updateNotificationPreferences(notificationData);
  };

  const isLoading = isSchoolLoading || isSystemLoading || isSecurityLoading || isNotificationLoading;

  // if (isLoading) {
  //   return (
  //     <Card>
  //       <CardHeader>
  //         <CardTitle className="flex items-center gap-2">
  //           <Settings className="h-5 w-5" />
  //           {t('settings.title') || 'Settings'}
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <p className="text-sm text-muted-foreground">Loading settings...</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (

    <NForm
      id="unified-settings-form"
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    >
      <div className='grid grid-cols-8  gap-2'>
        <div className="flex flex-col col-span-2">
          <DatabaseSection />
        </div>

        <Card className="flex p-4 gap-3 col-span-4">
          <SchoolSection />
          <Separator className='bg-tertiary'/>
          <AcademicSection />
          <Separator className='bg-tertiary'/>
          <SystemSection />
        </Card>

        <Card className="flex p-4 gap-3 col-span-2">
          <SecuritySection />
          <Separator className='bg-tertiary'/>
          <NotificationSection />
        </Card>

      </div>

    </NForm>

  );
};

export default UnifiedSettingsForm;