'use client'

import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@/services/authApi';
import { toast } from "sonner";
import { ApiError } from './types';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/AuthStore';

export const useLogin = () => {
  const { updateAuth, setIsLoading } = useAuthStore();

  const router = useRouter()

  const mutation = useMutation({
    mutationFn: (credentials) => loginApi(credentials),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (response) => {
      const { data, status, message } = response;

      toast.success('Login successful', {
        position: 'top-right',
        duration: 1000
      });

      updateAuth({
        accessToken: data.accessToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
        isAuthenticated: true,
        status,
        message,
        isLoading: false
      });

      router.push('/')
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message ;
      const errorStatus = error?.response?.status ;

      updateAuth({
        isAuthenticated: false,
        status: errorStatus,
        message: errorMessage,
        isLoading: false
      });

      toast.error(errorMessage);
    }
  });

  const login = async (credentials) => {
    const result = await mutation.mutateAsync(credentials);
    return {
      success: true,
      data: result.data
    };
  };

  return {
    login,
    isLoading: mutation.isPending
  };
};