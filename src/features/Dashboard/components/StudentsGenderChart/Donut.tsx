import NIcon from '@/components/NIcon';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getGenderColor } from './genderColors';

// Center Icons Component
const CenterIcons = () => {
   return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ">
         <NIcon
            icon='mdi:human-male'
            className='absolute w-15 h-15 -translate-x-3'
            style={{
               color: getGenderColor('Male'),
            }}
         />

         <NIcon
            icon='mdi:human-female'
            className='absolute w-15 h-15 translate-x-3'
            style={{
               color: getGenderColor('Female'),
            }}
         />
      </div>
   );
};

interface DonutChartProps {
   data: Array<{ name: string; value: number }>;
}

// Donut Chart Component
export const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
   return (
      <div className="flex relative justify-between" style={{ width: '220px', height: '176px' }}>
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
               >
                  {data.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={getGenderColor(entry.name)} />
                  ))}
               </Pie>
            </PieChart>
         </ResponsiveContainer>

         <CenterIcons />
      </div>
   );
};