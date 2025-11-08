'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import React from 'react'
import { DollarSign, FileText } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import { expenseSchema } from '@/lib/validations'
import { useFormContext } from 'react-hook-form'

const ExpenseForm = ({ expense = null }) => {

   const { handleConfirm } = useDialogStore();

   const defaultValues = {
      ...(expense?.id && { id: expense.id }),
      category: expense?.category || '',
      title: expense?.title || '',
      amount: expense?.amount || '',
      expenseDate: expense?.expenseDate || '',
      paymentMethod: expense?.paymentMethod || '',
      paymentDate: expense?.paymentDate || '',
      vendor: expense?.vendor || '',
      invoiceNumber: expense?.invoiceNumber || '',
      receiptNumber: expense?.receiptNumber || '',
      checkNumber: expense?.checkNumber || '',
      transactionRef: expense?.transactionRef || '',
      status: expense?.status || 'pending',
      notes: expense?.notes || '',
   }

   const handleSubmit = async (expenseData) => {
      handleConfirm(expenseData);
   }

   return (
      <NForm id='expense-form' schema={expenseSchema} defaultValues={defaultValues} onSubmit={handleSubmit} >
         <ExpenseFormContent  isEditing={!!expense} />
      </NForm>
   )
}

const ExpenseFormContent = ({isEditing = false }) => {

   const { t } = useTranslation();

   const expenseCategoryOptions = [
      { value: 'salary', label: t('expenses.categories.salary') },
      { value: 'utilities', label: t('expenses.categories.utilities') },
      { value: 'maintenance', label: t('expenses.categories.maintenance') },
      { value: 'supplies', label: t('expenses.categories.supplies') },
      { value: 'equipment', label: t('expenses.categories.equipment') },
      { value: 'transport', label: t('expenses.categories.transport') },
      { value: 'food', label: t('expenses.categories.food') },
      { value: 'security', label: t('expenses.categories.security') },
      { value: 'cleaning', label: t('expenses.categories.cleaning') },
      { value: 'insurance', label: t('expenses.categories.insurance') },
      { value: 'rent', label: t('expenses.categories.rent') },
      { value: 'tax', label: t('expenses.categories.tax') },
      { value: 'marketing', label: t('expenses.categories.marketing') },
      { value: 'training', label: t('expenses.categories.training') },
      { value: 'technology', label: t('expenses.categories.technology') },
      { value: 'miscellaneous', label: t('expenses.categories.miscellaneous') },
   ]

   const paymentMethodOptions = [
      { value: 'cash', label: t('expenses.paymentMethods.cash') },
      { value: 'bank_transfer', label: t('expenses.paymentMethods.bankTransfer') },
      { value: 'check', label: t('expenses.paymentMethods.check') },
      { value: 'credit_card', label: t('expenses.paymentMethods.creditCard') },
      { value: 'debit_card', label: t('expenses.paymentMethods.debitCard') },
      { value: 'online', label: t('expenses.paymentMethods.online') },
      { value: 'mobile_payment', label: t('expenses.paymentMethods.mobilePayment') },
   ]

   const statusOptions = [
      { value: 'pending', label: t('expenses.statuses.pending') },
      { value: 'approved', label: t('expenses.statuses.approved') },
      { value: 'paid', label: t('expenses.statuses.paid') },
      { value: 'rejected', label: t('expenses.statuses.rejected') },
      { value: 'cancelled', label: t('expenses.statuses.cancelled') },
   ]

   const { watch } = useFormContext()
   const paymentMethod = watch('paymentMethod')

   return (
      <div className='space-y-2'>

         <FormSectionHeader
            icon={DollarSign}
            title={t('expenses.form.basicInformation')}
         />

         <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <FormInput
               name='category'
               type='select'
               formLabel={t('expenses.form.category')}
               items={expenseCategoryOptions}
               required={true}
            />

            <FormInput
               name='title'
               type='text'
               formLabel={t('expenses.form.title')}
               placeholder={t('expenses.form.titlePlaceholder')}
               required={true}
            />

            <FormInput
               name='amount'
               type='number'
               formLabel={t('expenses.form.amount')}
               placeholder={t('expenses.form.amountPlaceholder')}
               required={true}
            />

            <FormInput
               name='vendor'
               type='text'
               formLabel={t('expenses.form.vendor')}
               placeholder={t('expenses.form.vendorPlaceholder')}
            />

            <FormInput
               name='expenseDate'
               type='date'
               formLabel={t('expenses.form.expenseDate')}
               required={true}
            />
         </div>

         <FormSectionHeader
            icon={FileText}
            title={t('expenses.form.paymentInformation')}
         />

         <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <FormInput
               name='paymentMethod'
               type='select'
               formLabel={t('expenses.form.paymentMethod')}
               items={paymentMethodOptions}
            />

            <FormInput
               name='paymentDate'
               type='date'
               formLabel={t('expenses.form.paymentDate')}
            />
   
            <FormInput
               name='invoiceNumber'
               type='text'
               formLabel={t('expenses.form.invoiceNumber')}
               placeholder={t('expenses.form.invoiceNumberPlaceholder')}
            />

            <FormInput
               name='receiptNumber'
               type='text'
               formLabel={t('expenses.form.receiptNumber')}
               placeholder={t('expenses.form.receiptNumberPlaceholder')}
            />

            {paymentMethod === 'check' && (
               <FormInput
                  name='checkNumber'
                  type='text'
                  formLabel={t('expenses.form.checkNumber')}
                  placeholder={t('expenses.form.checkNumberPlaceholder')}
               />
            )}

            <FormInput
               name='transactionRef'
               type='text'
               formLabel={t('expenses.form.transactionRef')}
               placeholder={t('expenses.form.transactionRefPlaceholder')}
            />

            {isEditing && (
               <FormInput
                  name='status'
                  type='select'
                  formLabel={t('expenses.form.status')}
                  items={statusOptions}
               />
            )}

            <FormInput
               name='notes'
               type='textarea'
               formLabel={t('expenses.form.notes')}
               placeholder={t('expenses.form.notesPlaceholder')}
            />
         </div>
      </div>
   )
}

export default ExpenseForm