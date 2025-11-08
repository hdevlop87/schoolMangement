'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import React from 'react'
import { Briefcase, IdCard } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { driversValidationSchema } from '../config/driversValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'
import { useFormContext } from 'react-hook-form'

const DriverForm = ({ driver = null, defaultGender = 'M' }) => {

   const { handleConfirm } = useDialogStore();

   const defaultValues = {
      ...(driver?.id && { id: driver.id }),
      name: driver?.name || '',
      cin: driver?.cin || '',
      email: driver?.email || '',
      phone: driver?.phone || '',
      address: driver?.address || '',
      gender: driver?.gender || defaultGender,
      licenseNumber: driver?.licenseNumber || '',
      licenseType: driver?.licenseType || 'B',
      licenseExpiry: driver?.licenseExpiry || '',
      hireDate: driver?.hireDate || '',
      salary: driver?.salary || '',
      yearsOfExperience: driver?.yearsOfExperience || '',
      emergencyContact: driver?.emergencyContact || '',
      emergencyPhone: driver?.emergencyPhone || '',
      status: driver?.status || 'active',
      notes: driver?.notes || '',
      image: driver?.user?.image || null,
   }

   const handleSubmit = async (driverData) => {
      handleConfirm(driverData);
   }

   return (
      <NForm id='driver-form' schema={driversValidationSchema} defaultValues={defaultValues} onSubmit={handleSubmit} >
         <DriverFormContent />
      </NForm>
   )
}

const DriverFormContent = () => {

   const { t } = useTranslation();
   const { watch } = useFormContext()
   const gender = watch('gender')

   const defaultImage = gender === 'M'
      ? '/images/driverM.png'
      : '/images/driverF.png'

   const genderOptions = [
      { value: 'M', label: t('common.male') },
      { value: 'F', label: t('common.female') },
   ]

   const licenseTypeOptions = [
      { value: 'A', label: 'A (Motorcycle)' },
      { value: 'B', label: 'B (Car)' },
      { value: 'C', label: 'C (Truck)' },
      { value: 'D', label: 'D (Bus)' },
      { value: 'E', label: 'E (Trailer)' },
   ]

   const statusOptions = [
      { value: 'active', label: t('drivers.status.active') },
      { value: 'inactive', label: t('drivers.status.inactive') },
      { value: 'on_leave', label: t('drivers.status.onLeave') },
      { value: 'suspended', label: t('drivers.status.suspended') },
   ]

   return (
      <div className='space-y-2'>

         <FormSectionHeader
            icon={IdCard}
            title={t('drivers.form.personalInformation')}
         />

         <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4'>

            <div className='flex items-start justify-center'>
               <FormInput
                  name='image'
                  type='image'
                  formLabel={t('drivers.form.image')}
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
                  formLabel={t('drivers.form.fullName')}
                  placeholder={t('drivers.form.fullNamePlaceholder')}
                  required={true}
               />

               <FormInput
                  name='cin'
                  type='text'
                  formLabel={t('drivers.form.cin')}
                  placeholder={t('drivers.form.cinPlaceholder')}
                  required={true}
               />

               <FormInput
                  name='gender'
                  type='select'
                  formLabel={t('drivers.form.gender')}
                  items={genderOptions}
               />

               <FormInput
                  name='email'
                  type='text'
                  formLabel={t('drivers.form.email')}
                  placeholder={t('drivers.form.emailPlaceholder')}
                  required={true}
               />

               <FormInput
                  name='phone'
                  type='text'
                  formLabel={t('drivers.form.phone')}
                  placeholder={t('drivers.form.phonePlaceholder')}
                  required={true}
               />

               <FormInput
                  name='status'
                  type='select'
                  formLabel={t('drivers.form.status')}
                  items={statusOptions}
                  required={true}
               />


               <FormInput
                  name='emergencyPhone'
                  type='text'
                  formLabel={t('drivers.form.emergencyPhone')}
                  placeholder={t('drivers.form.emergencyPhonePlaceholder')}
               />

               <FormInput
                  name='emergencyContact'
                  type='text'
                  formLabel={t('drivers.form.emergencyContactName')}
                  placeholder={t('drivers.form.emergencyContactNamePlaceholder')}
               />

               <div className='md:col-span-2'>
                  <FormInput
                     name='address'
                     type='textarea'
                     formLabel={t('drivers.form.address')}
                     placeholder={t('drivers.form.addressPlaceholder')}
                  />
               </div>
            </div>
         </div>

         <FormSectionHeader
            icon={Briefcase}
            title={t('drivers.form.professionalInformation')}
         />

         <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
            <FormInput
               name='licenseNumber'
               type='text'
               formLabel={t('drivers.form.licenseNumber')}
               placeholder={t('drivers.form.licenseNumberPlaceholder')}
               required={true}
            />

            <FormInput
               name='licenseType'
               type='select'
               formLabel={t('drivers.form.licenseType')}
               items={licenseTypeOptions}
               required={true}
            />

            <FormInput
               name='licenseExpiry'
               type='date'
               formLabel={t('drivers.form.licenseExpiry')}
               required={true}
            />

            <FormInput
               name='hireDate'
               type='date'
               formLabel={t('drivers.form.hireDate')}
               required={true}
            />

            <FormInput
               name='yearsOfExperience'
               type='number'
               formLabel={t('drivers.form.yearsOfExperience')}
               placeholder={t('drivers.form.yearsOfExperiencePlaceholder')}
            />

            <FormInput
               name='salary'
               type='number'
               formLabel={t('drivers.form.salary')}
               placeholder={t('drivers.form.salaryPlaceholder')}
            />


            <div className='md:col-span-3'>
               <FormInput
                  name='notes'
                  type='textarea'
                  formLabel={t('drivers.form.notes')}
                  placeholder={t('drivers.form.notesPlaceholder')}
               />
            </div>
         </div>
      </div>
   )
}

export default DriverForm