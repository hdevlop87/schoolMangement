"use client";

import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileInputProps } from "../type";
import BaseInput from "../Box";
import NIcon from "@/components/NIcon";
import { getIconColorProps } from "../utils";

export const getFileNameFromPath = (path) => {
    return path ? path.split('\\').pop().split('/').pop() : '';
};

export const truncateFilename = (filename, maxLength = 12) => {
    if (filename.length <= maxLength) return filename;

    const extIndex = filename.lastIndexOf('.');
    const ext = extIndex !== -1 ? filename.slice(extIndex) : '';
    const name = extIndex !== -1 ? filename.slice(0, extIndex) : filename;
    const truncatedNameLength = maxLength - ext.length - 3;

    if (truncatedNameLength <= 0) {
        return `${filename.slice(0, maxLength - 3)}...`;
    }

    let truncatedName = name.slice(0, truncatedNameLength);
    while (truncatedName.length > 0 && ['-', '_', ' '].includes(truncatedName.slice(-1))) {
        truncatedName = truncatedName.slice(0, -1);
    }

    return `${truncatedName}...${ext}`;
};

const FileInput: React.FC<FileInputProps> = ({
    value,
    onChange,
    placeholder = "No file chosen",
    icon = 'file-up',
    showIcon = true,
    iconColor,
    className = "",
    variant = 'default',
    status = 'default',
}) => {
    const fileInputRef = useRef(null);

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    const displayFilename = (file) => {
        if (!file) return null;
        const filename = typeof file === "string" ? getFileNameFromPath(file) : file.name;
        return truncateFilename(filename, 25);
    };

    const shouldDisplayIcon = Boolean(icon) && showIcon;
    const iconProps = getIconColorProps(iconColor, "h-4 w-4");

    return (
        <BaseInput variant={variant} status={status} className={cn("flex h-9 px-0 p-0 text-muted-foreground", className)} onClick={handleDivClick}>

            <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden bg-transparent dark:bg-transparent " /> 

            <div className="bg-muted flex h-full items-center px-3">
                {shouldDisplayIcon && (
                    <NIcon
                        icon={icon}
                        className={iconProps.className}
                        style={iconProps.style}
                    />
                )}
                <Label className="flex cursor-pointer h-full justify-center items-center px-2 text-muted-foreground">Choose File</Label>
            </div>

            <Label className="ml-2 flex-1">
                {displayFilename(value) || <span className="text-muted-foreground">{placeholder}</span>}
            </Label>

        </BaseInput>
    );
};

export default FileInput;
