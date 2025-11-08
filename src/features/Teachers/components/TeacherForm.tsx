'use client'

import StepForm from '@/components/MultiStepForm/StepForm'
import FormInput from '@/components/NForm/FormInput'
import FormHeader from '@/components/NForm/FormHeader'
import { Briefcase, IdCard } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import { useFormContext } from 'react-hook-form'
import { teacherPersonalSchema, teacherProfessionalSchema, assignmentsSchema } from '@/lib/validations'
import MultiStepForm from '@/components/MultiStepForm'
import { useEnum } from '@/hooks/useEnum'
import { AssignmentFormContent } from './AssignmentForm'
import { z } from 'zod'

// ============================================
// Combined Schema for Multi-Step Form
// ============================================
const fullTeacherSchema = z.object({
   personal: teacherPersonalSchema,
   professional: teacherProfessionalSchema,
   assignments: assignmentsSchema
})

// ============================================
// Default Values Helper Functions
// ============================================
export const getTeacherPersonalDefaultValues = (teacher = null) => ({
   ...(teacher?.id && { id: teacher.id }),
   name: teacher?.name ?? '',
   cin: teacher?.cin ?? '',
   email: teacher?.email ?? '',
   phone: teacher?.phone ?? '',
   address: teacher?.address ?? '',
   gender: teacher?.gender ?? 'M',
   emergencyContact: teacher?.emergencyContact ?? '',
   emergencyPhone: teacher?.emergencyPhone ?? '',
   status: teacher?.status ?? 'active',
   image: teacher?.user?.image ?? null,
})

export const getTeacherProfessionalDefaultValues = (teacher = null) => ({
   specialization: teacher?.specialization ?? '',
   yearsOfExperience: teacher?.yearsOfExperience ?? 0,
   salary: teacher?.salary ?? 0,
   hireDate: teacher?.hireDate ?? new Date().toISOString().split('T')[0],
   bankAccount: teacher?.bankAccount ?? '',
   employmentType: teacher?.employmentType ?? 'full-time',
   workloadHours: teacher?.workloadHours ?? 40,
   academicDegrees: teacher?.academicDegrees ?? '',
})

export const getTeacherAssignmentsDefaultValues = (teacher = null) => ({
   assignments: teacher?.assignments ?? []
})

const TeacherForm = ({ teacher = null, classes = [], subjects = [] }) => {
   const { handleConfirm } = useDialogStore()

   const defaultValues = {
      personal: getTeacherPersonalDefaultValues(teacher),
      professional: getTeacherProfessionalDefaultValues(teacher),
      assignments: getTeacherAssignmentsDefaultValues(teacher)
   }

   const handleSubmit = async (formData) => {
      const transformedData = {
         ...formData.personal,
         ...formData.professional,
         assignments: formData.assignments
      }
      await handleConfirm(transformedData)
   }

   return (
      <MultiStepForm onSubmit={handleSubmit} schema={fullTeacherSchema} defaultValues={defaultValues}>
         <StepForm id="personal" title="Personal Information">
            <PersonalInfoContent />
         </StepForm>

         <StepForm id="professional" title="Professional Information">
            <ProfessionalInfoContent />
         </StepForm>

         <StepForm id="assignments" title="Assignments">
            <AssignmentFormContent
               classes={classes}
               subjects={subjects}
            />
         </StepForm>
      </MultiStepForm>
   )
}

