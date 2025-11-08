'use client'

import { useMutation } from '@tanstack/react-query';
import useAuthStore from '@/stores/AuthStore';
import { registerApi } from '@/services/authApi';
import { toast } from "sonner";
import { ApiError } from './types';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
   const { updateAuth, setIsLoading } = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (userData) => registerApi(userData),
    onMutate: () => {
      updateAuth({ isLoading: true });
    },
    onSuccess: (response) => {
      const { data, status, message } = response;

      updateAuth({
        accessToken: data.accessToken,
        accessTokenExpiresAt: data.accessTokenExpiresAt,
        refreshTokenExpiresAt: data.refreshTokenExpiresAt,
        isAuthenticated: true,
        status,
        message,
        isLoading: false,
        user: data.user // Assuming the response includes user data
      });

      router.push('/login');
      toast.success('Registration successful!');
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || 'Registration failed';
      const errorStatus = error?.response?.status || 500;

      updateAuth({
        isAuthenticated: false,
        status: errorStatus,
        message: errorMessage,
        isLoading: false
      });

      toast.error(errorMessage);
    }
  });

  const register = async (userData) => {
    try {
      const result = await mutation.mutateAsync(userData);
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error as ApiError
      };
    }
  };

  return {
    register,
    isLoading: mutation.isPending
  };
};