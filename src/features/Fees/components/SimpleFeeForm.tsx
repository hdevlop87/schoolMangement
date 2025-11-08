'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import { DollarSign, FileText } from 'lucide-react'
import { useTranslation } from '@/hooks/useLanguage'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { feeSchema } from '@/lib/validations'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { calculateTotalAmount } from '@/lib/utils'
import { usePrefix } from '@/components/NForm/PrefixContext'
import { useEnum } from '@/hooks/useEnum'

const SimpleFeeForm = ({ fee, feeTypes = [] }) => {
   const { t } = useTranslation()
   const { handleConfirm } = useDialogStore()

   const defaultValues = {
      id: fee?.id || '',
      studentId: fee?.studentId || '',
      feeTypeId: fee?.feeTypeId || '',
      amount: 0,
      schedule: fee?.schedule || 'monthly',
      totalAmount: fee?.totalAmount || '',
      discountAmount: fee?.discountAmount || '',
      status: fee?.status || 'pending',
      notes: fee?.notes || '',
   }

   const handleSubmit = async (feeData) => {
      handleConfirm(feeData)
   }

   return (
      <div className='w-full'>
         <NForm
            id='simple-fee-form'
            schema={feeSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
         >
            <SimpleFeeFormContent feeTypes={feeTypes} />
         </NForm>
      </div>
   )
}

const SimpleFeeFormContent = ({ feeTypes }) => {
   const { t } = useTranslation()
   const { watch, setValue } = useFormContext()
   const prefix = usePrefix();
   
   const amount = watch(`${prefix}.amount`)
   const discountAmount = watch(`${prefix}.discountAmount`)
   const schedule = watch(`${prefix}.schedule`)

   const isScheduleDisabled = schedule === 'oneTime'

   useEffect(() => {
      const totalAmount = calculateTotalAmount(amount, schedule, discountAmount)
      setValue(`${prefix}.totalAmount`, totalAmount)
   }, [amount, schedule, discountAmount, prefix, setValue])

   const scheduleOptions = useEnum('schedule')
   
   const feeTypeOptions = feeTypes.map((feeType) => ({
      value: feeType.id,
      label: feeType.name
   }))

   const statusOptions = [
      { value: 'pending', label: t('fees.status.pending') },
      { value: 'paid', label: t('fees.status.paid') },
      { value: 'partially_paid', label: t('fees.status.partiallyPaid') },
      { value: 'overdue', label: t('fees.status.overdue') },
   ]

   return (
      <div className='flex flex-col gap-2'>
         <FormSectionHeader
            icon={DollarSign}
            title={t('fees.form.feeInformation')}
         />

         <div className='flex flex-col gap-2'>

            <FormInput
               name='feeTypeId'
               type='select'
               formLabel={t('fees.form.feeType')}
               placeholder={t('fees.form.feeTypePlaceholder')}
               items={feeTypeOptions}
               required={true}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
               <FormInput
                  name='amount'
                  type='number'
                  formLabel={t('fees.form.amount') || 'Amount'}
                  placeholder="0.00"
                  required={true}
               />

               <FormInput
                  name='schedule'
                  type='select'
                  formLabel={t('fees.form.schedule')}
                  placeholder={t('fees.form.schedulePlaceholder')}
                  items={scheduleOptions}
                  required={true}
                  disabled={isScheduleDisabled}
               />
            </div>

            {/* Discount Amount and Status - 2 Columns */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
               <FormInput
                  name='discountAmount'
                  type='number'
                  formLabel={t('fees.form.discountAmount')}
                  placeholder={t('fees.form.discountAmountPlaceholder')}
               />

               <FormInput
                  name='status'
                  type='select'
                  formLabel={t('fees.form.status')}
                  items={statusOptions}
               />
            </div>

            {/* Total Amount - Full Width */}
            <FormInput
               name='totalAmount'
               type='number'
               formLabel={t('fees.form.totalAmount') || 'Total Amount'}
               readOnly={true}
               className="border-green-700 bg-green-100"
            />
         </div>

         <FormSectionHeader
            icon={FileText}
            title={t('fees.form.additionalInformation')}
         />

         <div className='grid grid-cols-1 gap-2'>
            <FormInput
               name='notes'
               type='textarea'
               formLabel={t('fees.form.notes')}
               placeholder={t('fees.form.notesPlaceholder')}
            />
         </div>
      </div>
   )
}

export default SimpleFeeForm