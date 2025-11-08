'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as feeTypeApi from '@/services/feeTypeApi';

export const useFeeTypes = (enabled = true) => {
  const crud = useEntityCRUD('feeTypes', {
    getAll: feeTypeApi.getFeeTypesApi,
    getById: feeTypeApi.getFeeTypeByIdApi,
    create: feeTypeApi.createFeeTypeApi,
    update: feeTypeApi.updateFeeTypeApi,
    delete: feeTypeApi.deleteFeeTypeApi,
  });

  const { data: feeTypes, isLoading: isFeeTypesLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createFeeType, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateFeeType, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteFeeType, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteFeeTypes, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    feeTypes,
    getFeeTypeById: crud.useGetById,
    isError,
    error,
    refetch,
    createFeeType,
    updateFeeType,
    deleteFeeType,
    bulkDeleteFeeTypes,
    isFeeTypesLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};
