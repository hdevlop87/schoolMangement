"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useTableContext } from './TableContext';

const TableActionsCol = ({ row }) => {
  const { onView, onEdit, onDelete } = useTableContext();

  if (!onView && !onEdit && !onDelete) {
    return null;
  }

  const handleView = () => {
    if (onView) onView(row.original);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(row.original);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(row.original);
  };

  return (
    <div className="flex items-center gap-4">
      {onView && (
        <Eye size={18} className="text-tertiary cursor-pointer" onClick={handleView} />
      )}

      {onEdit && (
        <Edit size={18} className="text-secondary cursor-pointer" onClick={handleEdit} />
      )}

      {onDelete && (
        <Trash2 size={18} className=" text-red-400 cursor-pointer"  onClick={handleDelete} />
      )}
    </div>
  );
};

export default TableActionsCol;