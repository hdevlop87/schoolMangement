"use client"

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTableContext } from "./TableContext";

export default function TableColumnView() {
  const { table, showColumnVisibility } = useTableContext();

  if (!showColumnVisibility) return null;

  return (
    <Select>
      <SelectTrigger >
        <SelectValue placeholder="Colonnes" />
      </SelectTrigger>
      <SelectContent>

        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <div key={column.id} className="flex items-center space-x-2 py-1">
              <Checkbox
                id={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(checked) =>
                  column.toggleVisibility(!!checked)
                }
              />
              <label
                htmlFor={column.id}
                className="capitalize cursor-pointer text-sm"
              >
                {column.id}
              </label>
            </div>
          ))}

      </SelectContent>
    </Select>
  );
}