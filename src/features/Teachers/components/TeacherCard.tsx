"use client";

import React from 'react';
import { Phone, Calendar, DollarSign, BookOpen, GraduationCap } from 'lucide-react';
import { AvatarCell } from '@/components/NAvatarCell';
import { NSectionInfo } from '@/components/NSectionCard';
import { useTranslation } from '@/hooks/useLanguage';
import { Label } from '@/components/ui/label';
import { useClasses } from '@/features/Classes/hooks/useClasses';
import { useSubjects } from '@/features/Subjects/hooks/useSubjects';

const TeacherCard = ({ data }) => {
   const { t } = useTranslation();
   const teacher = data;

   // Fetch classes and subjects from cache
   const { classes = [] } = useClasses();
   const { subjects = [] } = useSubjects();

   // Helper functions to get names by ID
   const getClassName = (classId) => {
      const classItem = classes.find(c => c.id === classId);
      return classItem?.name || classId;
   };

   const getSubjectName = (subjectId) => {
      const subject = subjects.find(s => s.id === subjectId);
      return subject?.name || subjectId;
   };

   // Get all unique classes as comma-separated string
   const getAllClasses = () => {
      if (!teacher.assignments || teacher.assignments.length === 0) return '-';
      const classIds = teacher.assignments.map(a => a.classId);
      const uniqueClassIds = [...new Set(classIds)];
      return uniqueClassIds.map(id => getClassName(id)).join(', ');
   };

   // Get all unique subjects as comma-separated string
   const getAllSubjects = () => {
      if (!teacher.assignments || teacher.assignments.length === 0) return '-';
      const subjectIds = teacher.assignments.flatMap(a => a.subjectIds || []);
      const uniqueSubjectIds = [...new Set(subjectIds)];
      return uniqueSubjectIds.map(id => getSubjectName(id)).join(', ');
   };

   return (
      <div className="flex items-start gap-4">
         <div className="shrink-0">
            <AvatarCell src={teacher?.image} name={teacher.name} size="lg" showName={false} />
         </div>

         <div className="flex-1 flex flex-col gap-2">

            <div className='flex flex-col'>
               <Label className="text-md font-bold">
                  {teacher.name}
               </Label>

               <Label className="text-sm font-medium text-primary">
                  {teacher.specialization}
               </Label>
            </div>

            <div className="space-y-2">

               <NSectionInfo
                  icon={Phone}
                  label={t('teachers.table.phone')}
                  value={teacher.phone}
               />

               <NSectionInfo
                  icon={GraduationCap}
                  label={t('teachers.table.classes')}
                  value={getAllClasses()}
               />

               <NSectionInfo
                  icon={BookOpen}
                  label={t('teachers.table.subjects')}
                  value={getAllSubjects()}
               />

            </div>
         </div>
      </div>
   );
};

export default TeacherCard;