import React from 'react';
import { getGenderColor } from './genderColors';

interface LegendItemProps {
   item: {
      name: string;
      value: number;
   };
}

// Legend Item Component
const LegendItem: React.FC<LegendItemProps> = ({ item }) => {
   const color = getGenderColor(item.name);

   return (
      <div className="flex items-center gap-3">
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 ">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
               <span className="text-sm font-medium text-gray-600">{item.name}</span>
            </div>
            <span className="text-xl font-bold" style={{ color }}>  {item.value} </span>
         </div>
      </div>
   );
};

interface LegendProps {
   data: Array<{ name: string; value: number }>;
}

// Legend Component
export const Legend: React.FC<LegendProps> = ({ data }) => {
   return (
      <div className="flex gap-8 justify-center mt-4">
         {data.map((item, index) => (
            <LegendItem key={index} item={item} />
         ))}
      </div>
   );
};
