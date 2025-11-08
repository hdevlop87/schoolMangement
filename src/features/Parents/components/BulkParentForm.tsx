'use client'

import NForm from '@/components/NForm'
import { Users } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import DynamicArray from '@/components/NForm/DynamicArray'
import { ParentFormContent, getParentDefaultValues } from './SimpleParentForm'
import { parentsSchema } from '@/lib/validations'

export const BulkParentFormContent = () => {

  const { t } = useTranslation()

  const handleAddParent = (append) => {
    append({
      ...getParentDefaultValues(),
      gender: 'F',
      relationshipType: 'mother',
    })
  }

  return (
    <DynamicArray
      name="parents"
      icon={Users} title={t('parents.form.parent')}
      onAdd={handleAddParent}
    >
      <ParentFormContent />
    </DynamicArray>
  )
}

// ==================== MAIN FORM ====================

const BulkParentForm = () => {
  const { handleConfirm } = useDialogStore()

  const defaultValues = {
    parents: []
  }

  const handleSubmit = async (data) => {
    handleConfirm(data)
  }

  return (
    <NForm
      id='parent-form'
      schema={parentsSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    >
      <BulkParentFormContent />
    </NForm>
  )
}

export default BulkParentForm