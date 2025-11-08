'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as vehicleApi from '@/services/vehicleApi';

export const useVehicles = (enabled = true) => {
  const crud = useEntityCRUD('vehicles', {
    getAll: vehicleApi.getVehiclesApi,
    getById: vehicleApi.getVehicleByIdApi,
    create: vehicleApi.createVehicleApi,
    update: vehicleApi.updateVehicleApi,
    delete: vehicleApi.deleteVehicleApi,
  });

  const { data: vehicles, isLoading: isVehiclesLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createVehicle, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateVehicle, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteVehicle, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteVehicles, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    vehicles,
    getVehicleById: crud.useGetById,
    isError,
    error,
    refetch,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    bulkDeleteVehicles,
    isVehiclesLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};