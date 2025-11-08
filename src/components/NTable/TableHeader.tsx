import React from 'react'
import { TableFilters } from './TableFilters'
import ColumnVisibility from './TableView'
import TableAddButton from './TableAddButton'
import { TableModeButtons } from './TableModeButtons'
import { useTableContext } from './TableContext'

const TableHeader = () => {
  const { showColumnVisibility, showAddButton, showViewToggle } = useTableContext();

  // Check if any controls should be shown
  const hasControls = showColumnVisibility || showAddButton || showViewToggle;

  return (
    <div className={`flex items-center gap-4 ${hasControls ? 'justify-between flex-col lg:flex-row' : 'justify-start'}`}>
      <TableFilters />
      {hasControls && (
        <div className='flex gap-2 w-full lg:w-auto'>
          <TableModeButtons />
          <TableAddButton />
          <ColumnVisibility />
        </div>
      )}
    </div>
  )
}

export default TableHeader