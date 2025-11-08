'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as userApi from '@/services/userApi';
import { getUserLangApi, updateUserLangApi } from '@/services/userApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUsers = (enabled = true) => {
  const crud = useEntityCRUD(['users', 'operators'], {
    getAll: userApi.getUsersApi,
    getById: userApi.getUserByIdApi,
    create: userApi.createUserApi,
    update: userApi.updateUserApi,
    delete: userApi.deleteUserApi,
  });

  const { data: users, isLoading: isUsersLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createUser, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateUser, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteUser, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteUsers, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    users,
    getUserById: crud.useGetById,
    isError,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    isUsersLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};


