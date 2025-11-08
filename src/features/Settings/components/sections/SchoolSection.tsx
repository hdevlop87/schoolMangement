'use client'

import React from 'react';
import { Building2, Mail, Phone, Calendar, Clock } from 'lucide-react';
import FormInput from '@/components/NForm/FormInput';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';

const SchoolSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-center gap-2 font-semibold text-sm">
        <Building2 className="h-5 w-5" />
        <Label className='text-lg'> {t('settings.school.title')} </Label>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <FormInput
          name="schoolName"
          type="text"
          formLabel={t('settings.school.schoolName') || 'School Name'}
          icon={Building2}
          iconColor="#3b82f6"
          placeholder="My School"
          required={true}
        />

        <FormInput
          name="schoolAddress"
          type="text"
          formLabel={t('settings.school.schoolAddress') || 'School Address'}
          icon={Building2}
          iconColor="#10b981"
          placeholder="123 Education Street, City, State 12345"
          required={true}
        />

        <FormInput
          name="schoolPhone"
          type="text"
          formLabel={t('settings.school.schoolPhone') || 'School Phone'}
          icon={Phone}
          iconColor="#f59e0b"
          placeholder="+1234567890"
          required={true}
        />

        <FormInput
          name="schoolEmail"
          type="text"
          formLabel={t('settings.school.schoolEmail') || 'School Email'}
          icon={Mail}
          iconColor="#8b5cf6"
          placeholder="info@myschool.edu"
          required={true}
        />

        <FormInput
          name="currentAcademicYear"
          type="text"
          formLabel={t('settings.school.currentAcademicYear') || 'Current Academic Year'}
          icon={Calendar}
          iconColor="#ec4899"
          placeholder="2025-2026"
          required={true}
        />

        <FormInput
          name="schoolStartTime"
          type="time"
          formLabel={t('settings.school.schoolStartTime') || 'School Start Time'}
          icon={Clock}
          iconColor="#3b82f6"
          required={true}
        />

        <FormInput
          name="schoolEndTime"
          type="time"
          formLabel={t('settings.school.schoolEndTime') || 'School End Time'}
          icon={Clock}
          iconColor="#f59e0b"
          required={true}
        />

        <FormInput
          name="lunchBreakDuration"
          type="number"
          formLabel={t('settings.school.lunchBreakDuration') || 'Lunch Break Duration (minutes)'}
          icon={Clock}
          iconColor="#10b981"
          required={true}
        />
      </div>
    </div>
  );
};

export default SchoolSection;