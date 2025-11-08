'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NCard from '@/components/NCard';
import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const FeesExpensesChart = ({ className = '' }) => {
  const [data] = useState([
    { month: 'Jan', income: 85, expenses: 55 },
    { month: 'Feb', income: 110, expenses: 75 },
    { month: 'Mar', income: 95, expenses: 65 },
    { month: 'Apr', income: 125, expenses: 85 },
    { month: 'May', income: 100, expenses: 70 },
    { month: 'Jun', income: 145, expenses: 95 },
    { month: 'Jul', income: 115, expenses: 75 },
    { month: 'Aug', income: 155, expenses: 105 },
    { month: 'Sep', income: 120, expenses: 80 },
    { month: 'Oct', income: 160, expenses: 110 },
    { month: 'Nov', income: 130, expenses: 85 },
    { month: 'Dec', income: 170, expenses: 115 }
  ]);

  const incomeColor = '#1e40af';
  const expensesColor = '#f97316';

  const CustomTooltip = ({ active = null, payload = null }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-3 py-2 rounded shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{payload[0].payload.month}</p>
          <p className="text-sm" style={{ color: incomeColor }}>
            Income: <span className="font-bold">{payload[0].value}</span>
          </p>
          {payload[1] && (
            <p className="text-sm" style={{ color: expensesColor }}>
              Expenses: <span className="font-bold">{payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="flex items-center justify-start gap-6 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: incomeColor }}></div>
        <span className="text-sm text-gray-600">Total Incomes</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expensesColor }}></div>
        <span className="text-sm text-gray-600">Total Expenses</span>
      </div>
    </div>
  );

  return (
    <NCard
      title="Fees Collection/Expenses"
      className={cn('flex w-full h-full', className)}
      icon={DollarSign}
    >
      <div className="flex flex-col h-full">
        <CustomLegend />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="income"
              stroke={incomeColor}
              strokeWidth={3}
              dot={false}
              name="Total Incomes"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke={expensesColor}
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              name="Total Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </NCard>
  );
};

export default FeesExpensesChart;