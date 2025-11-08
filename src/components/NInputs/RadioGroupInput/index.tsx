"use client";

import React from "react";
import { RadioGroupInputProps } from "../type";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import NIcon from "@/components/NIcon";
import { Label } from "@/components/ui/label";
import BaseInput from "../Box";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RadioGroupForm: React.FC<RadioGroupInputProps> = ({
  value,
  onChange,
  className = "",
  variant = 'default',
  status = 'default',
  layout = "row",
  items
}) => {

  const RadioVariants = cva(
    'flex items-start ',
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

      <RadioGroup onValueChange={onChange} value={value} className={cn(RadioVariants({ layout }))}>
        {items.map((item) => {
          const itemValue = typeof item === "string" ? item : item.value;
          const itemLabel = typeof item === "string" ? item : item.label;
          const itemIcon = typeof item === "string" ? null : item.icon;

          return (
            <div key={itemValue} className="flex items-center space-y-0">
              <RadioGroupItem value={itemValue} />
              {itemIcon && (<NIcon icon={itemIcon} className="h-4 w-4 ml-2" />)}
              <Label className="text-sm font-normal peer-disabled:opacity-70 ml-1">
                {itemLabel}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

    </BaseInput>
  );
};

export default RadioGroupForm; 
