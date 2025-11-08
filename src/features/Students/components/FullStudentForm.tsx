'use client'

import StepForm from '@/components/MultiStepForm/StepForm'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { getStudentDefaultValues, StudentFormContent } from './SimpleStudentForm'
import { BulkFeeFormContent } from '@/features/Fees/components/BulkFeeForm'
import MultiStepForm from '@/components/MultiStepForm'
import { BulkParentFormContent } from '@/features/Parents/components/BulkParentForm'
import { fullStudentSchema } from '@/lib/validations'

const FullStudentForm = ({ classes = [], feeTypes = [] }) => {

  const { handleConfirm } = useDialogStore()

  const defaultValues = {
    student: getStudentDefaultValues(),
    parents: [],
    fees: [] 
  }

  const handleSubmit = async (formData) => {
    const transformedData = {
      ...formData.student,
      parents:formData.parents, 
      fees:formData.fees
    }
    await handleConfirm(transformedData)
  }

  return (
    <MultiStepForm onSubmit={handleSubmit} schema={fullStudentSchema} defaultValues={defaultValues}>

      <StepForm id="student" title="Student Information">
        <StudentFormContent classes={classes} />
      </StepForm>

      <StepForm id="parents" title="Parents Information">
        <BulkParentFormContent />
      </StepForm>

      <StepForm id="fees" title="Fees Information">
        <BulkFeeFormContent feeTypes={feeTypes} />
      </StepForm>
      
    </MultiStepForm>
  )
}

export default FullStudentForm