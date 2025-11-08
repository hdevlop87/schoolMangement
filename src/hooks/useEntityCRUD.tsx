'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ApiResponse {
  data: any;
  message: string;
  success: boolean;
}

export const useEntityCRUD = (entities, endpoints) => {
  const queryClient = useQueryClient();

  const entityArray = Array.isArray(entities) ? entities : [entities];
  const primaryEntity = entityArray[0];

  const getError = (error: any) => {
    return error?.response?.data?.message;
  };

  const invalidateAllEntities = () => {
    entityArray.forEach(entity => {
      queryClient.invalidateQueries({ queryKey: [entity] });
    });
  };

  const useGetAll = (enabled = true) => {
    const query: any = useQuery({
      queryKey: [primaryEntity],
      queryFn: endpoints.getAll,
      enabled,
    });

    return {
      data: query.data?.data || [],
      isLoading: query.isPending,
      isError: query.isError,
      error: query.error,
      refetch: query.refetch,
    };
  };

  const useGetById = (id, enabled = true) => {
    const query = useQuery({
      queryKey: [primaryEntity, id],
      queryFn: () => endpoints.getById(id),
      enabled: enabled && !!id,
    });

    return {
      data: query.data?.data || null,
      isLoading: query.isPending,
      isError: query.isError,
      error: query.error,
      refetch: query.refetch,
    };
  };

  const useCreate = () => {
    const mutation = useMutation({
      mutationFn: endpoints.create,
      onSuccess: (response: ApiResponse) => {
        invalidateAllEntities();
        toast.success(response?.message);
      },
      onError: (error) => {
        toast.error(getError(error));
      },
    });

    return {
      mutate: mutation.mutate,
      mutateAsync: mutation.mutateAsync,
      isLoading: mutation.isPending,
      isError: mutation.isError,
      error: mutation.error,
    };
  };

  const useUpdate = () => {
    const mutation = useMutation({
      mutationFn: endpoints.update,
      onSuccess: (response: ApiResponse) => {
        invalidateAllEntities();
        toast.success(response.message);
      },
      onError: (error) => {
        toast.error(getError(error));
      },
    });

    return {
      mutate: mutation.mutate,
      mutateAsync: mutation.mutateAsync,
      isLoading: mutation.isPending,
      isError: mutation.isError,
      error: mutation.error,
    };
  };

  const useDelete = () => {
    const mutation = useMutation({
      mutationFn: endpoints.delete,
      onSuccess: (response: ApiResponse) => {
        invalidateAllEntities(); 
        toast.success(response.message);
      },
      onError: (error) => {
        toast.error(getError(error));
      },
    });

    return {
      mutate: mutation.mutate,
      mutateAsync: mutation.mutateAsync,
      isLoading: mutation.isPending,
      isError: mutation.isError,
      error: mutation.error,
    };
  };

  const useBulkDelete = () => {
    const mutation = useMutation({
      mutationFn: async (ids: string[]) => {
        const promises = ids.map(id => endpoints.delete(id));
        return Promise.all(promises);
      },
      onSuccess: (response) => {
        invalidateAllEntities();
        toast.success('Items deleted successfully');
      },
      onError: (error) => {
        toast.error(getError(error));
      },
    });

    return {
      mutate: mutation.mutate,
      mutateAsync: mutation.mutateAsync,
      isLoading: mutation.isPending,
      isError: mutation.isError,
      error: mutation.error,
    };
  };

  return {
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
    useBulkDelete,
  };
};