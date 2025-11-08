// src/components/TextAreaInput.tsx
"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { TextAreaInputProps } from "../type";
import BaseInput from "../Box";

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  variant = "default",
  status = "default",
  ...props
}) => {
  return (
    <BaseInput variant={variant} status={status} className={className} >
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        className=" p-0 bg-transparent dark:bg-transparent text-muted-foreground h-full"
        style={{ border: 'none', boxShadow: 'none' }}
     
      />
    </BaseInput>
  );
};

export default TextAreaInput; 
