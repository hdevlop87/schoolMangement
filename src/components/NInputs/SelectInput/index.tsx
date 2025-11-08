"use client";

import React from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import NIcon from "@/components/NIcon";
import { SelectInputProps } from "../type";
import RenderSelectItems from "./RenderSelectItems";
import BaseInput from "../Box";
import { cn } from "@/lib/utils";
import { getIconColorProps } from "../utils";

const SelectInput: React.FC<SelectInputProps> = ({
    placeholder = "",
    value,
    onChange,
    icon,
    showIcon = true,
    iconColor,
    items,
    className = "",
    variant = "default",
    status = "default",
    disabled = false,
}) => {
    const shouldDisplayIcon = Boolean(icon) && showIcon && !value;
    const iconProps = getIconColorProps(iconColor, "h-4 w-4");

    return (
        <BaseInput variant={variant} status={status} className={cn('h-9 gap-2', className)}>
            {shouldDisplayIcon && (
                <NIcon
                  icon={icon}
                  className={iconProps.className}
                  style={iconProps.style}
                />
            )}
            <Select
                onValueChange={onChange}
                value={String(value || "")}
                disabled={disabled}
                key={String(value)}
            >
                <SelectTrigger
                    style={{ border: 'none', boxShadow: 'none' }}
                    className="w-full cursor-pointer border-0 shadow-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset- dark:bg-transparent text-muted-foreground gap-2 inputForm p-0 bg-none bg-transparent dark:hover:bg-transparent "
                    disabled={disabled}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent className="max-h-[300px] w-full overflow-y-auto flex justify-center items-center">
                    <RenderSelectItems items={items} />
                </SelectContent>
            </Select>
        </BaseInput>
    );
};

export default SelectInput;