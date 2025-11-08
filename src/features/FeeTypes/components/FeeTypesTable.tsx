"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { feeTypesTableConfig } from '../config/feeTypesTableConfig';
import FeeTypeForm from './FeeTypeForm';
import { useFeeTypes } from '../hooks/useFeeTypes';
import { useTranslation } from '@/hooks/useLanguage';
import FeeTypeCard from './FeeTypeCard';
import { useDialog } from '@/components/NMultiDialog/useDialog';

function FeeTypesTable() {

  const { t } = useTranslation();
  const config = feeTypesTableConfig(t);

  const {
    feeTypes,
    createFeeType,
    updateFeeType,
    deleteFeeType,
    isFeeTypesLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useFeeTypes();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('feeTypes.dialogs.createTitle'),
      children: <FeeTypeForm />,
      primaryButton: {
        form: 'fee-type-form',
        text: t('feeTypes.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (feeTypeData) => {
          await createFeeType(feeTypeData);
        }
      }
    });
  };

  const handleView = (feeType) => {
    openDialog({
      title: t('feeTypes.dialogs.viewTitle'),
      children: <FeeTypeCard data={feeType} />,
      showButtons: false,
    });
  };

  const handleEdit = (feeType) => {
    openDialog({
      title: `${t('feeTypes.dialogs.editTitle')} - ${feeType.name}`,
      children: <FeeTypeForm feeType={feeType}  />,
      primaryButton: {
        form: 'fee-type-form',
        text: t('feeTypes.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (feeTypeData) => {
          await updateFeeType(feeTypeData);
        }
      }
    });
  };

  const handleDelete = (feeType) => {
    confirmDelete({
      itemName: feeType.name,
      confirmText: t('feeTypes.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteFeeType(feeType.id);
      }
    });
  };

  return (
      <NTable
        data={feeTypes}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isFeeTypesLoading}
        CardComponent={FeeTypeCard}
        addButtonText={t('feeTypes.dialogs.createButton')}
        viewMode='cardk'
      />
    );
}

export default FeeTypesTable;
