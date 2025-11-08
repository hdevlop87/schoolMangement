"use client";

import React from "react";
import { CheckboxInputProps } from "../type";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import BaseInput from "../Box";
import { cn } from "@/lib/utils";


const CheckboxForm: React.FC<CheckboxInputProps> = ({
  value,
  onChange,
  helper,
  label,
  checkboxClassName,
  className,
  variant = 'default',
  status = 'default',
}) => { 

  return (
    <BaseInput variant={variant} status={status} className={cn('flex  gap-2 items-center h-9',className)}>
      <Checkbox 
        checked={value} 
        onCheckedChange={onChange} 
        className={cn("cursor-pointer transition-colors duration-200 border-primary", checkboxClassName)}
      />
      <div className="flex flex-col gap-1">
        <Label className="cursor-pointer text-muted-foreground" onClick={() => onChange(!value)}>{label}</Label>
        {helper && <Label className="text-xs text-muted-foreground">{helper}</Label>}
      </div>
    </BaseInput>
  );
};

export default CheckboxForm;
