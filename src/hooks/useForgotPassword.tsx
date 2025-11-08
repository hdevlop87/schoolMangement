// src/hooks/useForgotPassword.ts
'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from './types'
import { useRouter } from 'next/navigation'
import { forgotPasswordApi } from '@/services/authApi'

export const useForgotPassword = () => {
    const router = useRouter()

    const mutation = useMutation({
        mutationFn: (credentials: { email: string }) => forgotPasswordApi(credentials),
        onSuccess: (response) => {
            toast.success(response.message || 'Password reset link sent to your email')
            router.push('/login')
        },
        onError: (error: ApiError) => {
            const errorMessage = error?.response?.data?.message || 'Failed to send reset email'
            toast.error(errorMessage)
        }
    })

    const forgotPassword = async (credentials: { email: string }) => {
        return await mutation.mutateAsync(credentials)
    }

    return {
        forgotPassword,
        isLoading: mutation.isPending
    }
}