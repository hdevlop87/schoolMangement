import { subjectsTableColumns } from './subjectsTableColumns';

export const subjectsTableConfig = (t) => ({
  columns: subjectsTableColumns(t),
  filters: [
    {
      name: 'name',
      placeholder: t('subjects.filters.searchByName'),
      type: 'text',
    }
  ]
});
