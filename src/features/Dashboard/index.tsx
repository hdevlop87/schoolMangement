'use client'

import React from 'react';
import Widgets from './components/Widgets';
import StudentAttendanceChart from './components/StudentAttendanceChart';
import StudentsGenderChart from './components/StudentsGenderChart';
import CalendarCard from './components/CalendarCard';
import FeesExpensesChart from './components/FeesExpensesChart';
import TeachersAttendance from './components/TeachersAttendance';
import LastEvents from './components/LastEvents';

const Dashboard = () => {
  return (
    <div className='flex flex-col h-full w-full gap-2 overflow-auto'>
      <Widgets />
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-2 h-1/2'>
        <StudentsGenderChart className="col-span-3" />
        <StudentAttendanceChart className="col-span-6" />
        <CalendarCard className="col-span-3" />
      </div>
      
      {/* Second Row */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-2 h-1/2'>
        <FeesExpensesChart className="col-span-5"/>
        <TeachersAttendance className="col-span-4"/>
        <LastEvents className="col-span-3" />
      </div>
    </div>
  );
};

export default Dashboard;