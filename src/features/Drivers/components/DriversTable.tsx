"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { driversTableConfig } from '../config/driversTableConfig';
import DriverForm from './DriverForm';
import { useDrivers } from '../hooks/useDrivers';
import { useTranslation } from '@/hooks/useLanguage';
import DriverCard from './DriverCard';
import useDialog from '@/components/NMultiDialog/useDialog';

function DriversTable() {

  const { t } = useTranslation();
  const config = driversTableConfig(t);

  const {
    drivers,
    createDriver,
    updateDriver,
    deleteDriver,
    isDriversLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useDrivers();


  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('drivers.dialogs.createTitle'),
      children: <DriverForm />,
      width:'5xl',
      primaryButton: {
        form: 'driver-form',
        text: t('drivers.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (driverData) => {
          await createDriver(driverData);
        }
      }
    });
  };
  
  const handleEdit = (driver) => {
    openDialog({
      title: `${t('drivers.dialogs.editTitle')} - ${driver.name}`,
      children: <DriverForm driver={driver} />,
      width:'5xl',
      primaryButton: {
        form: 'driver-form',
        text: t('drivers.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (driverData) => {
          await updateDriver(driverData);
        }
      }
    });
  };

  const handleView = (driver) => {
    openDialog({
      title: t('drivers.dialogs.viewTitle'),
      children: <DriverCard data={driver} />,
      showButtons: false,
    });
  };


  const handleDelete = (driver) => {
    confirmDelete({
      itemName: driver.name,
      confirmText: t('drivers.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteDriver(driver.id);
      }
    });
  };

  return (
    <NTable
      data={drivers}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isDriversLoading}
      CardComponent={DriverCard}
      addButtonText={t('drivers.dialogs.createButton')}
      viewMode='card'
    />
  );
}

export default DriversTable;