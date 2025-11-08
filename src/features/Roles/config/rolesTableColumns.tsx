'use client'
import { Checkbox } from '@/components/ui/checkbox';

export const rolesTableColumns = (t) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('roles.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('roles.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: t('roles.table.id'),
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
    header: t('roles.table.roleName'),
    enableSorting: true,
    enableColumnFilter: false,
    cell: (info) => (
      <div className="font-medium">
        {info.getValue()}
      </div>
    ),
    size: 200,
  },

  {
    accessorKey: "description",
    header: t('roles.table.description'),
    cell: (info) => (
      <div className="text-muted-foreground max-w-[300px] truncate">
        {info.getValue() || t('roles.table.noDescription')}
      </div>
    ),
    size: 300,
  },

];