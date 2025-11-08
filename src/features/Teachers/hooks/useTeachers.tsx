'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as teacherApi from '@/services/teacherApi';

export const useTeachers = (enabled = true) => {
  const crud = useEntityCRUD('teachers', {
    getAll: teacherApi.getTeachersApi,
    getById: teacherApi.getTeacherByIdApi,
    create: teacherApi.createTeacherApi,
    update: teacherApi.updateTeacherApi,
    delete: teacherApi.deleteTeacherApi,
  });

  const { data: teachers, isLoading: isTeachersLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createTeacher, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateTeacher, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteTeacher, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteTeachers, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    teachers,
    getTeacherById: crud.useGetById,
    isError,
    error,
    refetch,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    bulkDeleteTeachers,
    isTeachersLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};
