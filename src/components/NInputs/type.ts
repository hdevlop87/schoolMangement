
interface BaseProps {
  className?: string;
  variant?: "default" | "rounded" | "ghost"; 
  status?: "default" | "error";
  iconColor?: string;
}

export interface SelectItemType {
  value: string;
  label: string;
  icon?: string;
}

export interface PasswordInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
}

export interface NumberInputProps extends BaseProps {
  value: string | number;
  onChange: (value: number) => void;
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
}

export interface TextInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface TimeInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
}

export interface TextAreaInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface SelectInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  items: (string | SelectItemType)[];
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
  disabled?: boolean;
}

export interface ComboboxInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  items: (string | SelectItemType)[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
  disabled?: boolean;
}

export interface MultiSelectInputProps extends BaseProps {
  value: string[];
  onChange: (value: string[]) => void;
  items: (string | SelectItemType)[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
  disabled?: boolean;
  maxDisplay?: number;
  showSearch?: boolean;
}

export interface RadioGroupInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  items: (string | SelectItemType)[];
  layout?: "row" | "column";
}

export interface SwitchInputProps extends BaseProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  helper?: string;
  icon?: string;
  showIcon?: boolean;
  iconPosition?: "label" | "input";
  iconColor?: string;
}

export interface CheckboxGroupInputProps extends BaseProps {
  value: string[];
  onChange: (newValue: string[]) => void;
  items: (string | SelectItemType)[];
  layout?: "row" | "column";
}

export interface CheckboxInputProps extends BaseProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  helper?: string;
  checkboxClassName?: string;
}

export interface FileInputProps extends BaseProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
}

export interface PhoneInputProps extends BaseProps {
  value: string;
  onChange: (file: string) => void;
  iconColor?: string;
}

export interface DateInputProps extends BaseProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
}

export interface StarRatingInputProps extends BaseProps {
  value: number;
  onChange: (starNumber: number | undefined) => void;
  maxStars: number;
}

export interface EmojiInputProps extends BaseProps {
  value: number;
  onChange: (starNumber: number) => void;
}

export interface ColorArrayInputProps extends BaseProps{
  value: string;
  onChange: (color: string) => void;
  colors?: string[]; 
}

export interface LangSelectInputProps extends SelectInputProps{}

export interface MapInputProps extends BaseProps {
  value: { lat: number; lng: number } | null;
  onChange: (location: { lat: number; lng: number } | null) => void;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
  showClearButton?: boolean;
}

export interface ImageInputProps extends BaseProps {
  value: File | string | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
  icon?: string;
  showIcon?: boolean;
  iconColor?: string;
  previewClassName?: string;
  showPreview?: boolean;
  previewPosition?: "top" | "bottom" | "left" | "right";
  allowClear?: boolean;
  accept?: string;
  defaultImage?: string;
  imageSize?: "sm" | "md" | "lg" | "xl";
}

