"use client"

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTableContext } from "./TableContext";
import { Card } from "../ui/card";

function TableContent() {

  const {table,columns,showSorting,noResultsText,headerClassName,onRowClick} = useTableContext();

  return (
    <Card className="rounded-md p-0 border overflow-auto ">
      <Table>
        <TableHeader className={headerClassName}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-primary">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-white h-12 ">
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        header.column.getCanSort() && showSorting &&
                        "cursor-pointer select-none"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && showSorting && (
                        <span>
                          {{
                            asc: <ArrowUp className="h-4 w-4" />,
                            desc: <ArrowDown className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown className="h-4 w-4 opacity-50" />
                            )}
                        </span>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick && onRowClick(row.original)}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="h-14 ">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-16 text-center"
              >
                {noResultsText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

export default TableContent;