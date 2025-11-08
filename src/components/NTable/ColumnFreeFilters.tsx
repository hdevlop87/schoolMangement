"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Filter {
  type: 'text' | 'select';
  name: string;
  placeholder: string;
  options?: Array<{value: string, label: string}>;
}

interface ColumnFreeFiltersProps {
  filters: Filter[];
  onFiltersChange: (filters: Record<string, any>) => void;
}

export const ColumnFreeFilters: React.FC<ColumnFreeFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const updateFilter = (name: string, value: any) => {
    const newFilters = {
      ...filterValues,
      [name]: value === '' || value === 'all' ? undefined : value
    };
    setFilterValues(newFilters);
    onFiltersChange(newFilters);
  };

  if (!filters || filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 w-full">
      {filters.map((filter) => (
        <div key={filter.name} className="flex flex-col w-full lg:w-62">
          {filter.type === "text" ? (
            <Input
              value={filterValues[filter.name] || ""}
              onChange={(e) => updateFilter(filter.name, e.target.value)}
              placeholder={filter.placeholder}
            />
          ) : (
            <Select
              value={filterValues[filter.name] || ""}
              onValueChange={(value) => updateFilter(filter.name, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
    </div>
  );
};