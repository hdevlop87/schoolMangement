import { classesTableColumns } from './classesTableColumns';

export const classesTableConfig = (t) => ({
  columns: classesTableColumns(t),
  filters: [
    {
      name: 'name',
      placeholder: t('classes.filters.searchByName'),
      type: 'text',
    }
  ]
});
