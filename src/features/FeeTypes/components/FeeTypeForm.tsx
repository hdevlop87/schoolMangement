'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import React from 'react'
import { DollarSign, Tag } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import { feeTypeSchema } from '@/lib/validations'

const FeeTypeForm = ({ feeType = null }) => {

   const { t } = useTranslation();
   const { handleConfirm } = useDialogStore();
   
   const defaultValues = {
      ...(feeType?.id && { id: feeType.id }),
      name: feeType?.name || '',
      description: feeType?.description || '',
      category: feeType?.category || 'tuition', 
      amount: feeType?.amount || '',
      paymentType: feeType?.paymentType || 'recurring',
   }

   const categoryOptions = [
      { value: 'tuition', label: t('feeTypes.category.tuition') },
      { value: 'registration', label: t('feeTypes.category.registration') },
      { value: 'transport', label: t('feeTypes.category.transport') },
      { value: 'cafeteria', label: t('feeTypes.category.cafeteria') },
      { value: 'books', label: t('feeTypes.category.books') },
      { value: 'sports', label: t('feeTypes.category.sports') },
      { value: 'uniform', label: t('feeTypes.category.uniform') },
      { value: 'technology', label: t('feeTypes.category.technology') },
      { value: 'fieldtrip', label: t('feeTypes.category.fieldtrip') },
      { value: 'other', label: t('feeTypes.category.other') },
   ]

   const paymentTypeOptions = [
      { value: 'recurring', label: t('feeTypes.paymentType.recurring') },
      { value: 'oneTime', label: t('feeTypes.paymentType.oneTime') },
   ]

   const handleSubmit = async (feeTypeData: any) => {
      handleConfirm(feeTypeData);
   }

   return (
      <div className='w-full'>
         <NForm
            id='fee-type-form'
            schema={feeTypeSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
         >
            <div className='flex flex-col gap-4'>
               <FormSectionHeader
                  icon={DollarSign}
                  title={t('feeTypes.form.feeTypeInformation')}
               />

               <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  <FormInput
                     name='name'
                     type='text'
                     formLabel={t('feeTypes.form.name')}
                     placeholder={t('feeTypes.form.namePlaceholder')}
                     required={true}
                  />

                  <FormInput
                     name='category'
                     type='select'
                     formLabel={t('feeTypes.form.category')}
                     placeholder={t('feeTypes.form.categoryPlaceholder')}
                     items={categoryOptions}
                     required={true}
                  />

                  <FormInput
                     name='amount'
                     type='number'
                     formLabel={t('feeTypes.form.amount')}
                     placeholder={t('feeTypes.form.amountPlaceholder')}
                     required={true}
                  />

                  <FormInput
                     name='paymentType'
                     type='select'
                     formLabel={t('feeTypes.form.paymentType')}
                     placeholder={t('feeTypes.form.paymentTypePlaceholder')}
                     items={paymentTypeOptions}
                     required={true}
                  />
               </div>

               <FormSectionHeader
                  icon={Tag}
                  title={t('feeTypes.form.description')}
               />

               <div className='grid grid-cols-1 gap-2'>
                  <FormInput
                     name='description'
                     type='textarea'
                     formLabel={t('feeTypes.form.descriptionLabel')}
                     placeholder={t('feeTypes.form.descriptionPlaceholder')}
                  />
               </div>

            </div>

         </NForm>
      </div>
   )
}

export default FeeTypeForm
