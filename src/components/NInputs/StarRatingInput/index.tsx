"use client";

import { StarRatingInputProps } from "../type";
import NIcon from "@/components/NIcon";
import React from "react";
import { cn } from "@/lib/utils";
import BaseInput from "../Box";

const StarRatingInput: React.FC<StarRatingInputProps> = ({
    value,
    onChange,
    maxStars = 5,
    className = "",
    variant = 'default',
    status = 'default',
}) => {
    const handleStarClick = (starNumber: number) => {
        onChange(starNumber);
    };

    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
        const filled = i <= value;
        stars.push(
            <NIcon
                key={i}
                icon="star"
                onClick={() => handleStarClick(i)}
                className="cursor-pointer h-8 w-8 "
                fill={filled ? "orange" : "#d6d6d6"}
                stroke='none'
            />
        );
    }

    return (
        <BaseInput variant={variant} status={status} className={cn('gap-2 ',className)}>
            {stars}
        </BaseInput>
    )

};

export default StarRatingInput;
