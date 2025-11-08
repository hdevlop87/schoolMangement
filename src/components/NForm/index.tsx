'use client'

import { Form } from '@/components/ui/form';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { useFormFiller } from './useFormFiller';
import { useEffect } from 'react';

const NForm = ({
  schema,
  defaultValues,
  onSubmit = null,
  className = '',
  id,
  children,
}) => {

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  useFormFiller(form, id);

  useEffect(() => {
    if (form.formState.errors) {
      console.log('🔴 Root Form Error:', form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col h-full w-full gap-2', className)}
        autoComplete="off"
      >
        {children}
      </form>
    </Form>
  );
};

export default NForm;