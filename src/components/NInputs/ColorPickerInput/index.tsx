// src/components/ColorArrayInput.tsx
"use client";

import React from "react";
import { ColorArrayInputProps } from "../type";
import { cn } from "@/lib/utils";
import BaseInput from "../Box";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SketchPicker } from 'react-color';
import { Label } from "@/components/ui/label";

const ColorPickerInput: React.FC<ColorArrayInputProps> = ({
  value='#FFFFFF',
  onChange,
  className = "",
  variant = "default",
  status = "default",
}) => {
  return (
    <BaseInput variant={variant} status={status} className={cn("flex flex-wrap gap-2 p-0", className)} >
      <Popover >
        <PopoverTrigger asChild>
          <div className='flex items-center w-full cursor-pointer gap-2 '>
            <div className='w-12 h-9 rounded-l-md rounded-r-none' style={{ backgroundColor: value }} />
            <Label className="text-md text-muted-foreground">{value}</Label>
          </div>
        </PopoverTrigger>
        <PopoverContent className='bg-none w-full p-0' align="start">
          <SketchPicker
            showAlpha={false}
            color={value}
            onChange={(color) => {
              onChange(color.hex);
            }}
          />
        </PopoverContent>
      </Popover>
    </BaseInput>
  );
};

export default ColorPickerInput;
