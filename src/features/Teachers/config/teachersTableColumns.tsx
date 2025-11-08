import { AvatarCell } from '@/components/NAvatarCell';
import {NStatusBadge} from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';

export const teachersTableColumns = (t) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('teachers.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('teachers.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: t('teachers.table.name'),
    cell: ({ row }) => {
      const teacher = row.original;
      return <AvatarCell src={teacher?.image} name={teacher.name} size='sm' />;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: t('teachers.table.email'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const email = getValue();
      return email || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
  {
    accessorKey: 'phone',
    header: t('teachers.table.phone'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const phone = getValue();
      return phone || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
  {
    accessorKey: "specialization",
    header: t('teachers.table.specialization'),
    enableSorting: true,
    cell: ({ getValue }) => {
      const specialization = getValue();
      return specialization || <span className="text-gray-400">{t('common.notSpecified')}</span>;
    },
  },
  {
    accessorKey: "cin",
    header: t('teachers.table.cin'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const cin = getValue();
      return cin || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
  {
    accessorKey: "hireDate",
    header: t('teachers.table.hireDate'),
    enableSorting: true,
    cell: ({ getValue }) => {
      const hireDate = getValue();
      if (!hireDate) return <span className="text-gray-400">{t('common.notAvailable')}</span>;
      return new Date(hireDate).toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: t('teachers.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const status = getValue();
      return <NStatusBadge status={status} />;
    },
    size: 120,
  },
];
