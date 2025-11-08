// src/components/ColorArrayInput.tsx
"use client";

import React, { useState } from "react";
import NIcon from "@/components/NIcon";
import { ColorArrayInputProps } from "../type";
import { cn } from "@/lib/utils";
import BaseInput from "../Box";

const DEFAULT_COLORS: string[] = [
  "#222222",
  "#e11d48",
  "#ea580c",
  "#16a34a",
  "#db2777",
  "#2563eb",
  "#9333ea",
  "#eab308",
];

const ColorArrayInput: React.FC<ColorArrayInputProps> = ({
  value,
  onChange,
  className = "",
  variant = "default",
  status = "default",
  colors = DEFAULT_COLORS,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(value || "");

  const handleClick = (color: string) => {
    setSelectedColor(color);
    onChange(color);
  };

  return (
    <BaseInput variant={variant} status={status} className={cn("flex flex-wrap gap-2 ", className)} >
      {colors.map((color) => {
        const isSelected = color === selectedColor;
        return (
          <div key={color}
            className={cn(
              "flex h-9 w-9 items-center justify-center cursor-pointer rounded-full text-xs transition-transform transform hover:scale-105",
              isSelected ? "border-2 border-primary" : "border-transparent"
            )}
            style={{ borderColor: isSelected ? color : "transparent" }}
            onClick={() => handleClick(color)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClick(color);
              }
            }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: color }} >
              {isSelected && <NIcon icon="material-symbols:check" className="h-5 w-5 text-white" />}
            </div>
          </div>
        );
      })}
    </BaseInput>
  );
};

export default ColorArrayInput;
