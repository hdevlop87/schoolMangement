'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as feeApi from '@/services/feeApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useFees = (enabled = true) => {
  const queryClient = useQueryClient();
  const crud = useEntityCRUD('fees', {
    getAll: feeApi.getFeesApi,
    getById: feeApi.getFeeByIdApi,
    create: feeApi.createFeeApi,
    update: feeApi.updateFeeApi,
    delete: feeApi.deleteFeeApi,
  });

  const { data: fees, isLoading: isFeesLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createFee, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateFee, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteFee, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteFees, isLoading: isBulkDeleting } = crud.useBulkDelete();

  const { mutateAsync: createBulkFees, isLoading: isBulkCreating } = useMutation({
    mutationFn: feeApi.createBulkFeesApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast.success(response?.message || 'Fees created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create fees';
      toast.error(errorMessage);
    },
  });

  return {
    fees,
    getFeeById: crud.useGetById,
    isError,
    error,
    refetch,
    createFee,
    createBulkFees,
    updateFee,
    deleteFee,
    bulkDeleteFees,
    isFeesLoading,
    isCreating,
    isBulkCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};
