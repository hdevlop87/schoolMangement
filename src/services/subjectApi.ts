import { api } from './http';

export const getSubjectsApi = async () => {
  const res = await api.get('/subjects');
  return res.data;
};

export const getSubjectByIdApi = async (id: string) => {
  const res = await api.get(`/subjects/${id}`);
  return res.data;
};

export const getSubjectByCodeApi = async (code: string) => {
  const res = await api.get(`/subjects/code/${code}`);
  return res.data;
};

export const getSubjectByNameApi = async (name: string) => {
  const res = await api.get(`/subjects/name/${name}`);
  return res.data;
};

export const createSubjectApi = async (data: any) => {
  const res = await api.post('/subjects', data);
  return res.data;
};

export const updateSubjectApi = async (data) => {
  const res = await api.put(`/subjects/${data.id}`, data);
  return res.data;
};

export const deleteSubjectApi = async (id: string) => {
  const res = await api.delete(`/subjects/${id}`);
  return res.data;
};
