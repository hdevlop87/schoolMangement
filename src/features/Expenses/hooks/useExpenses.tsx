'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as expenseApi from '@/services/expenseApi';

export const useExpenses = (enabled = true) => {
  const crud = useEntityCRUD('expenses', {
    getAll: expenseApi.getExpensesApi,
    getById: expenseApi.getExpenseByIdApi,
    create: expenseApi.createExpenseApi,
    update: expenseApi.updateExpenseApi,
    delete: expenseApi.deleteExpenseApi,
  });

  const { data: expenses, isLoading: isExpensesLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createExpense, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateExpense, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteExpense, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteExpenses, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    expenses,
    getExpenseById: crud.useGetById,
    isError,
    error,
    refetch,
    createExpense,
    updateExpense,
    deleteExpense,
    bulkDeleteExpenses,
    isExpensesLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};