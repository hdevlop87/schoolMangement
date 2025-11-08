"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { parentsTableConfig } from '../config/parentsTableConfig';
import ParentForm from './SimpleParentForm';
import { useParents } from '../hooks/useParents';
import { useTranslation } from '@/hooks/useLanguage';
import ParentCard from './ParentCard';
import { useDialog } from '@/components/NMultiDialog/useDialog';
import BulkParentForm from './BulkParentForm';

function ParentsTable() {

  const { t } = useTranslation();
  const config = parentsTableConfig(t);

  const {
    parents,
    createParent,
    updateParent,
    deleteParent,
    isParentsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useParents();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('parents.dialogs.createTitleMany'),
      children: <ParentForm />,
      width:'4xl',
      primaryButton: {
        form: 'parent-form',
        text: t('parents.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (parentData) => {
          await createParent(parentData);
        }
      }
    });
  };

  const handleView = (parent) => {
    openDialog({
      title: t('parents.dialogs.viewTitle'),
      children: <ParentCard data={parent} />,
      size: 'full',
      showButtons: false,
    });
  };

  const handleEdit = (parent) => {
    openDialog({
      title: `${t('parents.dialogs.editTitle')} - ${parent.name}`,
      children: <ParentForm parent={parent} />,
      width:'4xl',
      primaryButton: {
        form: 'parent-form',
        text: t('parents.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (parentData) => {
          await updateParent(parentData);
        }
      }
    });
  };

  const handleDelete = (parent) => {
    confirmDelete({
      itemName: parent.name,
      confirmText: t('parents.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteParent(parent.id);
      }
    });
  };

  return (
      <NTable
        data={parents}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isParentsLoading}
        CardComponent={ParentCard}
        addButtonText={t('parents.dialogs.createButton')}
        viewMode='card'
      />
    );
}

export default ParentsTable;