// ============================================
// Step 1: Personal Information
// ============================================
export const PersonalInfoContent = () => {
   const { t } = useTranslation()
   const { watch } = useFormContext()
   const gender = watch('gender')
   const genderOptions = useEnum('gender')
   const statusOptions = useEnum('teacherStatus')

   const defaultImage = gender === 'M'
      ? '/images/teacherM.png'
      : '/images/teacherF.png'

   return (
      <>
         <FormHeader
            icon={IdCard}
            title={t('teachers.form.personalInformation')}
         />

         <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4'>
            <div className='flex items-start justify-center'>
               <FormInput
                  name='image'
                  type='image'
                  formLabel={t('teachers.form.image')}
                  showPreview={true}
                  previewPosition='top'
                  imageSize='xl'
                  allowClear={true}
                  defaultImage={defaultImage}
               />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
               <FormInput
                  name='name'
                  type='text'
                  formLabel={t('teachers.form.fullName')}
                  placeholder={t('teachers.form.fullNamePlaceholder')}
                  required={true}
               />

               <FormInput
                  name='cin'
                  type='text'
                  formLabel={t('teachers.form.cin')}
                  placeholder={t('teachers.form.cinPlaceholder')}
                  required={true}
               />

               <FormInput
                  name='gender'
                  type='select'
                  formLabel={t('teachers.form.gender')}
                  items={genderOptions}
               />

               <FormInput
                  name='email'
                  type='text'
                  formLabel={t('teachers.form.email')}
                  placeholder={t('teachers.form.emailPlaceholder')}
                  required={true}
               />

               <FormInput
                  name='phone'
                  type='text'
                  formLabel={t('teachers.form.phone')}
                  placeholder={t('teachers.form.phonePlaceholder')}
                  required={true}
               />

               <FormInput
                  name='status'
                  type='select'
                  formLabel={t('teachers.form.status')}
                  items={statusOptions}
               />

               <FormInput
                  name='emergencyContact'
                  type='text'
                  formLabel={t('teachers.form.emergencyContactName')}
                  placeholder={t('teachers.form.emergencyContactNamePlaceholder')}
               />

               <FormInput
                  name='emergencyPhone'
                  type='text'
                  formLabel={t('teachers.form.emergencyPhone')}
                  placeholder={t('teachers.form.emergencyPhonePlaceholder')}
               />

               <div className='md:col-span-2'>
                  <FormInput
                     name='address'
                     type='textarea'
                     formLabel={t('teachers.form.address')}
                     placeholder={t('teachers.form.addressPlaceholder')}
                  />
               </div>
            </div>
         </div>
      </>
   )
}

// ============================================
// Step 2: Professional Information
// ============================================
export const ProfessionalInfoContent = () => {
   const { t } = useTranslation()
   const employmentTypeOptions = useEnum('employmentType')

   return (
      <div className='space-y-2'>
         <FormHeader
            icon={Briefcase}
            title={t('teachers.form.professionalInformation')}
         />

         <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <FormInput
               name='specialization'
               type='text'
               formLabel={t('teachers.form.specialization')}
               placeholder={t('teachers.form.specializationPlaceholder')}
            />

            <FormInput
               name='yearsOfExperience'
               type='number'
               formLabel={t('teachers.form.yearsOfExperience')}
               placeholder={t('teachers.form.yearsOfExperiencePlaceholder')}
            />

            <FormInput
               name='hireDate'
               type='date'
               formLabel={t('teachers.form.hireDate')}
               required={true}
            />

            <FormInput
               name='salary'
               type='number'
               formLabel={t('teachers.form.salary')}
               placeholder={t('teachers.form.salaryPlaceholder')}
            />

            <FormInput
               name='bankAccount'
               type='text'
               formLabel={t('teachers.form.bankAccount')}
               placeholder={t('teachers.form.bankAccountPlaceholder')}
            />

            <FormInput
               name='employmentType'
               type='select'
               formLabel={t('teachers.form.employmentType')}
               placeholder={t('teachers.form.employmentTypePlaceholder')}
               items={employmentTypeOptions}
            />

            <FormInput
               name='workloadHours'
               type='number'
               formLabel={t('teachers.form.workloadHours')}
               placeholder={t('teachers.form.workloadHoursPlaceholder')}
            />

            <FormInput
               name='academicDegrees'
               type='text'
               formLabel={t('teachers.form.academicDegrees')}
               placeholder={t('teachers.form.academicDegreesPlaceholder')}
            />
         </div>
      </div>
   )
}

export default TeacherForm