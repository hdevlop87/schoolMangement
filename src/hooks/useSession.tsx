'use client'

import { useRouter } from 'next/navigation';
import { meApi, refreshApi } from '@/services/authApi';
import useAuthStore from '@/stores/AuthStore';
import { useQuery } from '@tanstack/react-query';

export function useSession(redirectTo = '/login') {
  const { isAuthenticated, accessToken, updateAuth, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const sessionQuery = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        let userData;
        let tokenData = null;
        if (accessToken) {
          userData = await meApi(accessToken);
        }

        if (!userData) {
          const refreshResponse = await refreshApi();
          tokenData = {
            accessToken: refreshResponse.data.accessToken,
            accessTokenExpiresAt: refreshResponse.data.accessTokenExpiresAt,
            refreshTokenExpiresAt: refreshResponse.data.refreshTokenExpiresAt
          };
          userData = await meApi(tokenData.accessToken);
        }

        updateAuth({
          ...tokenData,
          user: userData.data,
          language: userData?.data.language,
          isAuthenticated: true,
          isLoading: false
        });

        return userData;
      } catch (error) {
        updateAuth({ isLoading: false });
        router.push(redirectTo);
        throw error;
      }
    },
    retry: false,
  });

  return {
    sessionLoading: sessionQuery.isPending || authLoading,
    isAuthenticated,
    error: sessionQuery.error,
    user: sessionQuery.data?.data
  };
}
