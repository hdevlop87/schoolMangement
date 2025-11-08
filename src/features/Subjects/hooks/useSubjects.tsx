'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as subjectApi from '@/services/subjectApi';

export const useSubjects = (enabled = true) => {
  const crud = useEntityCRUD('subjects', {
    getAll: subjectApi.getSubjectsApi,
    getById: subjectApi.getSubjectByIdApi,
    create: subjectApi.createSubjectApi,
    update: subjectApi.updateSubjectApi,
    delete: subjectApi.deleteSubjectApi,
  });

  const { data: subjects, isLoading: isSubjectsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createSubject, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateSubject, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteSubject, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteSubjects, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    subjects,
    getSubjectById: crud.useGetById,
    isError,
    error,
    refetch,
    createSubject,
    updateSubject,
    deleteSubject,
    bulkDeleteSubjects,
    isSubjectsLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};
