'use client'

import React from 'react';
import { BookOpen, Users, BarChart3 } from 'lucide-react';
import FormInput from '@/components/NForm/FormInput';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';

const AcademicSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-center gap-2 font-semibold text-sm">
        <BookOpen className="h-5 w-5" />
        <Label className='text-lg'> {t('settings.academic.title')} </Label>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <FormInput
          name="attendanceRequirement"
          type="text"
          formLabel={t('settings.academic.attendanceRequirement') || 'Attendance Requirement (%)'}
          icon={BarChart3}
          iconColor="#3b82f6"
          placeholder="75"
          required={true}
        />

        <FormInput
          name="maxClassSize"
          type="number"
          formLabel={t('settings.academic.maxClassSize') || 'Maximum Class Size'}
          icon={Users}
          iconColor="#10b981"
          required={true}
        />

        <FormInput
          name="gradingPeriods"
          type="number"
          formLabel={t('settings.academic.gradingPeriods') || 'Grading Periods'}
          icon={BookOpen}
          iconColor="#f59e0b"
          required={true}
        />
      </div>
    </div>
  );
};

export default AcademicSection;