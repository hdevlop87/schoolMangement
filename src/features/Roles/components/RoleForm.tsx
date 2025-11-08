'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { Tag, FileText } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { roleValidationSchema } from '../config/rolesValidateSchema'
import { useTranslation } from '@/hooks/useLanguage'

const RoleForm = ({ role = null, mode = 'create' }) => {

    const { t } = useTranslation();
    const { handleConfirm } = useDialogStore();
    
    const isUpdateMode = mode === 'update' || role !== null;
    const schema = roleValidationSchema(t);

    const defaultValues = {
        id: role?.id || '',
        name: role?.name || '',
        description: role?.description || '',
    }

    const handleSubmit = async (roleData) => {
        const finalData = {
            ...roleData,
            ...(isUpdateMode && {
                id: role?.id,
            })
        };
        handleConfirm(finalData);
    }

    return (
        <div className='flex flex-col justify-center items-center w-full mt-4'>

            <div className='flex flex-col h-full w-full gap-4'>
                <NForm
                    id='role-form'
                    schema={schema}
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                >
                    <FormInput
                        name='name'
                        type='text'
                        formLabel={t('roles.form.name')}
                        placeholder={t('roles.form.namePlaceholder')}
                        variant='default'
                        icon={Tag}
                    />

                    <FormInput
                        name='description'
                        type='textarea'
                        formLabel={t('roles.form.description')}
                        placeholder={t('roles.form.descriptionPlaceholder')}
                        variant='default'
                        icon={FileText}
                    />

                </NForm>

            </div>
        </div>
    )
}

export default RoleForm