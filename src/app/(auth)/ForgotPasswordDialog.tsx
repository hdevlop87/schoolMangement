// src/components/auth/ForgotPasswordDialog.tsx
'use client'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import { z } from 'zod'
import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import Link from 'next/link'
import { useForgotPassword } from '@/hooks/useForgotPassword'
import { useForgotPasswordStore } from '@/stores/ForgotPasswordStore'

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
})

export function ForgotPasswordDialog() {
    const { forgotPassword, isLoading } = useForgotPassword()
    const { isOpen, openDialog, closeDialog } = useForgotPasswordStore()

    const handleForgotPassword = async ({ email }: { email: string }) => {
        await forgotPassword({ email })
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => open ? openDialog() : closeDialog()}>
            <DialogContent className="sm:w-[400px] bg-[url(/images/bgintro.png)] bg-center">
                <DialogTitle className='text-center mb-4'>
                    <span className='text-2xl pb-4 pt-4 text-black [text-shadow:_-1px_-1px_0_white,_1px_-1px_0_white,_-1px_1px_0_white,_1px_1px_0_white] '>Password recovery</span>
                </DialogTitle>
                <NForm
                    id="forgot-password-form"
                    schema={forgotPasswordSchema}
                    onSubmit={handleForgotPassword}
                    defaultValues={{ email: '' }}
                >
                    <FormInput
                        name="email"
                        type="text"
                        formLabel="Email"
                        placeholder="Enter your email"
                        variant="default"
                        icon={Mail}
                        iconColor="black"
                        className="bg-white hover:border-black mb-2 text-black"
                    />
                </NForm>

                <Button 
                    form='forgot-password-form'
                    type="submit" 
                    className="w-full bg-black hover:bg-secondary text-white cursor-pointer mb-2" 
                    disabled={isLoading} 
                    onClick={(e) => e.stopPropagation()}
                    >{isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <Label className='flex w-full text-center text-black'>
                    You don't have an account? <Link href="/register" className='text-white hover:underline ml-1'>Sign Up</Link>
                </Label>
            </DialogContent>
        </Dialog>
    )
}