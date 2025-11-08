'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as driverApi from '@/services/driverApi';

export const useDrivers = (enabled = true) => {
  const crud = useEntityCRUD('drivers', {
    getAll: driverApi.getDriversApi,
    getById: driverApi.getDriverByIdApi,
    create: driverApi.createDriverApi,
    update: driverApi.updateDriverApi,
    delete: driverApi.deleteDriverApi,
  });

  const { data: drivers, isLoading: isDriversLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createDriver, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateDriver, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteDriver, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteDrivers, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    drivers,
    getDriverById: crud.useGetById,
    isError,
    error,
    refetch,
    createDriver,
    updateDriver,
    deleteDriver,
    bulkDeleteDrivers,
    isDriversLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};