import { api } from './http';

// ========================= FEE ENDPOINTS =========================

export const getFeesApi = async () => {
  const res = await api.get('/fees');
  return res.data;
};

export const getFeeByIdApi = async (id: string) => {
  const res = await api.get(`/fees/${id}`);
  return res.data;
};

export const getFeesByStudentApi = async (studentId: string) => {
  const res = await api.get(`/fees/student/${studentId}`);
  return res.data;
};

export const getSchedulesByFeeApi = async (feeId: string) => {
  const res = await api.get(`/fees/schedules/fee/${feeId}`);
  return res.data;
};

export const getPaymentsByFeeApi = async (feeId: string) => {
  const res = await api.get(`/fees/payments/fee/${feeId}`);
  return res.data;
};

export const getPaymentsByStudentApi = async (studentId: string) => {
  const res = await api.get(`/fees/payments/student/${studentId}`);
  return res.data;
};

export const getAllPaymentsApi = async () => {
  const res = await api.get('/fees/payments');
  return res.data;
};

export const createFeeApi = async (data: any) => {
  const res = await api.post('/fees', data);
  return res.data;
};

export const createBulkFeesApi = async (data: any) => {
  const res = await api.post('/fees/bulk', data);
  return res.data;
};

export const updateFeeApi = async (data: any) => {
  const res = await api.put(`/fees/${data.id}`, data);
  return res.data;
};

export const deleteFeeApi = async (id: string) => {
  const res = await api.delete(`/fees/${id}`);
  return res.data;
};

export const deleteAllFeesApi = async () => {
  const res = await api.delete('/fees');
  return res.data;
};

// ========================= PAYMENT ENDPOINTS =========================

export const recordPaymentApi = async (data: any) => {
  const res = await api.post('/fees/payments', data);
  return res.data;
};

export const updatePaymentApi = async (data: any) => {
  const res = await api.put(`/fees/payments/${data.id}`, data);
  return res.data;
};

export const deletePaymentApi = async (id: string) => {
  const res = await api.delete(`/fees/payments/${id}`);
  return res.data;
};
