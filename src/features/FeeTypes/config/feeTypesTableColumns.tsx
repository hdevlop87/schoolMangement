import { NStatusBadge } from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';

export const feeTypesTableColumns = (t: any) => [
  {
    id: "select",
    header: ({ table }: any) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('feeTypes.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }: any) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label={t('feeTypes.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: t('feeTypes.table.id'),
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {getValue()}
      </div>
    ),
  },

  {
    accessorKey: "name",
    header: t('feeTypes.table.name'),
    enableSorting: true,
    cell: ({ getValue }: any) => (
      <div className="font-medium text-sm">
        {getValue()}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: t('feeTypes.table.category'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }: any) => {
      const category = getValue();
      const categoryMap: Record<string, string> = {
        'tuition': t('feeTypes.category.tuition'),
        'registration': t('feeTypes.category.registration'),
        'books': t('feeTypes.category.books'),
        'transport': t('feeTypes.category.transport'),
        'activities': t('feeTypes.category.activities'),
        'lunch': t('feeTypes.category.lunch'),
        'exam': t('feeTypes.category.exam'),
        'uniform': t('feeTypes.category.uniform'),
        'other': t('feeTypes.category.other'),
      };
      return categoryMap[category] || category;
    },
  },
  {
    accessorKey: "amount",
    header: t('feeTypes.table.amount'),
    enableSorting: true,
    cell: ({ getValue }: any) => {
      const amount = getValue();
      return `${Number(amount).toFixed(2)} ${t('common.currency')}`;
    },
  },
  {
    accessorKey: "paymentType",
    header: t('feeTypes.table.paymentType'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }: any) => {
      const paymentType = getValue();
      const paymentTypeMap: Record<string, string> = {
        'recurring': t('feeTypes.paymentType.recurring'),
        'oneTime': t('feeTypes.paymentType.oneTime'),
      };
      return paymentTypeMap[paymentType] || paymentType;
    },
  },
  {
    accessorKey: "description",
    header: t('feeTypes.table.description'),
    enableSorting: false,
    cell: ({ getValue }: any) => {
      const description = getValue();
      return description || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
  {
    accessorKey: "isActive",
    header: t('feeTypes.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }: any) => {
      const isActive = getValue();
      return <NStatusBadge status={isActive ? 'active' : 'inactive'} />;
    },
    size: 120,
  },
];
