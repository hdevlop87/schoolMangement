import { api } from './http';

export const seedDemoApi = async () => {
  const res = await api.post('/seed/demo', {}, {
    headers: {
      'seed_api_key': process.env.NEXT_PUBLIC_SEED_API_KEY || ''
    }
  });
  return res.data;
};

export const seedSystemApi = async () => {
  const res = await api.post('/seed/system', {}, {
    headers: {
      'seed_api_key': process.env.NEXT_PUBLIC_SEED_API_KEY || ''
    }
  });
  return res.data;
};

export const clearAllDataApi = async () => {
  const res = await api.post('/seed/clear', {});
  return res.data;
};