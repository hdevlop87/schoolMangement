import React, { useState } from 'react'
import TableContent from './TableContent'
import { useTable } from './useTable';
import { TablePagination } from './TablePagination';
import { cn } from '@/lib/utils';
import TableHeader from './TableHeader';
import { TableProvider } from './TableContext';
import { addActionsColumn } from './TableActionHelper';
import TableCards from './TableCards';
import { useIsMobile } from '@/hooks/useSidebarResponsive';
import LoadingError from '@/components/LoadingError';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const NTable = ({
   showPagination = true,
   showSorting = true,
   showColumnVisibility = false,
   showAddButton = true,
   data = [],
   columns,
   className = '',
   filters = {},
   noResultsText = "No results.",
   headerClassName = "bg-primary",
   onRowClick = null,
   onAddClick = null,
   onView = null,
   onEdit = null,
   onDelete = null,
   filterPlaceholder = '',
   pageSizeOptions = [10, 20, 30, 40, 50],
   isLoading = false,
   error = null,
   loadingText = "Loading data...",
   noDataText = "No data available",
   onRetry = null,
   showViewToggle = true,
   viewMode: initialViewMode = 'table',
   CardComponent = null,
   addButtonText = '',
}) => {
   const isMobile = useIsMobile();

   // Auto-set cards mode on mobile, otherwise use initialViewMode
   const autoViewMode = isMobile && CardComponent ? 'cards' : initialViewMode;
   const [viewMode, setViewMode] = useState(autoViewMode);

   const hasActions = onView || onEdit || onDelete;
   const finalColumns = hasActions ? addActionsColumn(columns) : columns;
   const { table } = useTable({ data, columns: finalColumns });

   // Split states clearly
   const hasNoData = data.length === 0;
   const showContent = !isLoading && !error && !hasNoData;

   return (
      <TableProvider
         table={table}
         data={data}
         columns={finalColumns}
         filters={filters}
         showSorting={showSorting}
         showPagination={showPagination}
         showColumnVisibility={showColumnVisibility}
         showAddButton={showAddButton}
         onAddClick={onAddClick}
         onView={onView}
         onEdit={onEdit}
         onDelete={onDelete}
         className={className}
         noResultsText={noResultsText}
         headerClassName={headerClassName}
         onRowClick={onRowClick}
         filterPlaceholder={filterPlaceholder}
         pageSizeOptions={pageSizeOptions}
         isLoading={isLoading}
         showViewToggle={showViewToggle}
         viewMode={viewMode}
         setViewMode={setViewMode}
         CardComponent={CardComponent}
         addButtonText={addButtonText}
      >
         <div className='flex flex-col gap-2 h-full overflow-auto '>
            {showContent && <TableHeader />}
            <div className={cn("flex flex-col gap-3 w-full h-full overflow-auto", className)}>
               {isLoading || error || hasNoData ? (
                  <LoadingError
                     isLoading={isLoading}
                     error={error}
                     noData={hasNoData && !isLoading && !error}
                     loadingText={loadingText}
                     noDataText={noDataText}
                     onRetry={onRetry}
                     spinnerVariant="circle"
                     spinnerSize={72}
                  >
                     {hasNoData && !isLoading && !error && showAddButton && onAddClick && (
                        <Button onClick={onAddClick} className="flex items-center gap-2 cursor-pointer">
                           <Plus className="w-4 h-4" />
                           {addButtonText || 'Add New'}
                        </Button>
                     )}
                  </LoadingError>
               ) : (
                  viewMode === 'table' ? <TableContent /> : <TableCards />
               )}
            </div>
         </div>
         {showContent && <TablePagination />}
      </TableProvider>
   );
};

export default NTable