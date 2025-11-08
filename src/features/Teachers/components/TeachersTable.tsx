"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { teachersTableConfig } from '../config/teachersTableConfig';
import TeacherForm from './TeacherForm';
import { useTeachers } from '../hooks/useTeachers';
import { useTranslation } from '@/hooks/useLanguage';
import TeacherCard from './TeacherCard';
import useDialog from '@/components/NMultiDialog/useDialog';
import { useClasses } from '@/features/Classes/hooks/useClasses';
import { useSubjects } from '@/features/Subjects/hooks/useSubjects';

function TeachersTable() {

  const { t } = useTranslation();
  const config = teachersTableConfig(t);

  const {
    teachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    isTeachersLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useTeachers();

  const { classes } = useClasses();
  const { subjects } = useSubjects();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('teachers.dialogs.createTitle'),
      children: <TeacherForm classes={classes} subjects={subjects} />,
      width:'4xl',
      height:'xl',
      primaryButton: {
        form: 'teacher-form',
        text: t('teachers.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (teacherData) => {
          await createTeacher(teacherData);
        }
      }
    });
  };

  const handleView = (teacher) => {
    openDialog({
      title: t('teachers.dialogs.viewTitle'),
      children: <TeacherCard data={teacher} />,
      showButtons: false,
    });
  };

  const handleEdit = (teacher) => {
    openDialog({
      title: `${t('teachers.dialogs.editTitle')} - ${teacher.name}`,
      children: <TeacherForm teacher={teacher} classes={classes} subjects={subjects} />,
      width:'4xl',
      height:'xxl',
      primaryButton: {
        form: 'teacher-form',
        text: t('teachers.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (teacherData) => {
          await updateTeacher(teacherData);
        }
      }
    });
  };

  const handleDelete = (teacher) => {
    confirmDelete({
      itemName: teacher.name,
      confirmText: t('teachers.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteTeacher(teacher.id);
      }
    });
  };

  return (
    <NTable
      data={teachers}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isTeachersLoading}
      CardComponent={TeacherCard}
      addButtonText={t('teachers.dialogs.createButton')}
      viewMode='card'
    />
  );
}

export default TeachersTable;
