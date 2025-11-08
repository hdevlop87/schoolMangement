'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import React from 'react'
import { GraduationCap, Calendar, FileText } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { classSchema } from '@/lib/validations'
import { useTranslation } from '@/hooks/useLanguage'

const ClassForm = ({ classData = null}) => {

   const { t } = useTranslation();
   const { handleConfirm } = useDialogStore();

   const defaultValues = {
      ...(classData?.id && { id: classData.id }),
      name: classData?.name || 'CE1',
      academicYear: classData?.academicYear || '2024-2025',
      level: classData?.level || 'Middle',
      description: classData?.description || 'asdasd',
   }

   const handleSubmit = async (formData) => {
      handleConfirm(formData);
   }

   return (
      <div className='flex flex-col justify-center items-center w-full mt-4'>
         <div className='flex flex-col h-full w-full gap-4'>
            <NForm
               id='class-form'
               schema={classSchema}
               defaultValues={defaultValues}
               onSubmit={handleSubmit}
            >
               <div className='flex flex-col gap-3'>

                  {/* Class Information Section */}
                  <FormSectionHeader
                     icon={GraduationCap}
                     title={t('classes.form.classInformation')}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                     <FormInput
                        name='name'
                        type='text'
                        formLabel={t('classes.form.className')}
                        placeholder={t('classes.form.classNamePlaceholder')}
                        icon={GraduationCap}
                        required={true}
                     />

                     <FormInput
                        name='academicYear'
                        type='text'
                        formLabel={t('classes.form.academicYear')}
                        placeholder={t('classes.form.academicYearPlaceholder')}
                        icon={Calendar}
                        required={true}
                     />

                     <FormInput
                        name='level'
                        type='text'
                        formLabel={t('classes.form.level')}
                        placeholder={t('classes.form.levelPlaceholder')}
                     />
                  </div>

                  {/* Description Section */}
                  <FormSectionHeader
                     icon={FileText}
                     title={t('classes.form.description')}
                  />

                  <div className='grid grid-cols-1 gap-2'>
                     <FormInput
                        name='description'
                        type='textarea'
                        formLabel={t('classes.form.descriptionLabel')}
                        placeholder={t('classes.form.descriptionPlaceholder')}
                     />
                  </div>

               </div>

            </NForm>
         </div>
      </div>
   )
}

export default ClassForm
