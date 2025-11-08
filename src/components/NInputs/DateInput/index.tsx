"use client";

import * as React from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateInputProps } from "../type";
import { Label } from "@/components/ui/label";
import NIcon from "@/components/NIcon";
import { cn } from "@/lib/utils";
import BaseInput from "../Box";
import { getIconColorProps } from "../utils";

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className = "",
  icon,
  showIcon = true,
  iconColor,
  variant = 'default',
  status = 'default',
}) => {

  const shouldDisplayLeftIcon = Boolean(icon) && showIcon;
  const shouldDisplayRightIcon = !icon && showIcon;
  const iconProps = getIconColorProps(iconColor, "h-4 w-4");

  // Convert initial Date object to string format if needed
  React.useEffect(() => {
    if (value instanceof Date) {
      const dateString = value.toISOString().split('T')[0]; // YYYY-MM-DD format
      onChange(dateString);
    }
  }, []);

  // Convert Date object to YYYY-MM-DD string for form submission
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      onChange(dateString);
    } else {
      onChange(undefined);
    }
  };

  return (
    <BaseInput variant={variant} status={status} className={cn('h-9', className)}>
      {shouldDisplayLeftIcon && (
        <NIcon
          icon={icon}
          className={iconProps.className}
          style={iconProps.style}
        />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn(
            "w-full flex px-2  items-center cursor-pointer gap-2 justify-start text-left font-normal relative",
            !value && "text-foreground",
          )}
          >
            <Label className="text-muted-foreground">
              {value ? format(
                typeof value === 'string' ? new Date(value) : value,
                "PPP"
              ) : placeholder}
            </Label>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={typeof value === 'string' ? new Date(value) : value}
            onSelect={handleDateSelect}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      {shouldDisplayRightIcon && (
        <CalendarIcon
          className={iconProps.className}
          style={iconProps.style}
        />
      )}
    </BaseInput>
  );
};

export default DateInput