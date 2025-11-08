import {NStatusBadge} from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';

export const sectionsTableColumns = (t) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('sections.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('sections.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: t('sections.table.id'),
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-mono text-xs text-muted-foreground">
        {getValue()}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: t('sections.table.sectionName'),
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-medium text-sm">
        {getValue()}
      </div>
    ),
  },
  {
    accessorKey: 'class',
    header: t('sections.table.class'),
    cell: ({ row }) => {
      const className = row.original.class?.name;
      const academicYear = row.original.class?.academicYear;
      return (
        <div>
          <div className="font-medium">{className || <span className="text-gray-400">{t('common.notAssigned')}</span>}</div>
          {academicYear && <div className="text-xs text-gray-500">{academicYear}</div>}
        </div>
      );
    },
    enableSorting: true,
  },
    {
    accessorKey: 'class.level',
    header: t('sections.table.level'),
    enableSorting: true,
    cell: ({ row }) => {
      const level = row.original.class?.level;
      return level ? (
        <div className="font-medium text-sm">{level}</div>
      ) : (
        <span className="text-gray-400">{t('common.notAssigned')}</span>        
      );
    },
  },
    {
    accessorKey: 'class.description',
    header: t('sections.table.description'),
    enableSorting: true,
    cell: ({ row }) => {
      const description = row.original.class?.description;
      return description ? (
        <div className="text-sm text-gray-700 truncate" 
  title={description}>{description}</div>
      ) : (
        <span className="text-gray-400">{t('common.notAssigned')}</span>        
      );
    },
  },
  {
    accessorKey: "roomNumber",
    header: t('sections.table.roomNumber'),
    enableSorting: true,
    cell: ({ getValue }) => {
      const room = getValue();
      return room || <span className="text-gray-400">{t('common.notAssigned')}</span>;
    },
  },
  {
    accessorKey: "maxStudents",
    header: t('sections.table.capacity'),
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-medium text-sm">
        {getValue() || 30}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: t('sections.table.status'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const status = getValue();
      return <NStatusBadge status={status} />;
    },
    size: 120,
  },
];
