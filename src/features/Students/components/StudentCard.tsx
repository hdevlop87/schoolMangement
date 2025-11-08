"use client";

import React from 'react';
import { User, GraduationCap, BookOpen } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import { NSectionInfo } from '@/components/NSectionCard';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';

const StudentCard = ({ data }) => {
  const { t } = useTranslation();
  const student = data;

  const genderDisplay = student.gender === 'M'
    ? t('common.male')
    : student.gender === 'F'
    ? t('common.female')
    : student.gender || t('common.notSpecified');

  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0">
        <AvatarCell src={student?.image} name={student.name} size="lg" showName={false} />
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <Label className="text-md font-bold">
          {student.name}
        </Label>

        <div className="space-y-2">
          <NSectionInfo
            icon={User}
            iconColor="text-muted-foreground"
            label={t('students.table.gender')}
            value={genderDisplay}
          />

          <NSectionInfo
            icon={GraduationCap}
            iconColor="text-primary"
            label={t('students.table.class')}
            value={student.class.name}
            valueColor="text-primary"
          />

          <NSectionInfo
            icon={BookOpen}
            iconColor="text-primary"
            label={t('students.table.section')}
            value={student.section.name}
            valueColor="text-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentCard;