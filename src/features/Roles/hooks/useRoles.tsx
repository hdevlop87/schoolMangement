'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as roleApi from '@/services/roleApi';

export const useRoles = (enabled = true) => {
  const crud = useEntityCRUD('roles', {
    getAll: roleApi.getRolesApi,
    create: roleApi.createRoleApi,
    update: roleApi.updateRoleApi,
    delete: roleApi.deleteRoleApi,
  });

  const { data: roles, isLoading: isRolesLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createRole, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateRole, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteRole, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteRoles, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    roles,
    isRolesLoading,
    isError,
    error,
    refetch,
    createRole,
    updateRole,
    deleteRole,
    bulkDeleteRoles,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};