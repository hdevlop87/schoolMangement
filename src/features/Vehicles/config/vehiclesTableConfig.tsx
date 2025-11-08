import { vehiclesTableColumns } from './vehiclesTableColumns';

export const vehiclesTableConfig = (t) => ({
  columns: vehiclesTableColumns(t),
  filters: [
    {
      name: 'name',
      placeholder: t('vehicles.filters.searchByName'),
      type: 'text',
    },
    {
      name: 'licensePlate',
      placeholder: t('vehicles.filters.searchByLicensePlate'),
      type: 'text',
    }
  ]
});