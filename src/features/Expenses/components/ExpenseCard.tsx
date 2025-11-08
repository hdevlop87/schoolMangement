'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useLanguage';
import { Expense } from '../config/expensesTableColumns';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

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

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  approved: { bg: 'bg-green-100', text: 'text-green-800' },
  paid: { bg: 'bg-blue-100', text: 'text-blue-800' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

const paymentMethodLabels: Record<string, string> = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  check: 'Check',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  online: 'Online',
  mobile_payment: 'Mobile Payment',
};

export const ExpenseCard = ({
  expense,
  onEdit,
  onDelete,
  isDeleting = false,
}: ExpenseCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      {/* Header with Title and Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
            {expense.title}
          </h3>
          <Badge variant="outline" className="mt-2">
            {categoryLabels[expense.category] || expense.category}
          </Badge>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[expense.status].bg} ${statusStyles[expense.status].text}`}>
          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
        </span>
      </div>

      {/* Amount */}
      <div className="mb-4 pb-4 border-b">
        <div className="text-2xl font-bold text-green-700">
          ${expense.amount?.toFixed(2) || '0.00'}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t('expenses.card.totalAmount')}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">{t('expenses.card.expenseDate')}:</span>
          <span className="text-sm font-medium">
            {new Date(expense.expenseDate).toLocaleDateString()}
          </span>
        </div>

        {expense.vendor && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('expenses.card.vendor')}:</span>
            <span className="text-sm font-medium line-clamp-1">{expense.vendor}</span>
          </div>
        )}

        {expense.paymentMethod && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('expenses.card.paymentMethod')}:</span>
            <span className="text-sm font-medium">
              {paymentMethodLabels[expense.paymentMethod] || expense.paymentMethod}
            </span>
          </div>
        )}

        {expense.approvedAt && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('expenses.card.approvedAt')}:</span>
            <span className="text-sm font-medium">
              {new Date(expense.approvedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {expense.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600 mb-1">{t('expenses.card.notes')}:</p>
          <p className="text-sm text-gray-700 line-clamp-3">{expense.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(expense)}
          disabled={isDeleting}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          {t('common.edit')}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(expense.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('common.delete')}
        </Button>
      </div>
    </Card>
  );
};