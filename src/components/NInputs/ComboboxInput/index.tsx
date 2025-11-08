"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NIcon from "@/components/NIcon";
import { ComboboxInputProps, SelectItemType } from "../type";
import BaseInput from "../Box";
import { getIconColorProps } from "../utils";

const ComboboxInput: React.FC<ComboboxInputProps> = ({
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  value,
  onChange,
  icon,
  showIcon = true,
  iconColor,
  items = [],
  className = "",
  variant = "default",
  status = "default",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const normalizedItems: SelectItemType[] = items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item
  );

  const selectedItem = normalizedItems.find((item) => item.value === value);

  const shouldDisplayIcon = Boolean(icon) && showIcon && !value;
  const iconProps = getIconColorProps(iconColor, "h-4 w-4");

  const handleSelect = (selectedValue: string) => {
    if (value === selectedValue) {
      onChange("");
    } else {
      onChange(selectedValue);
    }
    setOpen(false);
  };

  return (
    <BaseInput variant={variant} status={status} className={cn("h-9 ", className)}>
      {shouldDisplayIcon && (
        <NIcon
          icon={icon}
          className={iconProps.className}
          style={iconProps.style}
        />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(  "w-full justify-between  h-auto font-normal hover:bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0", !value && "text-muted-foreground")}
            disabled={disabled}
          >
            <span className="truncate">
              {selectedItem ? selectedItem.label : placeholder}
            </span>
            <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">

              <CommandInput
                placeholder={searchPlaceholder}
                className="h-9"
              />
            </div>
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {normalizedItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    keywords={[item.value, item.label]}
                    onSelect={() => handleSelect(item.value)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.icon && (
                      <NIcon
                        icon={item.icon}
                        className="mr-2 h-4 w-4"
                      />
                    )}
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </BaseInput>
  );
};

export default ComboboxInput;