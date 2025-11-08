"use client"

import NTable from '@/components/NTable';
import { studentsTableConfig } from '../config/studentsTableConfig';
import FullStudentForm from './FullStudentForm';
import { useStudents } from '../hooks/useStudents';
import { useTranslation } from '@/hooks/useLanguage';
import StudentCard from './StudentCard';
import { useClasses } from '@/hooks/useClasses';
import { useFeeTypes } from '@/features/FeeTypes/hooks/useFeeTypes';
import useDialog from '@/components/NMultiDialog/useDialog';
import SimpleStudentForm from './SimpleStudentForm';

function StudentsTable() {

  const { t } = useTranslation();
  const { classes } = useClasses();
  const { feeTypes } = useFeeTypes();
  const config = studentsTableConfig(t, classes);

  const {
    students,
    createStudent,
    updateStudent,
    deleteStudent,
    isStudentsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useStudents();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('students.dialogs.createTitle'),
      children: <FullStudentForm classes={classes} feeTypes={feeTypes || []} />,
      width: '4xl',
      height: 'full',
      primaryButton: {
        form: 'full-student-form',
        text: t('students.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (combinedData) => {
          await createStudent(combinedData);
        }
      }
    });
  };

  const handleView = (student) => {
    openDialog({
      title: t('students.dialogs.viewTitle'),
      children: <StudentCard data={student} />,
      showButtons: false,
    });
  };

  const handleEdit = (student) => {
    openDialog({
      title: `${t('students.dialogs.editTitle')} - ${student.name}`,
      children: <SimpleStudentForm student={student} classes={classes} />,
      width: '4xl',
      height: 'full',
      primaryButton: {
        form: 'student-form',
        text: t('students.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (combinedData) => {
          await updateStudent(combinedData);
        }
      }
    });
  };

  const handleDelete = (student) => {
    confirmDelete({
      itemName: student.name,
      confirmText: t('students.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteStudent(student.id);
      }
    });
  };

  return (
    <NTable
      data={students}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isStudentsLoading}
      CardComponent={StudentCard}
      addButtonText={t('students.dialogs.createButton')}
      viewMode='card'
    />
  );
}

export default StudentsTable;
