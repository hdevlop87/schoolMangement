'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { Mail, Lock, User, Shield } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { usersValidationSchema, updateUsersValidationSchema } from '../config/usersValidateSchema'
import { useRoles } from '@/features/Roles/hooks/useRoles'
import { useTranslation } from '@/hooks/useLanguage'

const UserForm = ({ user = null, mode = 'create' }) => {

   const { t } = useTranslation();
   const { handleConfirm } = useDialogStore();
   const { roles } = useRoles();

   const isUpdateMode = mode === 'update' || user !== null;
   const schema = isUpdateMode ? updateUsersValidationSchema(t) : usersValidationSchema(t);

   const defaultValues = {
      id: user?.id || null,
      name: user?.name || 'hicham',
      email: user?.email || 'hicham@hicham.com',
      password: null,
      confirmPassword: null,
      image: user?.image || null,
      roleId: user?.roleId || '',
   }

   const roleOptions = roles?.map(role => ({
      value: role.id,
      label: role.name
   })) || []

   const handleSubmit = async (userData) => {
      handleConfirm(userData);
   }

   return (
      <div className='flex flex-col  justify-center items-center w-full mt-4'>

         <div className='flex flex-col h-full w-full gap-4'>
            <NForm
               id='user-form'
               schema={schema}
               defaultValues={defaultValues}
               onSubmit={handleSubmit}
            >
               <FormInput
                  name='name'
                  type='text'
                  formLabel={t('users.form.fullName')}
                  placeholder={t('users.form.fullNamePlaceholder')}
                  variant='default'
                  icon={User}
                  required={true}
               />

               <FormInput
                  name='image'
                  type='file'
                  formLabel={t('users.form.image')}
                  variant='default'
                  icon={User}
                  required={true}
               />

               <FormInput
                  name='email'
                  type='text'
                  formLabel={t('users.form.email')}
                  placeholder={t('users.form.emailPlaceholder')}
                  variant='default'
                  icon={Mail}
                  required={true}
               />

               <FormInput
                  name='password'
                  type='password'
                  formLabel={user?.userId ? t('users.form.newPassword') : t('users.form.password')}
                  placeholder={t('users.form.passwordPlaceholder')}
                  variant='default'
                  icon={Lock}
                  required={!isUpdateMode}
               />

               <FormInput
                  name='confirmPassword'
                  type='password'
                  formLabel={t('users.form.confirmPassword')}
                  placeholder={t('users.form.confirmPasswordPlaceholder')}
                  variant='default'
                  icon={Lock}
                  required={!isUpdateMode}
               />

               <FormInput
                  name='roleId'
                  type='select'
                  formLabel={t('users.form.userRole')}
                  variant='default'
                  icon={Shield}
                  items={roleOptions}
               />

            </NForm>

         </div>
      </div>
   )
}

export default UserForm