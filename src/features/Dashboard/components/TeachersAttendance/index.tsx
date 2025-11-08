import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserCheck } from 'lucide-react';
import NCard from '@/components/NCard';
import { Label } from '@/components/ui/label';

interface TeachersAttendanceProps {
  className?: string;
}

const TeachersAttendance: React.FC<TeachersAttendanceProps> = ({ className }) => {
const data = [
  { month: 'Jan', attendance: 12, type: 'primary' },
  { month: 'Feb', attendance: 9, type: 'secondary' },
  { month: 'Mar', attendance: 13, type: 'primary' },
  { month: 'Apr', attendance: 8, type: 'secondary' },
  { month: 'May', attendance: 14, type: 'primary' },
  { month: 'Jun', attendance: 10, type: 'secondary' },
  { month: 'Jul', attendance: 7, type: 'primary' },
  { month: 'Aug', attendance: 11, type: 'secondary' },
  { month: 'Sep', attendance: 9, type: 'primary' },
  { month: 'Oct', attendance: 10, type: 'secondary' },
  { month: 'Nov', attendance: 12, type: 'primary' },
  { month: 'Dec', attendance: 9, type: 'secondary' }
];

  const COLORS = {
    primary: '#F1B814',
    secondary: '#265791'
  };

  return (
    <NCard
      title="Teachers Attendance"
      icon={UserCheck}
      className={className}
    >
      {/* Metrics Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            <Label>8</Label> 
          </div>
          <span className="text-sm text-gray-500">Today</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
           <Label>2.96%</Label>
          </span>
          <span className="text-sm text-gray-500">Since last week</span>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            domain={[0, 10]}
          />
          <Tooltip />
          <Bar
            dataKey="attendance"
            radius={[8, 8, 8, 8]}
            maxBarSize={16}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.type]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </NCard>
  );
};

export default TeachersAttendance;