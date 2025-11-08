"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { subjectsTableConfig } from '../config/subjectsTableConfig';
import SubjectForm from './SubjectForm';
import { useSubjects } from '../hooks/useSubjects';
import { useTranslation } from '@/hooks/useLanguage';
import SubjectCard from './SubjectCard';
import { useDialog } from '@/components/NMultiDialog/useDialog';

function SubjectsTable() {

  const { t } = useTranslation();
  const config = subjectsTableConfig(t);

  const {
    subjects,
    createSubject,
    updateSubject,
    deleteSubject,
    isSubjectsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useSubjects();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('subjects.dialogs.createTitle'),
      children: <SubjectForm />,
      primaryButton: {
        form: 'subject-form',
        text: t('subjects.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (subjectData) => {
          await createSubject(subjectData);
        }
      }
    });
  };

  const handleView = (subject) => {
    openDialog({
      title: t('subjects.dialogs.viewTitle'),
      children: <SubjectCard data={subject} />,
      showButtons: false,
    });
  };

  const handleEdit = (subject) => {
    openDialog({
      title: `${t('subjects.dialogs.editTitle')} - ${subject.name}`,
      children: <SubjectForm subject={subject} />,
      primaryButton: {
        form: 'subject-form',
        text: t('subjects.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (subjectData) => {
          await updateSubject(subjectData);
        }
      }
    });
  };

  const handleDelete = (subject) => {
    confirmDelete({
      itemName: subject.name,
      confirmText: t('subjects.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteSubject(subject.id);
      }
    });
  };

  return (
    <NTable
      data={subjects}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isSubjectsLoading}
      CardComponent={SubjectCard}
      addButtonText={t('subjects.dialogs.createButton')}
      viewMode='table'
    />
  );
}

export default SubjectsTable;
