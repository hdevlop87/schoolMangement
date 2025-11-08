import { AvatarCell } from '@/components/NAvatarCell';
import {NStatusBadge} from '@/components/NStatusBadge';
import { Checkbox } from '@/components/ui/checkbox';


export const parentsTableColumns = (t) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('parents.table.selectAll')}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('parents.table.selectRow')}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: t('parents.table.name'),
    cell: ({ row }) => {
      const parent = row.original;
      return <AvatarCell src={parent?.image} name={parent.name} size='sm' />;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: t('parents.table.email'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const email = getValue();
      return email || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
  {
    accessorKey: 'phone',
    header: t('parents.table.phone'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const phone = getValue();
      return phone || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
  {
    accessorKey: "relationshipType",
    header: t('parents.table.relationship'),
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => {
      const relationship = getValue();
      if (!relationship) return <span className="text-gray-400">{t('common.notSpecified')}</span>;

      const relationshipLabels = {
        father: t('parents.relationships.father'),
        mother: t('parents.relationships.mother'),
        guardian: t('parents.relationships.guardian'),
        stepparent: t('parents.relationships.stepparent'),
        grandparent: t('parents.relationships.grandparent'),
        other: t('parents.relationships.other'),
      };

      return <NStatusBadge status={relationship} >{relationshipLabels[relationship] || relationship}</NStatusBadge>;
    },
  },
  {
    accessorKey: "gender",
    header: t('parents.table.gender'),
    enableSorting: true,
    cell: ({ getValue }) => {
      const gender = getValue();
      if (!gender) return <span className="text-gray-400">{t('common.notSpecified')}</span>;
      return gender === 'M' ? t('common.male') : gender === 'F' ? t('common.female') : gender;
    },
  },
  {
    accessorKey: "cin",
    header: t('parents.table.cin'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const cin = getValue();
      return cin || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
  {
    accessorKey: "occupation",
    header: t('parents.table.occupation'),
    enableSorting: false,
    cell: ({ getValue }) => {
      const occupation = getValue();
      return occupation || <span className="text-gray-400">{t('common.notAvailable')}</span>;
    },
  },
];
