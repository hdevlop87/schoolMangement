// src/components/PasswordInput.tsx
"use client";

import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import NIcon from "@/components/NIcon";
import { PasswordInputProps } from "../type";
import BaseInput from "../Box";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from 'lucide-react'
import { getIconColorProps } from "../utils";

const PasswordInput: FC<PasswordInputProps> = ({
    value,
    onChange,
    placeholder = "",
    showIcon = true,
    icon,
    iconColor,
    className = "",
    variant = "default",
    status = "default",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword(!showPassword);
    };

    const shouldDisplayIcon = Boolean(icon) && showIcon;
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

            <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(ev) => onChange(ev.target.value)}
                className='p-0 border-0 shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-muted-foreground'
                style={{ border: 'none', boxShadow: 'none' }}
                {...props}
            />

            <NIcon
                icon={showPassword ? Eye : EyeOff}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={toggleVisibility}
            />
        </BaseInput>
    );
};

export default PasswordInput;
