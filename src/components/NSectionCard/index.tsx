
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Label } from '../ui/label';
import { AvatarCell } from '../NAvatarCell';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../ui/tooltip';

//================================================================//
//======================= Types =================================//

interface NSectionProps {
    icon: LucideIcon;
    title: string;
    children: React.ReactNode;
    className?: string;
    iconColor?: string;
    background?: string;
}

interface NSectionInfoProps {
    icon?: LucideIcon;
    label: string;
    value: string | React.ReactNode;
    valueColor?: string;
    iconColor?: string;
    className?: string;
}

interface NSectionHeaderProps {
    children: React.ReactNode;
    image?: string;
    showImage?: boolean;
    imageSize?: 'sm' | 'md' | 'lg' | 'xl';
    icon?: LucideIcon;
    iconColor?: string;
    className?: string;
    background?: string;
    layout?: 'horizontal' | 'vertical';
}

interface NSectionHeaderTitleProps {
    children: React.ReactNode;
    className?: string;
}

interface NSectionHeaderSubtitleProps {
    children: React.ReactNode;
    className?: string;
}

interface NSectionHeaderContentProps {
    children: React.ReactNode;
    className?: string;
}

interface NSectionHeaderActionsProps {
    children: React.ReactNode;
    className?: string;
}

//================================================================//
//================= NSectionHeader Compound Component ===========//

const NSectionHeaderRoot: React.FC<NSectionHeaderProps> = ({
    children,
    image,
    showImage = true,
    imageSize = 'xl',
    icon: Icon,
    iconColor = "text-blue-400",
    className,
    background = "bg-card",
    layout = 'horizontal',
}) => {
    const isHorizontal = layout === 'horizontal';
    
    return (
        <div className={cn(
            background, 
            "flex flex-col p-5 rounded-lg border shadow-sm", 
            className
        )}>
            <div className={cn(
                "flex gap-4",
                isHorizontal ? "flex-row items-center" : "flex-col items-center text-center"
            )}>
                {/* Image/Icon Section */}
                {showImage && (
                    <div className="shrink-0">
                        {image ? (
                            <AvatarCell src={image} size={imageSize} />
                        ) : Icon ? (
                            <div className={cn(
                                "flex items-center justify-center rounded-full",
                                imageSize === 'xl' ? 'w-16 h-16' : 
                                imageSize === 'lg' ? 'w-12 h-12' :
                                imageSize === 'md' ? 'w-10 h-10' : 'w-8 h-8',
                                background === 'bg-card' ? 'bg-muted' : 'bg-card'
                            )}>
                                <Icon className={cn(
                                    iconColor,
                                    imageSize === 'xl' ? 'w-8 h-8' : 
                                    imageSize === 'lg' ? 'w-6 h-6' :
                                    imageSize === 'md' ? 'w-5 h-5' : 'w-4 h-4'
                                )} />
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Content Section */}
                <div className={cn(
                    "flex-1 min-w-0",
                    !isHorizontal && "w-full"
                )}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const NSectionHeaderTitle: React.FC<NSectionHeaderTitleProps> = ({
    children,
    className,
}) => {
    return (
        <Label className={cn(
            "text-2xl font-bold text-foreground block",
            className
        )}>
            {children}
        </Label>
    );
};

const NSectionHeaderSubtitle: React.FC<NSectionHeaderSubtitleProps> = ({
    children,
    className,
}) => {
    return (
        <Label className={cn(
            "text-muted-foreground block",
            className
        )}>
            {children}
        </Label>
    );
};

const NSectionHeaderContent: React.FC<NSectionHeaderContentProps> = ({
    children,
    className,
}) => {
    return (
        <div className={cn("mt-3", className)}>
            {children}
        </div>
    );
};

const NSectionHeaderActions: React.FC<NSectionHeaderActionsProps> = ({
    children,
    className,
}) => {
    return (
        <div className={cn("flex items-center gap-2 mt-2", className)}>
            {children}
        </div>
    );
};

//================================================================//
//================= Compound Component Assembly ==================//

export const NSectionHeader = Object.assign(NSectionHeaderRoot, {
    Title: NSectionHeaderTitle,
    Subtitle: NSectionHeaderSubtitle,
    Content: NSectionHeaderContent,
    Actions: NSectionHeaderActions,
});

NSectionHeader.displayName = "NSectionHeader";
NSectionHeaderTitle.displayName = "NSectionHeader.Title";
NSectionHeaderSubtitle.displayName = "NSectionHeader.Subtitle";
NSectionHeaderContent.displayName = "NSectionHeader.Content";
NSectionHeaderActions.displayName = "NSectionHeader.Actions";
//================================================================//
//================= NSectionInfo Component =======================//

export const truncateByCharacters = (
    text: string,
    maxCharacters: number,
    suffix: string = '...'
): string => {
    if (!text) return '';

    // Convert to string first
    const textStr = String(text);

    if (textStr.length <= maxCharacters) {
        return textStr;
    }

    return textStr.slice(0, maxCharacters) + suffix;
};

export const NSectionInfo: React.FC<NSectionInfoProps> = ({
    icon: Icon,
    label = '',
    value = '',
    valueColor = "text-foreground",
    iconColor = "text-gray-500",
    className,
}) => {
    const maxChars = 20;
    const stringValue = String(value);
    const isTruncated = stringValue.length > maxChars;
    const displayValue = truncateByCharacters(stringValue, maxChars);

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {Icon && <Icon className={cn("w-4 h-4", iconColor)} />}
            <Label className="text-sm text-muted-foreground">{label}:</Label>
            {isTruncated ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Label className={cn("text-sm cursor-help", valueColor)}>
                            {displayValue}
                        </Label>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs ">{stringValue}</p>
                    </TooltipContent>
                </Tooltip>
            ) : (
                <Label className={cn("text-sm", valueColor)}>
                    {displayValue}
                </Label>
            )}
        </div>
    );
};

NSectionInfo.displayName = "NSectionInfo";

//================================================================//
//=================== Main NSection Component ====================//

export const NSection: React.FC<NSectionProps> = ({
    icon: Icon,
    title,
    children,
    className,
    iconColor = "text-blue-400",
    background = "bg-gray-800",
}) => {
    return (
        <div className={cn(background, "flex flex-col gap-1 rounded-lg p-4", className)}>
            <div className="flex items-center space-x-2 mb-3">
                <Icon className={cn("w-5 h-5", iconColor)} />
                <Label className="text-lg font-medium text-foreground">{title}</Label>
            </div>
            <div className="space-y-1">
                {children}
            </div>
        </div>
    );
};

NSection.displayName = "NSection";

//================================================================//
//================= Extended NSection with Info ==================//

interface NSectionWithInfoProps extends Omit<NSectionProps, 'children'> {
    items: Array<{
        icon?: LucideIcon;
        label: string;
        value: string | React.ReactNode;
        valueColor?: string;
        iconColor?: string;
    }>;
}

export const NSectionWithInfo: React.FC<NSectionWithInfoProps> = ({
    icon,
    title,
    items,
    className,
    iconColor,
    background,
}) => {
    return (
        <NSection
            icon={icon}
            title={title}
            className={className}
            iconColor={iconColor}
            background={background}
        >
            {items.map((item, index) => (
                <NSectionInfo
                    key={`${item.label}-${index}`}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    valueColor={item.valueColor}
                    iconColor={item.iconColor}
                />
            ))}
        </NSection>
    );
};

NSectionWithInfo.displayName = "NSectionWithInfo";