'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as studentApi from '@/services/studentApi';

export const useStudents = (enabled = true) => {
  const crud = useEntityCRUD(['students', 'parents', 'fees'], {
    getAll: studentApi.getStudentsApi,
    getById: studentApi.getStudentByIdApi,
    create: studentApi.createStudentApi,
    update: studentApi.updateStudentApi,
    delete: studentApi.deleteStudentApi,
  });

  const { data: students, isLoading: isStudentsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createStudent, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateStudent, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteStudent, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteStudents, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    students,
    getStudentById: crud.useGetById,
    isError,
    error,
    refetch,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDeleteStudents,
    isStudentsLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};
