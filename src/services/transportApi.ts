import { api, formApi } from './http'

//=====================================================================//
// GET ENDPOINTS
//=====================================================================//

export const getBusesApi = async () => {
  const res = await api.get('/transport/buses')
  return res.data
}

export const getBusByIdApi = async (id: string) => {
  const res = await api.get(`/transport/buses/${id}`)
  return res.data
}

export const getRoutesApi = async () => {
  const res = await api.get('/transport/routes')
  return res.data
}

export const getRouteByIdApi = async (id: string) => {
  const res = await api.get(`/transport/routes/${id}`)
  return res.data
}

export const getBusStudentsApi = async (busId: string) => {
  const res = await api.get(`/transport/buses/${busId}/students`)
  return res.data
}

//=====================================================================//
// POST ENDPOINTS (CREATE)
//=====================================================================//

export const createBusApi = async (data: any) => {
  const res = await api.post('/transport/buses', data)
  return res.data
}

export const createRouteApi = async (data: any) => {
  const res = await api.post('/transport/routes', data)
  return res.data
}

export const assignStudentToBusApi = async (busId: string, studentId: string) => {
  const res = await api.post(`/transport/buses/${busId}/assign`, { studentId })
  return res.data
}

//=====================================================================//
// PUT ENDPOINTS (UPDATE)
//=====================================================================//

export const updateBusApi = async (data: any) => {
  const { id, ...updateData } = data
  const res = await api.put(`/transport/buses/${id}`, updateData)
  return res.data
}

export const updateRouteApi = async (data: any) => {
  const { id, ...updateData } = data
  const res = await api.put(`/transport/routes/${id}`, updateData)
  return res.data
}

//=====================================================================//
// DELETE ENDPOINTS
//=====================================================================//

export const deleteBusApi = async (id: string) => {
  const res = await api.delete(`/transport/buses/${id}`)
  return res.data
}

export const deleteRouteApi = async (id: string) => {
  const res = await api.delete(`/transport/routes/${id}`)
  return res.data
}

export const unassignStudentFromBusApi = async (busId: string, studentId: string) => {
  const res = await api.delete(`/transport/buses/${busId}/unassign/${studentId}`)
  return res.data
}

export const deleteAllBusesApi = async () => {
  const res = await api.delete('/transport/buses')
  return res.data
}
