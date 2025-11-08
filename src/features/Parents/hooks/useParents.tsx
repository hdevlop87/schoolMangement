'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as parentApi from '@/services/parentApi';

export const useParents = (enabled = true) => {
  const crud = useEntityCRUD('parents', {
    getAll: parentApi.getParentsApi,
    getById: parentApi.getParentByIdApi,
    create: parentApi.createParentApi,
    update: parentApi.updateParentApi,
    delete: parentApi.deleteParentApi,
  });

  const { data: parents, isLoading: isParentsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createParent, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateParent, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteParent, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteParents, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    parents,
    getParentById: crud.useGetById,
    isError,
    error,
    refetch,
    createParent,
    updateParent,
    deleteParent,
    bulkDeleteParents,
    isParentsLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};
