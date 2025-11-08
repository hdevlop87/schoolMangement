import { usersTableColumns } from './usersTableColumns';

export const usersTableConfig = (t) => ({
  columns: usersTableColumns(t),
  filters: [
    {
      type: "text",
      name: "name",
      placeholder: t('users.filters.searchByName'),
    },
    {
      type: "text", 
      name: "email",
      placeholder: t('users.filters.searchByEmail'),
    },
    {
      type: "select",
      name: "roleName", 
      placeholder: t('users.filters.filterByRole'),
      options: [
        { value: "admin", label: t('users.roles.admin') },
        { value: "user", label: t('users.roles.user') },
        { value: "moderator", label: t('users.roles.moderator') },
      ],
    },
  ],
  defaultSort: { id: 'name', desc: true },
  pageSize: 10,
  enableSelection: true,
  enableActions: true,
});

export default usersTableConfig;