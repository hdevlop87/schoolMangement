import { AvatarCell } from '@/components/NAvatarCell';
import {NStatusBadge} from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';

export const studentsTableColumns = (t) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('students.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('students.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "studentCode",
    header: t('students.table.studentCode'),
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-medium text-sm">
        {getValue()}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: t('students.table.name'),
    cell: ({ row }) => {
      const student = row.original;
      return <AvatarCell src={student?.image} name={student.name} size='sm' />;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: t('students.table.email'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const email = getValue();
      return email || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
  {
    accessorKey: 'class',
    accessorFn: (row) => row.class?.name || '',
    header: t('students.table.class'),
    cell: ({ row }) => {
      const className = row.original.class?.name;
      return className || <span className="text-gray-400">{t('common.notAssigned')}</span>;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: 'section',
    accessorFn: (row) => row.section?.name || '',
    header: t('students.table.section'),
    cell: ({ row }) => {
      const sectionName = row.original.section?.name;
      return sectionName || <span className="text-gray-400">{t('common.notAssigned')}</span>;
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "gender",
    header: t('students.table.gender'),
    enableSorting: true,
    cell: ({ getValue }) => {
      const gender = getValue();
      if (!gender) return <span className="text-gray-400">{t('common.notSpecified')}</span>;
      return gender === 'M' ? t('common.male') : gender === 'F' ? t('common.female') : gender;
    },
  },
  {
    accessorKey: "status",
    header: t('students.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const status = getValue();
      return <NStatusBadge status={status} />;
    },
    size: 120,
  },
];
