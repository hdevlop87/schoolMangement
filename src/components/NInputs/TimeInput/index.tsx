"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import NIcon from "@/components/NIcon";
import BaseInput from "../Box";
import { cn } from "@/lib/utils";
import { getIconColorProps } from "../utils";

interface TimeInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
  className?: string;
  variant?: any;
  status?: any;
  format24?: boolean; // true for 24-hour format, false for 12-hour format
  showSeconds?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value = "",
  onChange,
  placeholder = "",
  icon = "Clock",
  showIcon = true,
  iconColor,
  className = "",
  variant = 'default',
  status = 'default',
  format24 = true,
  showSeconds = false,
  disabled = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const formatTimeInput = (input: string): string => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    let formatted = '';
    
    if (showSeconds) {
      // Format: HH:MM:SS or HH:MM:SS AM/PM
      if (digits.length >= 1) formatted += digits.slice(0, 2);
      if (digits.length >= 3) formatted += ':' + digits.slice(2, 4);
      if (digits.length >= 5) formatted += ':' + digits.slice(4, 6);
    } else {
      // Format: HH:MM or HH:MM AM/PM
      if (digits.length >= 1) formatted += digits.slice(0, 2);
      if (digits.length >= 3) formatted += ':' + digits.slice(2, 4);
    }
    
    return formatted;
  };

  const validateTime = (timeString: string): boolean => {
    if (!timeString) return true;
    
    const timePattern = showSeconds 
      ? /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
      : /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    
    if (!format24) {
      // For 12-hour format, allow 01-12 for hours
      const timePattern12 = showSeconds
        ? /^(0?[1-9]|1[0-2]):([0-5][0-9]):([0-5][0-9])$/
        : /^(0?[1-9]|1[0-2]):([0-5][0-9])$/;
      return timePattern12.test(timeString);
    }
    
    return timePattern.test(timeString);
  };

  const handleInputChange = (newValue: string) => {
    // Allow backspace/delete
    if (newValue.length < inputValue.length) {
      setInputValue(newValue);
      onChange(newValue);
      return;
    }

    const formatted = formatTimeInput(newValue);
    
    // Limit input length
    const maxLength = showSeconds ? 8 : 5; // HH:MM:SS or HH:MM
    if (formatted.length <= maxLength) {
      setInputValue(formatted);
      
      const valid = validateTime(formatted);
      setIsValid(valid);
      
      // Only call onChange if the time is valid or empty
      if (valid || formatted === '') {
        onChange(formatted);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Allow backspace, delete, arrow keys, tab
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Only allow digits
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    // Auto-complete incomplete times on blur
    if (inputValue && inputValue.length > 0) {
      let completed = inputValue;
      
      // Auto-complete hours if only one digit
      if (completed.length === 1) {
        completed = '0' + completed + ':00';
      }
      // Auto-complete minutes if missing
      else if (completed.length === 3 && completed.includes(':')) {
        completed += '00';
      }
      // Add seconds if format requires it and they're missing
      else if (showSeconds && completed.length === 5) {
        completed += ':00';
      }
      
      if (validateTime(completed)) {
        setInputValue(completed);
        onChange(completed);
      }
    }
  };

  const shouldDisplayIcon = Boolean(icon) && showIcon;
  const iconProps = getIconColorProps(iconColor, "h-4 w-4");
  
  const currentStatus = !isValid ? 'error' : status;
  const placeholderText = placeholder || (showSeconds 
    ? (format24 ? "HH:MM:SS" : "HH:MM:SS") 
    : (format24 ? "HH:MM" : "HH:MM"));

  return (
    <BaseInput 
      variant={variant} 
      status={currentStatus} 
      className={cn('h-9 gap-2', className)}
    >
      {shouldDisplayIcon && (
        <NIcon
          icon={icon}
          className={cn(iconProps.className)}
          style={iconProps.style}
        />
      )}
      <Input
        type="text"
        placeholder={placeholderText}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
        disabled={disabled}
        className={cn(
          'p-0 border-0 shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0',
          !isValid ? 'text-red-500' : 'text-muted-foreground'
        )}
        {...props}
      />
    </BaseInput>
  );
};

export default TimeInput;