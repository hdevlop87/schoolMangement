"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import { useTableContext } from './TableContext';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '../ui/label';

const TableAddButton = () => {
  const { onAddClick, showAddButton = false, addButtonText = '' } = useTableContext();
  const { t } = useTranslation();

  if (!showAddButton) {
    return null;
  }

  return (
    <>
      {/* Mobile: Full button with icon and text */}
      <div onClick={onAddClick} className='lg:hidden flex justify-center w-full items-center gap-2 cursor-pointer bg-primary h-10 px-4 rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200'>
        <Plus className="h-5 w-5 text-white" />
        <Label className="text-white text-sm font-medium">{addButtonText || t('common.create')}</Label>
      </div>

      {/* Desktop: Icon only */}
      <div onClick={onAddClick} className='hidden lg:flex justify-center items-center cursor-pointer bg-primary h-10 w-10 p-1 rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200'>
        <Plus className="h-6 w-6 text-white" />
      </div>
    </>
  );
};

export default TableAddButton;