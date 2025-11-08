'use client';

import NCard from '@/components/NCard';
import React from 'react';
import { DonutChart } from './Donut';
import { Legend } from './Legend';
import { useStudentsByGender } from '../../hooks/useDashboardHooks';
import { CalendarIcon, UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Main Component
const StudentsChart = ({className=''}) => {
   const { data: studentData, isLoading, error, refetch } = useStudentsByGender();

   return (
      <NCard
         title={'Students'}
         icon={UsersIcon}
         className={cn('flex justify-center items-center h-full',className)}
         loading={isLoading}
         error={error}
         noData={!studentData || studentData.length === 0}
         onRetry={() => refetch()}
      >
         <DonutChart data={studentData || []} />
         <Legend data={studentData || []} />
      </NCard>
   );
};

export default StudentsChart;