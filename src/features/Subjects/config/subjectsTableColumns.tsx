import { Checkbox } from '@/components/ui/checkbox';

export const subjectsTableColumns = (t) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('subjects.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('subjects.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: t('subjects.table.id'),
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {getValue()}
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: t('subjects.table.code'),
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-medium text-sm uppercase">
        {getValue()}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: t('subjects.table.name'),
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-medium text-sm">
        {getValue()}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: t('subjects.table.description'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const description = getValue();
      if (!description) return <span className="text-gray-400">{t('common.noDescription')}</span>;
      return (
        <div className="text-sm text-muted-foreground max-w-xs truncate">
          {description}
        </div>
      );
    },
  },
];
