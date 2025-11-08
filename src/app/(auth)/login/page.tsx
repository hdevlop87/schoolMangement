'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import React from 'react'
import { Mail, Lock } from 'lucide-react'
import LoginButton from '@/components/NButtons/LoginButton'
import { z } from 'zod'
import { useLogin } from '@/hooks/useLogin'
import { Button } from '@/components/ui/button';
import { useForgotPasswordStore } from '@/stores/ForgotPasswordStore'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid mail address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean()
})

const Login = () => {
  const { login, isLoading } = useLogin();
  const { openDialog } = useForgotPasswordStore();

  const defaultValues = {
    email: 'admin@admin.com',
    password: '12345678',
    rememberMe: false
  }

  const handleLogin = async (credentials) => {
    await login(credentials);
  }

  const handleForgotPasswordClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    openDialog()
  }

  return (
    <div className='flex flex-col  justify-center items-center  p-8 w-full md:w-[500px]'>
      <span className='text-2xl my-5 md:text-3xl font-semibold'>Welcome To Academix!</span>
      <div className='flex flex-col h-full w-full gap-2 '>

        <NForm id='login-form' schema={loginSchema} defaultValues={defaultValues} onSubmit={handleLogin}>
          <FormInput
            name='email'
            type='text'
            formLabel='Email'
            placeholder='Enter your email'
            variant='default'
            icon={Mail}
          />

          <FormInput
            name='password'
            type='password'
            formLabel='Password'
            placeholder='Enter your password'
            variant='default'
            icon={Lock}

          />

          <div className="flex w-full justify-between">
            <FormInput
              name="rememberMe"
              type="checkbox"
              label="Keep me logged in"
              variant='ghost'
            />

            <Button
              variant="link"
              className=" text-sm text-tertiary hover:underline cursor-pointer mt-1 p-2 font-normal"
              onClick={handleForgotPasswordClick}
            >
              Forgot password?
            </Button>

          </div>
        </NForm>

        <LoginButton form='login-form' className='bg-primary  hover:bg-secondary cursor-pointer' loading={isLoading} />

      </div>
    </div>
  )
}

export default Login