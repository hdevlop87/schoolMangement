'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '@/services/authApi';
import { toast } from "sonner";
import { ApiError } from './types';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/AuthStore';

export const useLogout = () => {
   const { resetAuth, updateAuth, setIsLoading, user } = useAuthStore();
   const router = useRouter();
   const queryClient = useQueryClient();
   const mutation = useMutation({
      mutationFn: () => logoutApi(user.id),
      onMutate: () => {
         setIsLoading(true);
      },
      onSuccess: (response) => {
         const { message } = response;

         toast.success(message || 'Logout successful', {
            position: 'top-right',
            duration: 1000
         });
         queryClient.clear();
         resetAuth();

         router.push('/login');
      },
      onError: (error: ApiError) => {
         const errorMessage = error?.response?.data?.message || 'Logout failed';
         const errorStatus = error?.response?.status;

         updateAuth({
            status: errorStatus,
            message: errorMessage,
            isLoading: false
         });

         toast.error(errorMessage);
      }
   });


   return {
      logout: mutation.mutateAsync,
      isLoading: mutation.isPending
   };
};