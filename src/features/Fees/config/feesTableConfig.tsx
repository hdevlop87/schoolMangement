import { feesTableColumns } from './feesTableColumns';

export const feesTableConfig = (t: any, feeTypes = []) => {
  const feeTypeOptions = feeTypes?.map((ft: any) => ({
    value: ft.name,
    label: ft.name
  })) || [];

  const statusOptions = [
    { value: 'pending', label: t('fees.status.pending') },
    { value: 'paid', label: t('fees.status.paid') },
    { value: 'overdue', label: t('fees.status.overdue') }
  ];

  return {
    columns: feesTableColumns(t),
    filters: [
      {
        name: 'student',
        placeholder: t('fees.filters.searchByStudent'),
        type: 'text',
        className: 'w-full lg:w-64'
      },
      {
        name: 'feeType',
        placeholder: t('fees.filters.filterByFeeType'),
        type: 'select',
        options: feeTypeOptions,
        className: 'w-full lg:w-48'
      },
      {
        name: 'status',
        placeholder: t('fees.filters.filterByStatus'),
        type: 'select',
        options: statusOptions,
        className: 'w-full lg:w-48'
      }
    ]
  };
};
