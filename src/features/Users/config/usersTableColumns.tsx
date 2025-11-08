import { AvatarCell } from '@/components/NAvatarCell';
import {NStatusBadge} from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';

export const usersTableColumns = (t) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('users.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('users.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: t('users.table.id'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: ({ getValue }) => (
      <div className="text-sm text-gray-500">
        #{getValue()}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "name",
    header: t('users.table.name'),
    cell: ({ row }) => {
      const user = row.original;
      return <AvatarCell src={user.image} name={user.name} />;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: t('users.table.email'),
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: t('users.table.role'),
  },
  {
    accessorKey: "status",
    header: t('users.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const status = getValue();
      return <NStatusBadge status={status} />;
    },
    size: 120,
  },
];