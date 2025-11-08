"use client";

import React from 'react';
import { User, Phone, Mail, Briefcase, Users } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import { NSectionInfo } from '@/components/NSectionCard';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';


const ParentCard = ({ data }) => {
  const { t } = useTranslation();
  const parent = data;

  const genderDisplay = parent.gender === 'M'
    ? t('common.male')
    : parent.gender === 'F'
      ? t('common.female')
      : parent.gender || t('common.notSpecified');

  const relationshipLabels = {
    father: t('parents.relationships.father'),
    mother: t('parents.relationships.mother'),
    guardian: t('parents.relationships.guardian'),
    stepparent: t('parents.relationships.stepparent'),
    grandparent: t('parents.relationships.grandparent'),
    other: t('parents.relationships.other'),
  };

  const relationshipDisplay = relationshipLabels[parent.relationshipType] || parent.relationshipType;

  return (
    <div className="flex items-start gap-3">
      {/* Avatar - Left Side */}
      <div className="shrink-0">
        <AvatarCell src={parent?.image} name={parent.name} size="lg" showName={false} />
      </div>

      {/* Parent Information - Right Side */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Name */}
        <Label className="text-md font-bold">
          {parent.name}
        </Label>

        <div className="flex items-center gap-2">
          <NSectionInfo
            icon={Users}
            label={t('parents.table.relationship')}
            value={parent.relationship}
            iconColor='text-primary'
          />
          <Badge variant="outline" className='text-primary'>{relationshipDisplay}</Badge>
        </div>

        <NSectionInfo
          icon={Phone}
          label={t('parents.table.phone')}
          value={parent.phone}
        />

        <NSectionInfo
          icon={Briefcase}
          label={t('parents.table.occupation')}
          value={parent.occupation}
        />

      </div>
    </div>
  );
};

export default ParentCard;
