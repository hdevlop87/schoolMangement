import { rolesTableColumns } from './rolesTableColumns';

export const rolesTableConfig = (t) => ({
  columns: rolesTableColumns(t),
  filters: [
    {
      type: 'text',
      name: 'name',
      placeholder: t('roles.filters.searchByName'),
    },
    {
      type: 'text',
      name: 'description',
      placeholder: t('roles.filters.searchByDescription'),
    },
  ],
  defaultSort: { id: 'name', desc: false },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
});

export default rolesTableConfig;