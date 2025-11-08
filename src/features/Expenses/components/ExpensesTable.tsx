"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { expensesTableConfig } from '../config/expensesTableConfig';
import ExpenseForm from './ExpenseForm';
import { useExpenses } from '../hooks/useExpenses';
import { useTranslation } from '@/hooks/useLanguage';
import { ExpenseCard } from './ExpenseCard';
import { useDialog } from '@/components/NMultiDialog/useDialog';


function ExpensesTable() {

  const { t } = useTranslation();
  const config = expensesTableConfig(t);

  const {
    expenses,
    createExpense,
    updateExpense,
    deleteExpense,
    isExpensesLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useExpenses();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('expenses.dialogs.createTitle'),
      children: <ExpenseForm />,
      primaryButton: {
        form: 'expense-form',
        text: t('expenses.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (expenseData) => {
          await createExpense(expenseData);
        }
      }
    });
  };

  const handleView = (expense) => {
    openDialog({
      title: t('expenses.dialogs.viewTitle'),
      children: <ExpenseCard  />,
      className: 'max-w-3xl',
      showButtons: false,
    });
  };

  const handleEdit = (expense) => {
    openDialog({
      title: `${t('expenses.dialogs.editTitle')} - ${expense.title}`,
      children: <ExpenseForm expense={expense} />,
      primaryButton: {
        form: 'expense-form',
        text: t('expenses.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (expenseData) => {
          await updateExpense(expenseData);
        }
      }
    });
  };

  const handleDelete = (expense) => {
    confirmDelete({
      itemName: expense.title,
      confirmText: t('expenses.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteExpense(expense.id);
      }
    });
  };

  return (
    <NTable
      data={expenses}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isExpensesLoading}
      CardComponent={ExpenseCard}
      addButtonText={t('expenses.dialogs.createButton')}
      viewMode='card'
    />
  );
}

export default ExpensesTable;