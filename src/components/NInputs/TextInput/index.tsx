"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import NIcon from "@/components/NIcon";
import { TextInputProps } from "../type";
import BaseInput from "../Box";
import { cn } from "@/lib/utils";
import { getIconColorProps } from "../utils";

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = "",
  icon,
  showIcon = true,
  iconColor,
  className = "",
  variant = 'default',
  status = 'default',
  ...props
}) => {
  const shouldDisplayIcon = Boolean(icon) && showIcon;
  const iconProps = getIconColorProps(iconColor, "h-4 w-4");
  return (
    <BaseInput variant={variant} status={status} className={cn('h-9 gap-2', className)}>

      {shouldDisplayIcon && (
        <NIcon 
          icon={icon} 
          className={cn(iconProps.className)}
          style={iconProps.style}
        />
      )}
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        className='p-0 border-0 shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-muted-foreground'
        {...props}
      />

    </BaseInput>
  );
};

export default TextInput;
