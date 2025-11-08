'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import React from 'react'
import { BookOpen, Hash } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { subjectSchema } from '@/lib/validations'
import { useTranslation } from '@/hooks/useLanguage'

const SubjectForm = ({ subject = null }) => {

   const { t } = useTranslation();
   const { handleConfirm } = useDialogStore();

   const defaultValues = {
      ...(subject?.id && { id: subject.id }),
      code: subject?.code || '',
      name: subject?.name || '',
      description: subject?.description || '',
   }

   const handleSubmit = async (formData) => {
      handleConfirm(formData);
   }

   return (
      <div className='flex flex-col justify-center items-center w-full mt-4'>
         <div className='flex flex-col h-full w-full gap-4'>
            <NForm
               id='subject-form'
               schema={subjectSchema}
               defaultValues={defaultValues}
               onSubmit={handleSubmit}
            >
               <div className='flex flex-col gap-3'>

                  {/* Subject Information Section */}
                  <FormSectionHeader
                     icon={BookOpen}
                     title={t('subjects.form.subjectInformation')}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                     <FormInput
                        name='code'
                        type='text'
                        formLabel={t('subjects.form.code')}
                        placeholder={t('subjects.form.codePlaceholder')}
                        icon={Hash}
                        required={true}
                     />

                     <FormInput
                        name='name'
                        type='text'
                        formLabel={t('subjects.form.name')}
                        placeholder={t('subjects.form.namePlaceholder')}
                        icon={BookOpen}
                        required={true}
                     />
                  </div>

                  <FormInput
                     name='description'
                     type='textarea'
                     formLabel={t('subjects.form.description')}
                     placeholder={t('subjects.form.descriptionPlaceholder')}
                     className='col-span-1'
                  />

               </div>

            </NForm>
         </div>
      </div>
   )
}

export default SubjectForm
