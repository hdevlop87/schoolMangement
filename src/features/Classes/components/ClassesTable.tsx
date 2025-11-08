"use client"

import NTable from '@/components/NTable';
import { classesTableConfig } from '../config/classesTableConfig';
import ClassForm from './ClassForm';
import { useClasses } from '../hooks/useClasses';
import { useTranslation } from '@/hooks/useLanguage';
import ClassCard from './ClassCard';
import { useDialog } from '@/components/NMultiDialog/useDialog';

function ClassesTable() {

  const { t } = useTranslation();
  const config = classesTableConfig(t);

  const {
    classes,
    createClass,
    updateClass,
    deleteClass,
    isClassesLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useClasses();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('classes.dialogs.createTitle'),
      children: <ClassForm />,
      primaryButton: {
        form: 'class-form',
        text: t('classes.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (classData) => {
          await createClass(classData);
        }
      }
    });
  };
  
  const handleEdit = (classData) => {
    openDialog({
      title: `${t('classes.dialogs.editTitle')} - ${classData.name}`,
      children: <ClassForm classData={classData} />,
      primaryButton: {
        form: 'class-form',
        text: t('classes.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (formData) => {
          await updateClass(formData);
        }
      }
    });
  };

  const handleView = (classData) => {
    openDialog({
      title: t('classes.dialogs.viewTitle'),
      children: <ClassCard data={classData} />,
      showButtons: false,
    });
  };


  const handleDelete = (classData) => {
    confirmDelete({
      itemName: classData.name,
      confirmText: t('classes.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteClass(classData.id);
      }
    });
  };

  return (
    <NTable
      data={classes}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isClassesLoading}
      CardComponent={ClassCard}
      addButtonText={t('classes.dialogs.createButton')}
      viewMode='table'
    />
  );
}

export default ClassesTable;
