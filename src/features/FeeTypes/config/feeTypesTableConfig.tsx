import { feeTypesTableColumns } from './feeTypesTableColumns';

export const feeTypesTableConfig = (t: any) => {
  const categoryOptions = [
    { value: 'tuition', label: t('feeTypes.category.tuition') },
    { value: 'registration', label: t('feeTypes.category.registration') },
    { value: 'books', label: t('feeTypes.category.books') },
    { value: 'transport', label: t('feeTypes.category.transport') },
    { value: 'activities', label: t('feeTypes.category.activities') },
    { value: 'lunch', label: t('feeTypes.category.lunch') },
    { value: 'exam', label: t('feeTypes.category.exam') },
    { value: 'uniform', label: t('feeTypes.category.uniform') },
    { value: 'other', label: t('feeTypes.category.other') },
  ];

  return {
    columns: feeTypesTableColumns(t),
    filters: [
      {
        name: 'name',
        placeholder: t('feeTypes.filters.searchByName'),
        type: 'text',
        className: 'w-full lg:w-64'
      },
      {
        name: 'category',
        placeholder: t('feeTypes.filters.filterByCategory'),
        type: 'select',
        options: categoryOptions,
        className: 'w-full lg:w-48'
      }
    ]
  };
};
