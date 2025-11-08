import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTableContext } from "./TableContext";


export function TablePagination() {

  const { table, showPagination, pageSizeOptions } = useTableContext();

  if (!showPagination) return null;

  const filteredRows = table.getFilteredRowModel().rows
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()

  const renderPaginationControls = () => (
    <div className="flex items-center space-x-6 lg:space-x-8">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows/page</p>
        <Select
          value={`${pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-auto items-center justify-center text-sm font-medium">
        Page {pageIndex + 1} of {pageCount}
      </div>

      <div className="flex items-center space-x-2">
        <PaginationButton
          icon={<DoubleArrowLeftIcon className="h-4 w-4" />}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="hidden lg:flex"
          label="Go to first page"
        />
        <PaginationButton
          icon={<ChevronLeftIcon className="h-4 w-4" />}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          label="Go to previous page"
        />
        <PaginationButton
          icon={<ChevronRightIcon className="h-4 w-4" />}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          label="Go to next page"
        />
        <PaginationButton
          icon={<DoubleArrowRightIcon className="h-4 w-4" />}
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          className="hidden lg:flex"
          label="Go to last page"
        />
      </div>
    </div>
  )

  return (
    <div className="flex items-center justify-between flex-col md:flex-row gap-2 ">
      <div className="flex-1 text-sm text-muted-foreground hidden md:flex">
        {selectedRows.length} of {filteredRows.length} row(s) selected.
      </div>
      {showPagination && renderPaginationControls()}
    </div>
  )
}

interface PaginationButtonProps {
  icon: React.ReactNode
  onClick: () => void
  disabled: boolean
  label: string
  className?: string
}

const PaginationButton = ({
  icon,
  onClick,
  disabled,
  label,
  className = "",
}: PaginationButtonProps) => (
  <Button
    variant="outline"
    className={`h-8 w-8 p-0 ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    <span className="sr-only">{label}</span>
    {icon}
  </Button>
)