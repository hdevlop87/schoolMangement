import React, { createContext, useContext, ReactNode } from 'react';

const TableContext = createContext(null);

export function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
}

export function TableProvider({
  children,
  table,
  data,
  columns,
  filters,
  showSorting,
  showPagination,
  showColumnVisibility,
  showAddButton,
  onView,
  onEdit,
  onDelete,
  onAddClick,
  className,
  noResultsText,
  headerClassName,
  onRowClick,
  filterPlaceholder,
  pageSizeOptions,
  isLoading,
  viewMode,
  setViewMode,
  showViewToggle,
  CardComponent,
  addButtonText,
}) {
  const contextValue = {
    table,
    data,
    columns,
    filters,
    showSorting,
    showPagination,
    showColumnVisibility,
    showAddButton,
    onView,
    onEdit,
    onDelete,
    onAddClick,
    className,
    noResultsText,
    headerClassName,
    onRowClick,
    filterPlaceholder,
    pageSizeOptions,
    isLoading,
    viewMode,
    setViewMode,
    showViewToggle,
    CardComponent,
    addButtonText,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}