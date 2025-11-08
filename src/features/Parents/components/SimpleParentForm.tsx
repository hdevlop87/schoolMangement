'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import { IdCard, Mail } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import { parentSchema } from '@/lib/validations'
import { useFormContext } from 'react-hook-form'
import { usePrefix } from '@/components/NForm/PrefixContext'
import { useEnum } from '@/hooks/useEnum'

// ==================== DEFAULT VALUES ====================

export const getParentDefaultValues = (parent = null, overrides = {}) => ({
   ...(parent?.id && { id: parent.id }),
   name: parent?.name || '',
   email: parent?.email || '',
   phone: parent?.phone || '',
   gender: parent?.gender ?? 'M',
   nationality: parent?.nationality || '',
   maritalStatus: parent?.maritalStatus ?? 'married',
   address: parent?.address || '',
   dateOfBirth: parent?.dateOfBirth || '',
   cin: parent?.cin || '',
   occupation: parent?.occupation || '',
   relationshipType: parent?.relationshipType ?? 'father',
   image: parent?.user?.image || '',
   isEmergencyContact: parent?.isEmergencyContact ?? false,
   financialResponsibility: parent?.financialResponsibility ?? '',
   ...overrides,
})

export const getFatherDefaultValues = (parent = null) =>
   getParentDefaultValues(parent, { gender: 'M', relationshipType: 'father' })

export const getMotherDefaultValues = (parent = null) =>
   getParentDefaultValues(parent, { gender: 'F', relationshipType: 'mother' })

// ==================== FORM CONTENT ====================

export const ParentFormContent = () => {
   const { t } = useTranslation()
   const { watch } = useFormContext();

   
   const prefix = usePrefix();
   const gender = watch(prefix ? `${prefix}.gender` : "gender");

   const defaultImage = gender === 'M'
      ? '/images/father.png'
      : '/images/mother.png'

   const genderOptions = useEnum('gender')
   const relationshipOptions = useEnum('relationshipType')
   const maritalStatusOptions = useEnum('maritalStatus')

   return (
      <div className='space-y-2'>
         <FormSectionHeader
            icon={IdCard}
            title={t('parents.form.personalInformation')}
         />

         <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4'>
            <div className='flex items-start justify-center'>
               <FormInput
                  name='image'
                  type='image'
                  formLabel={t('parents.form.parentImage')}
                  showPreview={true}
                  previewPosition='top'
                  imageSize='lg'
                  allowClear={true}
                  defaultImage={defaultImage}
               />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
               <FormInput
                  name='name'
                  type='text'
                  formLabel={t('parents.form.fullName')}
                  placeholder={t('parents.form.fullNamePlaceholder')}
                  required={true}
               />

               <FormInput
                  name='relationshipType'
                  type='select'
                  formLabel={t('parents.form.relationshipType')}
                  items={relationshipOptions}
                  required={true}
               />

               <FormInput
                  name='gender'
                  type='select'
                  formLabel={t('parents.form.gender')}
                  items={genderOptions}
               />

               <FormInput
                  name='nationality'
                  type='text'
                  formLabel={t('parents.form.nationality')}
                  placeholder={t('parents.form.nationalityPlaceholder')}
               />

               <FormInput
                  name='cin'
                  type='text'
                  formLabel={t('parents.form.cin')}
                  placeholder={t('parents.form.cinPlaceholder')}
                  required={true}
               />

               <FormInput
                  name='dateOfBirth'
                  type='date'
                  formLabel={t('parents.form.dateOfBirth')}
                  placeholder={t('parents.form.dateOfBirthPlaceholder')}
               />

               <FormInput
                  name='occupation'
                  type='text'
                  formLabel={t('parents.form.occupation')}
                  placeholder={t('parents.form.occupationPlaceholder')}
               />

               <FormInput
                  name='maritalStatus'
                  type='select'
                  formLabel={t('parents.form.maritalStatus')}
                  items={maritalStatusOptions}
                  required={true}
               />
            </div>
         </div>

         <FormSectionHeader
            icon={Mail}
            title={t('parents.form.contactInformation')}
         />

         <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <FormInput
               name='email'
               type='text'
               formLabel={t('parents.form.email')}
               placeholder={t('parents.form.emailPlaceholder')}
            />

            <FormInput
               name='phone'
               type='text'
               formLabel={t('parents.form.phone')}
               placeholder={t('parents.form.phonePlaceholder')}
               required={true}
            />
         </div>

         <FormInput
            name='address'
            type='textarea'
            formLabel={t('parents.form.address')}
            placeholder={t('parents.form.addressPlaceholder')}
         />
      </div>
   )
}

// ==================== MAIN FORM ====================

const SimpleParentForm = ({ parent = null }) => {
   const { handleConfirm } = useDialogStore()

   const handleSubmit = async (parentData) => {
      handleConfirm(parentData)
   }

   return (
      <NForm
         id='parent-form'
         schema={parentSchema}
         defaultValues={getParentDefaultValues(parent)}
         onSubmit={handleSubmit}
      >
         <ParentFormContent />
      </NForm>
   )
}

export default SimpleParentForm