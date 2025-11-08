import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NCard from '@/components/NCard';
import { ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const StudentAttendanceChart = ({ className }: { className?: string }) => {
   const [data] = useState([
      { month: 'Jan', attendance: 17 },
      { month: 'Feb', attendance: 18 },
      { month: 'Mar', attendance: 17 },
      { month: 'Apr', attendance: 17.5 },
      { month: 'May', attendance: 16.5 },
      { month: 'Jun', attendance: 20 },
      { month: 'Jul', attendance: 16.5 },
      { month: 'Aug', attendance: 17 },
      { month: 'Sep', attendance: 16.5 },
      { month: 'Oct', attendance: 19 },
      { month: 'Nov', attendance: 18.5 },
      { month: 'Dec', attendance: 19 }
   ]);

   // Get primary color from CSS variable
   const primaryColor = 'oklch(0.5227 0.1920 9.5005)';

   const CustomTooltip = ({ active = null, payload = null }) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-white px-3 py-2 rounded shadow-lg border border-gray-200">
               <p className="text-sm font-semibold text-gray-800">{payload[0].payload.month}</p>
               <p className="text-sm" style={{ color: primaryColor }}>
                  Attendance: <span className="font-bold">{payload[0].value}</span>
               </p>
            </div>
         );
      }
      return null;
   };

   return (
      <NCard title={'Students Attendances'} className={cn('w-full h-full', className)} icon={ClipboardCheck}>
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
               <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15} />
                     <stop offset="95%" stopColor={primaryColor} stopOpacity={0.05} />
                  </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} vertical={true} />
               <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
               />
               <YAxis
                  domain={[13, 21]}
                  ticks={[13, 14, 15, 16, 17, 18, 19, 20]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dx={-24}
               />
               <Tooltip content={<CustomTooltip />} />
               <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke={primaryColor}
                  strokeWidth={2.5}
                  fill="url(#colorAttendance)"
               />
            </AreaChart>
         </ResponsiveContainer>
      </NCard>
   );
};

export default StudentAttendanceChart;