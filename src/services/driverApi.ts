import { api, formApi } from './http'

//=====================================================================//
// GET ENDPOINTS
//=====================================================================//

export const getDriversApi = async () => {
  const res = await api.get('/drivers')
  return res.data
}

export const getDriverByIdApi = async (id: string) => {
  const res = await api.get(`/drivers/${id}`)
  return res.data
}

export const getDriverByCinApi = async (cin: string) => {
  const res = await api.get(`/drivers/cin/${cin}`)
  return res.data
}

export const getDriverByLicenseApi = async (licenseNumber: string) => {
  const res = await api.get(`/drivers/license/${licenseNumber}`)
  return res.data
}

export const getActiveDriversApi = async () => {
  const res = await api.get('/drivers/active')
  return res.data
}

export const getInactiveDriversApi = async () => {
  const res = await api.get('/drivers/inactive')
  return res.data
}

export const getSuspendedDriversApi = async () => {
  const res = await api.get('/drivers/suspended')
  return res.data
}

export const getLicenseExpiringDriversApi = async () => {
  const res = await api.get('/drivers/license-expiring')
  return res.data
}

export const getDriverVehiclesApi = async (id: string) => {
  const res = await api.get(`/drivers/${id}/vehicles`)
  return res.data
}

export const getDriversCountApi = async () => {
  const res = await api.get('/drivers/count')
  return res.data
}

//=====================================================================//
// POST ENDPOINTS (CREATE)
//=====================================================================//

export const createDriverApi = async (data: any) => {
  // Use formApi to handle file uploads if image is present
  const res = await formApi.post('/drivers', data)
  return res.data
}

//=====================================================================//
// PUT ENDPOINTS (UPDATE)
//=====================================================================//

export const updateDriverApi = async (data: any) => {
  const { id, ...updateData } = data

  // Use formApi to handle file uploads if image is present
  const res = await formApi.put(`/drivers/${id}`, updateData)
  return res.data
}

export const updateDriverStatusApi = async (id: string, status: string) => {
  const res = await api.put(`/drivers/${id}/status`, { status })
  return res.data
}

//=====================================================================//
// DELETE ENDPOINTS
//=====================================================================//

export const deleteDriverApi = async (id: string) => {
  const res = await api.delete(`/drivers/${id}`)
  return res.data
}

export const deleteAllDriversApi = async () => {
  const res = await api.delete('/drivers')
  return res.data
}