import { PhoneInputProps } from "react-international-phone";
import { PasswordInputProps,TimeInputProps, NumberInputProps, TextInputProps, TextAreaInputProps, SelectInputProps, MultiSelectInputProps, RadioGroupInputProps, SwitchInputProps, CheckboxGroupInputProps, CheckboxInputProps, FileInputProps, DateInputProps, StarRatingInputProps, EmojiInputProps, ColorArrayInputProps, MapInputProps, ImageInputProps } from "../NInputs/type";
import { SubmitHandler, UseFormProps } from "react-hook-form";
import { z } from "zod";

interface BaseFormInputProps {
    name: string;
    formLabel?: string;
    formDescription?: string;
    required?: boolean;
    icon?: any;
    iconColor?: string;
    items?: any;
    readOnly?: boolean;
    readOnlyClassName?: string;
    readOnlyPrefix?: string;
    disabled?: boolean;
    onChange?: (value: any) => void;
  }
  
  type InputTypeMap = {
    time: Omit<TimeInputProps, 'value' | 'onChange'>;
    password: Omit<PasswordInputProps, 'value' | 'onChange'>;
    number: Omit<NumberInputProps, 'value' | 'onChange'>;
    text: Omit<TextInputProps, 'value' | 'onChange'>;
    textarea: Omit<TextAreaInputProps, 'value' | 'onChange'>;
    select: Omit<SelectInputProps, 'value' | 'onChange'>;
    multiselect: Omit<MultiSelectInputProps, 'value' | 'onChange'>;
    radio: Omit<RadioGroupInputProps, 'value' | 'onChange'>;
    switch: Omit<SwitchInputProps, 'value' | 'onChange'>;
    checkboxGroup: Omit<CheckboxGroupInputProps, 'value' | 'onChange'>;
    checkbox: Omit<CheckboxInputProps, 'value' | 'onChange'>;
    file: Omit<FileInputProps, 'value' | 'onChange'>;
    phone: Omit<PhoneInputProps, 'value' | 'onChange'>;
    date: Omit<DateInputProps, 'value' | 'onChange'>;
    starRating: Omit<StarRatingInputProps, 'value' | 'onChange'>;
    emoji: Omit<EmojiInputProps, 'value' | 'onChange'>;
    colorArray: Omit<ColorArrayInputProps, 'value' | 'onChange'>;
    colorPicker: Omit<ColorArrayInputProps, 'value' | 'onChange'>;
    map: Omit<MapInputProps, 'value' | 'onChange'>;
    image: Omit<ImageInputProps, 'value' | 'onChange'>;
    combobox:any
  };
  
  export type FormInputProps = {
    [K in keyof InputTypeMap]: BaseFormInputProps & { type: K } & InputTypeMap[K]
  }[keyof InputTypeMap];

  export type FormProps<T extends z.ZodType<any, any>> = {
    schema: T;
    defaultValues?: UseFormProps<z.infer<T>>['defaultValues'];
    onSubmit: SubmitHandler<z.infer<T>>;
    className?: string;
    id?: string; 
    children: React.ReactNode;
     
  };