"use client";

import React from "react";
import { TextInput, SelectInput } from "@/components/NInputs";
import { useTableContext } from "./TableContext";

export function TextFilter({ name, placeholder,...rest }) {
  const { table } = useTableContext();
  const column = table.getColumn(name);

  if (!column) return null;

  return (
    <TextInput
      value={(column.getFilterValue() as string) ?? ""}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={placeholder}
      icon="search"
      showIcon={true}
      {...rest}
    />
  );
}

export function SelectFilter({ name, options, placeholder,...rest }) {
  const { table } = useTableContext();
  const column = table.getColumn(name);

  if (!column) return null;

  const effectivePlaceholder = placeholder || "Filter...";

  const normalizedOptions = options.map((option) => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return option;
  });

  // Add "All" option at the beginning
  const allOptions = [
    { value: "__clear__", label: "All" },
    ...normalizedOptions
  ];

  return (
    <SelectInput
      value={(column.getFilterValue() as string) ?? ""}
      onChange={(value) => {
        if (value === "" || value === "__clear__") {
          column.setFilterValue(undefined);
        } else {
          column.setFilterValue(value);
        }
      }}
      items={allOptions}
      placeholder={effectivePlaceholder}
      icon="filter"
      showIcon={true}
      {...rest}
    />
  );
}

export function TableFilters() {
  const { table, filters, showColumnVisibility, showAddButton, showViewToggle } = useTableContext();

  if (!filters || filters.length === 0) {
    return null;
  }

  const hasControls = showColumnVisibility || showAddButton || showViewToggle;

  return (
    <div className={`flex flex-wrap gap-4 ${hasControls ? 'w-full' : 'w-full'}`}>
      {filters.map((filter) => {
        const column = table.getColumn(filter.name);
        if (!column) return null;
        const defaultWidth = !hasControls && filters.length === 1 ? 'w-full' : 'w-full lg:w-62';

        return (
          <div key={filter.name} className={`flex  flex-col ${filter.className || defaultWidth}`}>
            {filter.type === "text" ? (
              <TextFilter
                name={filter.name}
                placeholder={filter.placeholder}
                className='bg-card border-muted-foreground'
              />
            ) : (
              <SelectFilter
                name={filter.name}
                options={filter.options || []}
                placeholder={filter.placeholder}
                className='bg-card border-muted-foreground'
              />
            )}
          </div>
        );
      })}
    </div>
  );
}