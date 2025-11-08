"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { vehiclesTableConfig } from '../config/vehiclesTableConfig';
import VehicleForm from './VehicleForm';
import { useVehicles } from '../hooks/useVehicles';
import { useTranslation } from '@/hooks/useLanguage';
import VehicleCard from './VehicleCard';
import { useDrivers } from '@/features/Drivers';
import { useDialog } from '@/components/NMultiDialog/useDialog';

function VehiclesTable() {

  const { t } = useTranslation();
  const config = vehiclesTableConfig(t);

const { drivers, isDriversLoading } = useDrivers();

  const {
    vehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    isVehiclesLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useVehicles();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('vehicles.dialogs.createTitle'),
      children: <VehicleForm drivers={drivers}/>,
      primaryButton: {
        form: 'vehicle-form',
        text: t('vehicles.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (vehicleData) => {
          await createVehicle(vehicleData);
        }
      }
    });
  };

  const handleEdit = (vehicle) => {
    openDialog({
      title: `${t('vehicles.dialogs.editTitle')} - ${vehicle.name}`,
      children: <VehicleForm vehicle={vehicle} drivers={drivers}/>,
      primaryButton: {
        form: 'vehicle-form',
        text: t('vehicles.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (vehicleData) => {
          await updateVehicle(vehicleData);
        }
      }
    });
  };
  
  const handleView = (vehicle) => {
    openDialog({
      title: t('vehicles.dialogs.viewTitle'),
      children: <VehicleCard data={vehicle} />,
      showButtons: false,
    });
  };


  const handleDelete = (vehicle) => {
    confirmDelete({
      itemName: vehicle.name,
      confirmText: t('vehicles.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteVehicle(vehicle.id);
      }
    });
  };

  return (
      <NTable
        data={vehicles}
        columns={config.columns}
        filters={config.filters}
        onAddClick={handleAddClick}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isVehiclesLoading}
        CardComponent={VehicleCard}
        addButtonText={t('vehicles.dialogs.createButton')}
        viewMode='table'
      />
    );
}

export default VehiclesTable;