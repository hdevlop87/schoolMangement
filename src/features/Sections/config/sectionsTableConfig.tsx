import { sectionsTableColumns } from './sectionsTableColumns';

export const sectionsTableConfig = (t) => ({
  columns: sectionsTableColumns(t),
  filters: [
    {
      name: 'name',
      placeholder: t('sections.filters.searchByName'),
      type: 'text',
    }
  ]
});
