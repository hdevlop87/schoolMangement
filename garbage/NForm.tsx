'use client'

import { Form } from '@/components/ui/form';
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { FormGroupContext } from './FormGroup';
import { useEffect, useContext } from 'react';

const NForm = ({
  schema,
  defaultValues,
  onSubmit=null,
  className='',
  id,
  children,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Check if this form is inside a FormGroup (safe conditional usage)
  const formGroupContext = useContext(FormGroupContext);

  useEffect(() => {
    // If inside FormGroup and has an id, register this form
    if (formGroupContext && id) {
      const submitHandler = () => {
        return new Promise((resolve, reject) => {
          form.handleSubmit(
            (data) => {
              // Call the form's onSubmit if it exists
              if (onSubmit) {
                const result = onSubmit(data);
                if (result instanceof Promise) {
                  result.then(() => resolve(data)).catch(reject);
                } else {
                  resolve(data);
                }
              } else {
                resolve(data);
              }
            },
            (errors) => {
              reject(errors);
            }
          )();
        });
      };

      formGroupContext.registerForm(id, submitHandler);

      return () => {
        formGroupContext.unregisterForm(id);
      };
    }
  }, [formGroupContext, id, form, onSubmit]);

  // If inside FormGroup, don't render the form element (FormGroup handles it)
  if (formGroupContext && id) {
    return (
      <Form {...form}>
        <div className={cn('flex flex-col h-full w-full gap-4', className)}>
          {children}
        </div>
      </Form>
    );
  }

  // Standalone form
  return (
    <Form {...form}>
      <form id={id} onSubmit={form.handleSubmit(onSubmit)} className={cn('flex flex-col h-full w-full gap-4',className)} autoComplete="off">
        {children}
      </form>
    </Form>
  );
};

export default NForm;