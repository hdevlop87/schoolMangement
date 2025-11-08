"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SwitchInputProps } from "../type";
import BaseInput from "../Box";
import NIcon from "@/components/NIcon";

const SwitchInput: React.FC<SwitchInputProps> = ({
  value,
  onChange,
  label = "",
  helper,
  className = "",
  variant = 'default',
  status = 'default',
  icon,
  showIcon = true,
  iconPosition = "label",
  iconColor,
}) => {
  const renderIcon = icon && showIcon && (
    <NIcon icon={icon} size={16} className="w-4 h-4" color={iconColor} />
  );

  return (
    <BaseInput variant={variant} status={status} className={cn(' gap-2 justify-between items-center', className)}>
      <div className="flex flex-col gap-1">
        <Label className="flex items-center gap-2">
          {iconPosition === "label" && renderIcon}
          {label}
        </Label>
        <Label className="text-xs text-muted-foreground">{helper}</Label>
      </div>
      <div className="flex items-center gap-2">
        {iconPosition === "input" && renderIcon}
        <Switch checked={value} onCheckedChange={onChange} />
      </div>
    </BaseInput>
  );
};

export default SwitchInput;
