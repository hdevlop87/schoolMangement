// In your api.js file:
import axios from 'axios';
import { refreshApi } from './authApi';
import { hasFiles } from './fileApi';

export const api = axios.create({
   baseURL: '/api',
   headers: {
      'Content-Type': 'application/json'
   },
   withCredentials: true
});

export const authApi = axios.create({
   baseURL: '/api',
   headers: {
      'Content-Type': 'application/json'
   },
   withCredentials: true
});

export const setupInterceptors = (authMethods) => {
   api.interceptors.request.use(
      (config) => {
         const token = authMethods.getAccessToken();
         if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
         }
         return config;
      },
      (error) => {
         return Promise.reject(error);
      }
   );

   api.interceptors.response.use(
      (response) => response,
      async (error) => {
         const originalRequest = error.config;

         if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
               const refreshResponse = await refreshApi();

               authMethods.updateAuth({
                  accessToken: refreshResponse.data.accessToken,
                  accessTokenExpiresAt: refreshResponse.data.accessTokenExpiresAt,
                  refreshTokenExpiresAt: refreshResponse.data.refreshTokenExpiresAt
               });

               originalRequest.headers['Authorization'] =
                  `Bearer ${refreshResponse.data.accessToken}`;
               return api(originalRequest);
            } catch (refreshError) {
               authMethods.resetAuth();
               return Promise.reject(refreshError);
            }
         }

         return Promise.reject(error);
      }
   );
};

const createFormRequest = (method: 'post' | 'put') => 
    async (endpoint: string, data: any) => {
        if (hasFiles(data)) {
            const formData = new FormData();
            for (const key in data) {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            }
            return await api[method](endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return await api[method](endpoint, data);
    };

export const formApi = {
    post: createFormRequest('post'),
    put: createFormRequest('put')
};