import { updateUserLangApi } from '@/services/userApi';
import useAuthStore from '@/stores/AuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import translations from '@/locales';
import { toast } from 'sonner';

const getNestedValue = (obj, path) => {
   return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const useTranslation = () => {
   const language = useAuthStore((state) => state.language);

   const t = (key, params = null) => {
      const langTranslations = translations[language] || translations['en'];
      let translation = getNestedValue(langTranslations, key) || key;

      if (params && typeof translation === 'string') {
         Object.entries(params).forEach(([param, value]) => {
            translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
         });
      }

      return translation;
   };

   return { t, language };
};

export const useUpdateLang = () => {
   const queryClient = useQueryClient();
   const setLanguage = useAuthStore((state) => state.setLanguage);

   const mutation = useMutation({
      mutationFn: (language) => updateUserLangApi({ language }),
      onSuccess: (resp) => {
         setLanguage(resp.data);
         queryClient.invalidateQueries({ queryKey: ['user', 'language'] });
         toast.success(resp.message);
      },
      onError: (error) => {
         toast.error('Failed to update language');
      },
   });

   return {
      updateLang: mutation.mutateAsync,
      isLoading: mutation.isPending,
      isError: mutation.isError,
      error: mutation.error,
      isSuccess: mutation.isSuccess,
   };
};