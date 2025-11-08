'use client';
import React, { useState } from 'react';
import NCard from '@/components/NCard';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const CalendarCard = ({ className='' }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());


  return (
    <NCard title="Calendar" icon={CalendarIcon} className={cn('flex w-full justify-center items-center gap-0 h-full', className)} >

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        modifiersClassNames={{
          event: 'bg-primary/20 font-semibold',
        }}
        className="rounded-md  h-full gap-0 w-full"
      />


    </NCard>
  );
};

export default CalendarCard;