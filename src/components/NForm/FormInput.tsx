import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  SwitchInput,
  CheckboxInput,
  TextInput,
  NumberInput,
  PasswordInput,
  TextAreaInput,
  DateInput,
  FileInput,
  SelectInput,
  ComboboxInput,
  MultiSelectInput,
  RadioGroupInput,
  CheckboxGroupInput,
  StarRatingInput,
  EmojiInput,
  PhoneInput,
  ColorArrayInput,
  ColorPickerInput,
  TimeInput,
  MapInput,
  ImageInput,
} from "@/components/NInputs";
import { useFormContext } from 'react-hook-form';
import { FormInputProps } from "./type";
import NIcon from "@/components/NIcon";
import { usePrefix } from './PrefixContext';

export const Inputs = {
  switch: SwitchInput,
  checkbox: CheckboxInput,
  text: TextInput,
  number: NumberInput,
  password: PasswordInput,
  textarea: TextAreaInput,
  date: DateInput,
  file: FileInput,
  select: SelectInput,
  combobox: ComboboxInput,
  multiselect: MultiSelectInput,
  radio: RadioGroupInput,
  checkboxes: CheckboxGroupInput,
  stars: StarRatingInput,
  emoji: EmojiInput,
  phone: PhoneInput,
  colorArray: ColorArrayInput,
  colorPicker: ColorPickerInput,
  time: TimeInput,
  map: MapInput,
  image: ImageInput
};

const FormInput: React.FC<FormInputProps> = ({
  name,
  type,
  formLabel,
  formDescription,
  required = false,
  readOnly = false,
  disabled = false,
  icon,
  iconColor,
  ...rest
}) => {
  const InputComponent = Inputs[type];
  const { control } = useFormContext();
  const { className, ...inputRest } = rest as any;
  const prefix = usePrefix();
  const fieldName = prefix ? `${prefix}.${name}` : name;

  if (!InputComponent) {
    console.error(`Input component for type "${type}" not found in Inputs registry`);
    return null;
  }

  const getDefaultValue = () => {
    if (type === 'multiselect' || type === 'checkboxGroup') {
      return [];
    }
    return '';
  };

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;
        const isHidden = className?.includes('hidden');

        return (
          <FormItem className="flex flex-col w-full h-full">
            {formLabel && (
              <FormLabel className="text-foreground flex items-center gap-2">
                {icon && <NIcon icon={icon} size={16} className="w-4 h-4" color={iconColor} />}
                {formLabel}
                {required && !readOnly && !disabled && (
                  <span className="text-destructive ml-1" aria-label="required">
                    *
                  </span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <InputComponent
                value={field.value ?? getDefaultValue()}
                onChange={field.onChange}
                status={hasError && !isHidden ? "error" : "default"}
                icon={formLabel ? undefined : icon}
                iconColor={formLabel ? undefined : iconColor}
                readOnly={readOnly}
                disabled={disabled}
                {...inputRest}
                className={className}
              />
            </FormControl>
            {!hasError && !readOnly && !disabled && (
              <FormDescription>{formDescription}</FormDescription>
            )}
            {!isHidden && <FormMessage />}
          </FormItem>
        );
      }}
    />
  );
};

export default FormInput;
