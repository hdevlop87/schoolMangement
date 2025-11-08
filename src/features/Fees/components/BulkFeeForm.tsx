'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import { useEffect } from 'react'
import { DollarSign, IdCard } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/hooks/useLanguage'
import { bulkFeeFormSchema } from '@/lib/validations'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { injectStudentIdToFees } from '../utils/feeUtils'
import FormSectionHeader from '@/components/NForm/FormHeader'
import { calculateTotalAmount, calculateTotalFees } from '@/lib/utils'
import { useAddFees } from '../hooks/useAddFees'
import DynamicArray from '@/components/NForm/DynamicArray'
import { useEnum } from '@/hooks/useEnum'
import { usePrefix } from '@/components/NForm/PrefixContext'

// ==================== COMPONENTS ====================

const TotalFeesBadge = () => {
   const { t } = useTranslation()
   const { watch } = useFormContext()

   const feesData = watch('fees') || []
   const totalFees = calculateTotalFees(feesData)

   if (feesData.length === 0) return null

   return (
      <div className="flex items-center justify-between  rounded-lg bg-muted/50">
         <Label className="text-sm font-medium">
            {t('fees.form.selectedFees') || 'Selected Fees'}
         </Label>
         <Badge variant="secondary" className="font-semibold text-md">
            {t('fees.form.total') || 'Total'}: ${totalFees}
         </Badge>
      </div>
   )
}

const FeeItem = () => {
   const { setValue, watch } = useFormContext();
   const { t } = useTranslation();
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

   return (
      <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
         <FormInput
            name="amount"
            type='text'
            formLabel={t('fees.form.amount') || 'Amount'}
            placeholder="0.00"
         />

         <FormInput
            name="discountAmount"
            type='number'
            formLabel={t('fees.form.discountAmount')}
            placeholder={t('fees.form.discountAmountPlaceholder')}
         />

         <FormInput
            name="schedule"
            type='select'
            formLabel={t('fees.form.schedule')}
            placeholder={t('fees.form.schedulePlaceholder')}
            items={scheduleOptions}
            required
            disabled={isScheduleDisabled}
         />

         <FormInput
            name="totalAmount"
            type="number"
            formLabel={t('fees.form.totalAmount')}
            readOnly={true}
            className="border-green-700 bg-green-100"
         />
      </div>
   )
}


export const BulkFeeFormContent = ({ feeTypes }) => {
   const { watch } = useFormContext()

   const feesData = watch('fees') || []

   const { handleAddFees } = useAddFees({ feeTypes, feesData })

   return (
      <DynamicArray
         name="fees"
         icon={DollarSign}
         title={(field) => field.feeTypeName}
         onAdd={handleAddFees}
      >
         <FeeItem />
      </DynamicArray>
   )
}

// ==================== MAIN FORM ====================
const BulkFeeForm = ({ students = [], feeTypes = [] }) => {
   const { t } = useTranslation()
   const { handleConfirm } = useDialogStore()

   const handleSubmit = async (feeData) => {
      const processedData = {
         fees: injectStudentIdToFees(feeData.fees, feeData.studentId)
      }
      handleConfirm(processedData)
   }

   const studentOptions = students.map((student) => ({
      value: student.id,
      label: `${student.name} - ${student.studentCode}`
   }))

   return (
      <NForm
         id='bulk-fee-form'
         schema={bulkFeeFormSchema}
         defaultValues={{ studentId: '', fees: [] }}
         onSubmit={handleSubmit}
      >
         <FormInput
            name='studentId'
            type='combobox'
            formLabel={t('fees.form.student')}
            placeholder={t('fees.form.studentPlaceholder')}
            searchPlaceholder={t('fees.form.searchStudent') || 'Search student...'}
            emptyMessage={t('fees.form.noStudentFound') || 'No student found.'}
            items={studentOptions}
            required={true}
         />

         <FormSectionHeader icon={IdCard} title={t('students.form.feesInformation')} />
         <TotalFeesBadge />
         <BulkFeeFormContent feeTypes={feeTypes} />
      </NForm>
   )
}

export default BulkFeeForm


