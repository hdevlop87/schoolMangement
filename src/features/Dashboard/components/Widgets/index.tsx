'use client'

import React from 'react';
import InfoWidget from './Widget';
import { useDashboardWidgets } from '@/features/Dashboard/hooks/useDashboardHooks';
import { useTranslation } from '@/hooks/useLanguage';
import studentImage from '@/assets/images/studentImage.png';
import teacherImage from '@/assets/images/teacherImage.png';
import parentsImage from '@/assets/images/parentsImage.png';
import feesImage from '@/assets/images/feesImage.png';
import expensesImage from '@/assets/images/incomeImage.png';

const imageMap = {
  studentImage,
  teacherImage,
  parentsImage,
  feesImage,
  expensesImage,
};

const Widgets = () => {
  const { data } = useDashboardWidgets();
  const { t } = useTranslation();

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3'>
      {data?.map((widget, index) => (
        <InfoWidget
          key={index}
          title={t(widget.title)}
          image={imageMap[widget.icon as keyof typeof imageMap]}
          value={widget.value}
        />
      ))}
    </div>
  );
};

export default Widgets;