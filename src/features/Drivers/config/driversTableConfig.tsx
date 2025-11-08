import { driversTableColumns } from './driversTableColumns';

export const driversTableConfig = (t) => {
  const statusOptions = [
    { value: 'active', label: t('drivers.status.active') },
    { value: 'inactive', label: t('drivers.status.inactive') },
    { value: 'on_leave', label: t('drivers.status.onLeave') },
    { value: 'suspended', label: t('drivers.status.suspended') },
  ];

  return {
    columns: driversTableColumns(t),
    filters: [
      {
        name: 'name',
        placeholder: t('drivers.filters.searchByName'),
        type: 'text',
        className: 'w-full lg:w-64'
      },
      {
        name: 'licenseNumber',
        placeholder: t('drivers.filters.searchByLicense'),
        type: 'text',
        className: 'w-full lg:w-64'
      },
      {
        name: 'status',
        placeholder: t('drivers.filters.filterByStatus'),
        type: 'select',
        options: statusOptions,
        className: 'w-full lg:w-48'
      }
    ]
  };
};