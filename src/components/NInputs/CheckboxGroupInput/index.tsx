"use client";

import React from "react";
import { CheckboxGroupInputProps } from "../type";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import NIcon from "@/components/NIcon";
import { Label } from "@/components/ui/label";
import BaseInput from "../Box";

const CheckboxGroupForm: React.FC<CheckboxGroupInputProps> = ({
  value,
  onChange,
  className = "",
  variant = 'default',
  status = 'default',
  layout = "row",
  items
}) => {

  const handleCheckboxChange = (itemValue: string, checked: boolean) => {
    let newValue: string[];
    checked ?
      newValue = [...value, itemValue]
      : newValue = value.filter((v) => v !== itemValue);
    onChange(newValue);
  };

  const CheckboxesVariants = cva(
    'flex items-start',
    {
      variants: {
        layout: {
          column: "flex-col gap-4",
          row: "flex-row gap-7",
        },
      },
      defaultVariants: {
        layout: "row",
      },
    }
  );

  return (
    <BaseInput variant={variant} status={status} className={className}>
      <div className={cn(CheckboxesVariants({ layout }))}>
        {items.map((item) => {
          const itemValue = typeof item === "string" ? item : item.value;
          const itemLabel = typeof item === "string" ? item : item.label;
          const itemIcon = typeof item === "string" ? null : item.icon;

          const checked = value.includes(itemValue);

          return (
            <div key={itemValue} className="flex items-center space-y-0">
              <Checkbox checked={checked} onCheckedChange={(isChecked) => handleCheckboxChange(itemValue, Boolean(isChecked))} />
              {itemIcon && <NIcon icon={itemIcon} className="h-4 w-4 ml-2" />}
              <Label className="text-sm font-normal peer-disabled:opacity-70 ml-1">
                {itemLabel}
              </Label>
            </div>
          );
        })}
      </div>
    </BaseInput>
  );
};

export default CheckboxGroupForm; 
