'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as settingApi from '@/services/settingApi';
import * as seedApi from '@/services/seedApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSettings = (enabled = true) => {
  const crud = useEntityCRUD('settings', {
    getAll: settingApi.getSettingsApi,
    getById: settingApi.getSettingByIdApi,
    delete: settingApi.deleteSettingApi,
  });

  const { data: settings, isLoading: isSettingsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: deleteSetting, isLoading: isDeleting } = crud.useDelete();

  return {
    settings,
    isSettingsLoading,
    isError,
    error,
    refetch,
    deleteSetting,
    isDeleting,
  };
};

// My Settings Management
export const useMySettings = (enabled = true) => {
  const { data: mySettings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['mySettings'],
    queryFn: settingApi.getMySettingsApi,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });

  return {
    mySettings,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMySettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.updateMySettingsApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      queryClient.invalidateQueries({ queryKey: ['myNotificationPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['mySecurityPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['mySystemPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['myAcademicPreferences'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useResetMySettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.resetMySettingsApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      queryClient.invalidateQueries({ queryKey: ['myNotificationPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['mySecurityPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['mySystemPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['myAcademicPreferences'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Language Preferences
export const useMyLanguage = (enabled = true) => {
  const { data: language, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['myLanguage'],
    queryFn: settingApi.getMyLanguageApi,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data?.language,
  });

  return {
    language,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMyLanguage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.updateMyLanguageApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['myLanguage'] });
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Theme Preferences
export const useMyTheme = (enabled = true) => {
  const { data: theme, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['myTheme'],
    queryFn: settingApi.getMyThemeApi,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data?.theme,
  });

  return {
    theme,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMyTheme = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.updateMyThemeApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['myTheme'] });
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Notification Preferences
export const useMyNotificationPreferences = (enabled = true) => {
  const { data: notificationPreferences, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['myNotificationPreferences'],
    queryFn: settingApi.getMyNotificationPreferencesApi,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });

  return {
    notificationPreferences,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMyNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.updateMyNotificationPreferencesApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['myNotificationPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Security Preferences
export const useMySecurityPreferences = (enabled = true) => {
  const { data: securityPreferences, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['mySecurityPreferences'],
    queryFn: settingApi.getMySecurityPreferencesApi,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });

  return {
    securityPreferences,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMySecurityPreferences = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.updateMySecurityPreferencesApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['mySecurityPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Academic Preferences
export const useMyAcademicPreferences = (enabled = true) => {
  const { data: academicPreferences, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['myAcademicPreferences'],
    queryFn: settingApi.getMyAcademicPreferencesApi,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });

  return {
    academicPreferences,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMyAcademicPreferences = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.updateMyAcademicPreferencesApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['myAcademicPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// School Settings (Admin only)
export const useMySchoolSettings = (enabled = true) => {
  const { data: schoolSettings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['mySchoolSettings'],
    queryFn: settingApi.getMySchoolSettingsApi,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });

  return {
    schoolSettings,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMySchoolSettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.updateMySchoolSettingsApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['mySchoolSettings'] });
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// System Preferences
export const useMySystemPreferences = (enabled = true) => {
  const { data: systemPreferences, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['mySystemPreferences'],
    queryFn: settingApi.getMySystemPreferencesApi,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (response) => response?.data,
  });

  return {
    systemPreferences,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useUpdateMySystemPreferences = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.updateMySystemPreferencesApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['mySystemPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Admin Operations
export const useDeleteAllSettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.deleteAllSettingsApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['mySettings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useSeedDemoSettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: settingApi.seedDemoSettingsApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(getError(error));
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Legacy seed operations for backward compatibility
export const useSeedDemo = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: seedApi.seedDemoApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries();
      toast.success(response?.message || 'Demo data seeded successfully', {
        description: 'The database has been populated with demo data.',
      });
    },
    onError: (error) => {
      toast.error('Failed to seed demo data', {
        description: getError(error),
      });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useSeedSystem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: seedApi.seedSystemApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(response?.message || 'System defaults seeded successfully', {
        description: 'System roles and admin user have been created.',
      });
    },
    onError: (error) => {
      toast.error('Failed to seed system defaults', {
        description: getError(error),
      });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export const useClearAllData = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: seedApi.clearAllDataApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries();
      toast.success(response?.message || 'All data cleared successfully', {
        description: 'The database has been cleared of all data.',
      });
    },
    onError: (error) => {
      toast.error('Failed to clear data', {
        description: getError(error),
      });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

const getError = (error: any) => {
  return error?.response?.data?.message || 'An unexpected error occurred';
};