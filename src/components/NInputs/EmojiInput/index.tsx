// EmojiInput.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { EmojiInputProps } from "../type";
import { HappyFaceIcon } from "./icons/HappyFaceIcon";
import { NeutralFaceIcon } from "./icons/NeutralFaceIcon";
import { SadFaceIcon } from "./icons/SadFaceIcon";
import { SmileyFaceIcon } from "./icons/SmileyFaceIcon";
import { AngryFaceIcon } from "./icons/AngryFaceIcon";
import BaseInput from "../Box";

const EmojiInput: React.FC<EmojiInputProps> = ({
    value,
    onChange,
    className = "",
    variant = 'default',
    status = 'default',
}) => {
    const handleSelect = (emojiValue: number) => {
        onChange(emojiValue);
    };

    const emojiIcons = [
        { component: HappyFaceIcon, value: 5 },
        { component: SmileyFaceIcon, value: 4 },
        { component: NeutralFaceIcon, value: 3 },
        { component: SadFaceIcon, value: 2 },
        { component: AngryFaceIcon, value: 1 },
    ];

    return (
        <BaseInput variant={variant} status={status} className={cn('gap-4',className)}>
            {emojiIcons.map(({ component: NIcon, value: iconValue }) => (
                <NIcon
                    key={iconValue}
                    mainBg={value === iconValue ? "#4bd722" : "#cfcfcf"}
                    secondBg={value === iconValue ? "#377637" : "#7e7e7e"}
                    onClick={() => handleSelect(iconValue)}
                    className='cursor-pointer'
                    width={30}
                    height={30}
                />
            ))}
        </BaseInput>
    );
};

export default EmojiInput;
