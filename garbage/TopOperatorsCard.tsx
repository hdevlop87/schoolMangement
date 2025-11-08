'use client'

import React from 'react';
import { useTranslation } from '@/hooks/useLanguage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTopOperator } from '../src/features/Dashboard/hooks/useDashboardHooks';
import { Users } from 'lucide-react';
import NCard from '@/components/NCard';

export const TopOperatorsCard = () => {
  const { t } = useTranslation();
  const { topOperators, isTopOperatorsLoading: isLoading } = useTopOperator();

  const operatorsContent = (
    <div className="space-y-4">
      {topOperators?.map((operator) => (
        <div key={operator.operatorId} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={operator.operatorImage} alt="Avatar" />
            <AvatarFallback>{operator.operatorName[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{operator.operatorName}</p>
          </div>
          <div className="ml-auto font-medium">{operator.completedOperations}</div>
        </div>
      ))}
    </div>
  );

  return (
    <NCard
      title={t('operators.topOperators')}
      icon={Users}
      loading={isLoading}
      noData={!topOperators || topOperators.length === 0}
      noDataMessage={t('operators.noTopOperators')}
    >
      {operatorsContent}
    </NCard>
  );
};