"use client";

import React from "react";
import { LangSelectInputProps } from "../type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NIcon from "../../NIcon";
import { Label } from "@/components/ui/label";


interface RenderItemsProps {
  items: any;
  onChange: (value) => void;
  selectedValue: string;
}

const RenderItems: React.FC<RenderItemsProps> = ({ items, onChange, selectedValue }) => (
  <>
    {items.map(({ value, label, icon }) => (
      <DropdownMenuItem
        key={value}
        onClick={() => onChange(value)}
        className={selectedValue === value ? "bg-primary text-white" : "w-full"}
      >
        {icon && (
          <div className="relative h-5 flex items-center">
            <NIcon icon={icon} className="absolute h-6 w-6 text-muted-foreground inline-block" />
            <Label className="font-normal text-foreground pl-7">{label}</Label>
          </div>
        )}
        {!icon && label}
      </DropdownMenuItem>
    ))}
  </>
);

const LangSelectInput: React.FC<LangSelectInputProps> = ({
  value,
  onChange,
  items,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none">
        <NIcon size={22} icon='globe' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <RenderItems items={items} onChange={onChange} selectedValue={value} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LangSelectInput;