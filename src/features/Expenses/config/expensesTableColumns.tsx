import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

// Category labels and styles
const categoryLabels: Record<string, string> = {
  salary: 'Salary',
  utilities: 'Utilities',
  maintenance: 'Maintenance',
  supplies: 'Supplies',
  equipment: 'Equipment',
  transport: 'Transport',
  food: 'Food',
  security: 'Security',
  cleaning: 'Cleaning',
  insurance: 'Insurance',
  rent: 'Rent',
  tax: 'Tax',
  marketing: 'Marketing',
  training: 'Training',
  technology: 'Technology',
  miscellaneous: 'Miscellaneous',
};

// Status styles
const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  approved: { bg: 'bg-green-100', text: 'text-green-800' },
  paid: { bg: 'bg-blue-100', text: 'text-blue-800' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

// Payment method labels
const paymentMethodLabels: Record<string, string> = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  check: 'Check',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  online: 'Online',
  mobile_payment: 'Mobile Payment',
};

export interface Expense {
  id: string;
  category: string;
  title: string;
  amount: number;
  expenseDate: string;
  paymentMethod?: string;
  vendor?: string;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export const expensesTableColumns = (t: (key: string) => string): ColumnDef<Expense>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: t('expenses.table.title'),
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: t('expenses.table.category'),
    cell: ({ getValue }) => {
      const category = getValue<string>();
      return (
        <Badge variant="outline">
          {categoryLabels[category] || category}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: t('expenses.table.amount'),
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return (
        <div className="font-semibold text-green-700">
          ${amount?.toFixed(2) || '0.00'}
        </div>
      );
    },
  },
  {
    accessorKey: 'expenseDate',
    header: t('expenses.table.expenseDate'),
    cell: ({ getValue }) => {
      const date = getValue<string>();
      return new Date(date).toLocaleDateString();
    },
  },
  {
    accessorKey: 'vendor',
    header: t('expenses.table.vendor'),
    cell: ({ getValue }) => getValue<string>() || '-',
  },
  {
    accessorKey: 'paymentMethod',
    header: t('expenses.table.paymentMethod'),
    cell: ({ getValue }) => {
      const method = getValue<string>();
      return paymentMethodLabels[method] || '-';
    },
  },
  {
    accessorKey: 'status',
    header: t('expenses.table.status'),
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const style = statusStyles[status] || statusStyles.pending;
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: 'approvedAt',
    header: t('expenses.table.approvedAt'),
    cell: ({ getValue }) => {
      const date = getValue<string>();
      return date ? new Date(date).toLocaleDateString() : '-';
    },
  },
];