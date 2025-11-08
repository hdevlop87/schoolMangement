"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { feesTableConfig } from '../config/feesTableConfig';
import FeeForm from './FeeForm';
import { useFees } from '../hooks/useFees';
import { useTranslation } from '@/hooks/useLanguage';
import FeeCard from './FeeCard';
import { useStudents } from '@/features/Students/hooks/useStudents';
import { useFeeTypes } from '@/features/FeeTypes/hooks/useFeeTypes';
import useDialog from '@/components/NMultiDialog/useDialog';

function FeesTable() {

  const { t } = useTranslation();

  const { students, isStudentsLoading } = useStudents();
  const { feeTypes, isFeeTypesLoading } = useFeeTypes();

  const config = feesTableConfig(t, feeTypes);

  const {
    fees,
    createBulkFees,
    updateFee,
    deleteFee,
    isFeesLoading,
    isUpdating,
    isCreating,
    isBulkCreating,
    isDeleting
  } = useFees();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('fees.dialogs.createTitle'),
      children: <FeeForm students={students} feeTypes={feeTypes} />,
      width:'6xl',
      primaryButton: {
        form: 'bulk-fee-form',
        text: t('fees.dialogs.createButton'),
        loading: isBulkCreating,
        onConfirm: async (feeData) => {
          await createBulkFees(feeData);
        }
      }
    });
  };

  const handleEdit = (fee: any) => {
    openDialog({
      title: `${t('fees.dialogs.editTitle')} - ${fee.student?.name}`,
      children: <FeeForm fee={fee} students={students} feeTypes={feeTypes} />,
      width:'2xl',
      primaryButton: {
        form: 'simple-fee-form',
        text: t('fees.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (feeData) => {
          await updateFee(feeData);
        }
      }
    });
  };

  const handleView = (fee: any) => {
    openDialog({
      title: t('fees.dialogs.viewTitle'),
      children: <FeeCard data={fee} />,
      showButtons: false,
    });
  };


  const handleDelete = (fee) => {
    confirmDelete({
      itemName: `${fee.student?.name} - ${fee.feeType?.name}`,
      confirmText: t('students.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteFee(fee.id);
      }
    });
  };

  return (
    <NTable
      data={fees}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isFeesLoading}
      CardComponent={FeeCard}
      addButtonText={t('fees.dialogs.createButton')}
      viewMode='card'
    />
  );
}

export default FeesTable;
