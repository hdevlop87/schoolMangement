import { api, formApi } from './http'

//=====================================================================//
// GET ENDPOINTS
//=====================================================================//

export const getParentsApi = async () => {
  const res = await api.get('/parents')
  return res.data
}

export const getParentByIdApi = async (id: string) => {
  const res = await api.get(`/parents/${id}`)
  return res.data
}

export const getParentByEmailApi = async (email: string) => {
  const res = await api.get(`/parents/email/${email}`)
  return res.data
}

export const getParentByCinApi = async (cin: string) => {
  const res = await api.get(`/parents/cin/${cin}`)
  return res.data
}

export const getParentByPhoneApi = async (phone: string) => {
  const res = await api.get(`/parents/phone/${phone}`)
  return res.data
}

export const searchParentsApi = async (query: string) => {
  const res = await api.get(`/parents/search?q=${query}`)
  return res.data
}

export const getParentChildrenApi = async (parentId: string) => {
  const res = await api.get(`/parents/${parentId}/children`)
  return res.data
}

//=====================================================================//
// POST ENDPOINTS (CREATE)
//=====================================================================//

export const createParentApi = async (data: any) => {
  // Use formApi to handle file uploads if image is present
  const res = await formApi.post('/parents', data)
  return res.data
}

export const linkStudentApi = async (parentId: string, studentId: string) => {
  const res = await api.post(`/parents/${parentId}/link-student`, { studentId })
  return res.data
}

//=====================================================================//
// PUT ENDPOINTS (UPDATE)
//=====================================================================//

export const updateParentApi = async (data: any) => {
  const { id, ...updateData } = data

  // Use formApi to handle file uploads if image is present
  const res = await formApi.put(`/parents/${id}`, updateData)
  return res.data
}

//=====================================================================//
// DELETE ENDPOINTS
//=====================================================================//

export const deleteParentApi = async (id: string) => {
  const res = await api.delete(`/parents/${id}`)
  return res.data
}

export const unlinkStudentApi = async (parentId: string, studentId: string) => {
  const res = await api.delete(`/parents/${parentId}/unlink-student/${studentId}`)
  return res.data
}

export const deleteAllParentsApi = async () => {
  const res = await api.delete('/parents')
  return res.data
}
