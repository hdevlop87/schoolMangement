import { studentsTableColumns } from './studentsTableColumns';

export const studentsTableConfig = (t, classes = []) => {
  const classOptions = classes?.map(cls => ({
    value: cls.name,
    label: cls.name
  })) || [];

  const sectionOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' }
  ];

  return {
    columns: studentsTableColumns(t),
    filters: [
      {
        name: 'name',
        placeholder: t('students.filters.searchByName'),
        type: 'text',
        className: 'w-full lg:w-64'
      },
      {
        name: 'class',
        placeholder: t('students.filters.filterByClass'),
        type: 'select',
        options: classOptions,
        className: 'w-full lg:w-48'
      },
      {
        name: 'section',
        placeholder: t('students.filters.filterBySection'),
        type: 'select',
        options: sectionOptions,
        className: 'w-full lg:w-48'
      }
    ]
  };
};
