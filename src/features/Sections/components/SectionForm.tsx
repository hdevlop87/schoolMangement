'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import React from 'react'
import { Building, Hash, Users, DoorOpen } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { sectionSchema } from '@/lib/validations'
import { useTranslation } from '@/hooks/useLanguage'
import { useClasses } from '@/hooks/useClasses'

const SectionForm = ({ section = null }) => {

   const { t } = useTranslation();
   const { handleConfirm } = useDialogStore();
   const { classes, isClassesLoading } = useClasses();

   const defaultValues = {
      ...(section?.id && { id: section.id }),
      name: section?.name || '',
      classId: section?.classId || '',
      maxStudents: section?.maxStudents || 30,
      roomNumber: section?.roomNumber || '',
      status: section?.status || 'active',
   }

   const classOptions = classes?.map(cls => ({
      value: cls.id,
      label: `${cls.name} (${cls.academicYear})`,
   })) || [];


   const handleSubmit = async (sectionData) => {
      handleConfirm(sectionData);
   }

   return (
      <div className='flex flex-col justify-center items-center w-full mt-4'>
         <div className='flex flex-col h-full w-full gap-4'>
            <NForm
               id='section-form'
               schema={sectionSchema}
               defaultValues={defaultValues}
               onSubmit={handleSubmit}
            >
               <div className='flex flex-col gap-3'>

                  <FormSectionHeader
                     icon={Building}
                     title={t('sections.form.sectionInformation')}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                     <FormInput
                        name='name'
                        type='text'
                        formLabel={t('sections.form.sectionName')}
                        placeholder={t('sections.form.sectionNamePlaceholder')}
                        icon={Hash}
                        required={true}
                     />

                     <FormInput
                        name='classId'
                        type='select'
                        formLabel={t('sections.form.class')}
                        placeholder={t('sections.form.classPlaceholder')}
                        icon={Building}
                        items={classOptions}
                        required={true}
                        disabled={isClassesLoading}
                     />

                     <FormInput
                        name='roomNumber'
                        type='text'
                        formLabel={t('sections.form.roomNumber')}
                        placeholder={t('sections.form.roomNumberPlaceholder')}
                        icon={DoorOpen}
                     />

                     <FormInput
                        name='maxStudents'
                        type='number'
                        formLabel={t('sections.form.maxStudents')}
                        placeholder={t('sections.form.maxStudentsPlaceholder')}
                        icon={Users}
                     />

                  </div>

               </div>

            </NForm>
         </div>
      </div>
   )
}

export default SectionForm
