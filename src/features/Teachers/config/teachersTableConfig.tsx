import { teachersTableColumns } from './teachersTableColumns';

export const teachersTableConfig = (t) => {
  const statusOptions = [
    { value: 'active', label: t('teachers.status.active') },
    { value: 'inactive', label: t('teachers.status.inactive') },
    { value: 'on_leave', label: t('teachers.status.onLeave') },
  ];

  return {
    columns: teachersTableColumns(t),
    filters: [
      {
        name: 'name',
        placeholder: t('teachers.filters.searchByName'),
        type: 'text',
        className: 'w-full lg:w-64'
      },
      {
        name: 'email',
        placeholder: t('teachers.filters.searchByEmail'),
        type: 'text',
        className: 'w-full lg:w-64'
      },
      {
        name: 'status',
        placeholder: t('teachers.filters.filterByStatus'),
        type: 'select',
        options: statusOptions,
        className: 'w-full lg:w-48'
      }
    ]
  };
};
