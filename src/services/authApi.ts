import {api, authApi} from './http';

export const loginApi = async(data) => {
    const res = await authApi.post('/auth/login',data)
    return res.data
}

export const registerApi = async(data) => {
    const res = await authApi.post('/auth/register',data)
    return res.data
}

export const logoutApi = async(id) => {
    const res = await authApi.get(`/auth/logout/${id}`)
    return res.data
}

export const refreshApi = async() => {
    const res = await authApi.get('/auth/refresh')
    return res.data
}

export const meApi = async (customToken = null) => {
  const config = customToken ? { 
    headers: { 'Authorization': `Bearer ${customToken}` } 
  } : {};
  
  const res = await authApi.get('/auth/me', config);
  return res.data;
}

export const forgotPasswordApi = async(data) => {
    const res = await authApi.post('/auth/forgot-password',data)
    return res.data
}