import { useState } from 'react';
import { usePhoneInput, defaultCountries, parseCountry } from 'react-international-phone';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import flags from './flags/flags';
import { cn } from "@/lib/utils";
import BaseInput from '../Box';
import { PhoneInputProps } from "../type";

const PhoneInput: React.FC<PhoneInputProps> = ({
   value,
   onChange,
   iconColor,
   className,
   variant = 'default',
   status = 'default',
   ...restProps
}) => {

   const { inputValue, handlePhoneValueChange, inputRef, country, setCountry, } = usePhoneInput({
      defaultCountry: 'us',
      value,
      countries: defaultCountries,
      onChange: (data) => {
         onChange(data.phone);
      },
   });

   const [open, setOpen] = useState(false);

   const getCountries = () => {
      return defaultCountries.map((countryData) => {
         const countryParsed = parseCountry(countryData);
         return {
            name: countryParsed.name,
            dialCode: countryParsed.dialCode,
            iso2: countryParsed.iso2,
         };
      });
   };

   const handleSelectCountry = (countryIso2) => {
      setCountry(countryIso2);
      setOpen(false);
   };

   return (
      <BaseInput variant={variant} status={status} className={cn('h-9 gap-2',className)}>

         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <div aria-expanded={open} className="w-16 gap-2 justify-between flex items-center cursor-pointer">
                  <img src={flags[country.iso2]} alt={country.iso2} className="w-7 h-7 " />
                  <ChevronDown className="opacity-50  w-5 h-5 " />
               </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
               <Command>
                  <CommandInput placeholder="Search country..." className="h-9 p-0" />
                  <CommandList className="bg-card max-h-60 overflow-auto">
                     <CommandEmpty>No country found.</CommandEmpty>
                     <CommandGroup>
                        {getCountries().map((countryItem) => (
                           <CommandItem
                              key={countryItem.iso2}
                              value={countryItem.iso2}
                              onSelect={() => handleSelectCountry(countryItem.iso2)}
                              className={cn('flex items-center justify-between',
                                 country?.iso2 === countryItem.iso2 && 'bg-primary text-primary-foreground'
                              )}
                           >
                              <div className="flex items-center space-x-2">
                                 <img src={flags[countryItem.iso2]} alt={countryItem.iso2} className="w-6 h-6" />
                                 <Label className="text-sm">{countryItem.name}</Label>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                 +{countryItem.dialCode}
                              </span>
                              {country?.iso2 === countryItem.iso2 && (
                                 <Check className="w-4 h-4 ml-auto" />
                              )}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>

         <Input
            type="tel"
            value={inputValue}
            onChange={handlePhoneValueChange}
            placeholder="Enter phone number"
            className='p-0 border-0 shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 '
            ref={inputRef}
            {...restProps}
         />

      </BaseInput>
   );
};

export default PhoneInput