import { api } from './http';

export const getWidgetsApi = async () => {
  const res = await api.get('/dashboard/widgets');
  return res.data;
};

export const getStudentsByGenderApi = async () => {
  const res = await api.get('/dashboard/students-by-gender');
  return res.data;
};

export const getDashboardsApi = async () => {
  const res = await api.get('/dashboards');
  return res.data;
};

export const getDashboardByIdApi = async (id: string) => {
  const res = await api.get(`/dashboards/${id}`);
  return res.data;
};

export const getVehicleCountApi = async () => {
  const res = await api.get('/vehicles/count');
  return res.data;
};

export const getOperatorCountApi = async () => {
  const res = await api.get('/operators/count');
  return res.data;
};

export const getFieldCountApi = async () => {
  const res = await api.get('/fields/count');
  return res.data;
};

export const getOperationCountApi = async () => {
  const res = await api.get('/operations/count');
  return res.data;
};

export const getTotalFarmAreaApi = async () => {
  const res = await api.get('/fields/total-area');
  return res.data;
};

export const getTodayOperationsApi = async () => {
  const res = await api.get('/operations/today');
  return res.data;
};

export const getFuelConsumptionSummaryApi = async () => {
  const res = await api.get('/dashboard/fuel/consumption-summary');
  return res.data;
};

export const getVehicleStatusDistributionApi = async () => {
  const res = await api.get('/dashboard/vehicles/status-distribution');
  return res.data;
};

export const getOperatorStatusDistributionApi = async () => {
  const res = await api.get('/dashboard/operators/status-distribution');
  return res.data;
};

export const getOperationStatusDistributionApi = async () => {
  const res = await api.get('/dashboard/operations/status-distribution');
  return res.data;
};

export const getIncomeApi = async () => {
  const res = await api.get('/subscription/income');
  return res.data;
};

export const getClientCountApi = async () => {
  const res = await api.get('/clients/count');
  return res.data;
};
