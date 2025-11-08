import { AvatarCell } from '@/components/NAvatarCell';
import {NStatusBadge} from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';

export const feesTableColumns = (t: any) => [
  {
    id: "select",
    header: ({ table }: any) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('fees.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }: any) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label={t('fees.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "student",
    header: t('fees.table.student'),
    cell: ({ row }: any) => {
      const student = row.original.student;
      return student ? (
        <AvatarCell src={student.image} name={student.name} size='sm' />
      ) : (
        <span className="text-gray-400">{t('common.notAvailable')}</span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "feeType",
    accessorFn: (row: any) => row.feeType?.name || '',
    header: t('fees.table.feeType'),
    cell: ({ row }: any) => {
      const feeType = row.original.feeType?.name;
      return feeType || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "academicYear",
    header: t('fees.table.academicYear'),
    enableSorting: true,
    cell: ({ getValue }: any) => (
      <div className="font-medium text-sm">
        {getValue()}
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: t('fees.table.schedule'),
    enableSorting: true,
    cell: ({ getValue }: any) => {
      const schedule = getValue();
      const scheduleMap: Record<string, string> = {
        'monthly': t('fees.schedule.monthly'),
        'quarterly': t('fees.schedule.quarterly'),
        'semester': t('fees.schedule.semester'),
        'annually': t('fees.schedule.annually'),
        'oneTime': t('fees.schedule.oneTime'),
      };
      return scheduleMap[schedule] || schedule;
    },
  },
  {
    accessorKey: "totalAmount",
    header: t('fees.table.totalAmount'),
    enableSorting: true,
    cell: ({ getValue }: any) => {
      const amount = getValue();
      return `${Number(amount).toFixed(2)} ${t('common.currency')}`;
    },
  },
  {
    accessorKey: "paidAmount",
    header: t('fees.table.paidAmount'),
    enableSorting: true,
    cell: ({ getValue }: any) => {
      const amount = getValue();
      return `${Number(amount).toFixed(2)} ${t('common.currency')}`;
    },
  },
  {
    accessorKey: "status",
    header: t('fees.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }: any) => {
      const status = getValue();
      return <NStatusBadge status={status} />;
    },
    size: 120,
  },
];
