import { api, formApi } from './http'

//=====================================================================//
// GET ENDPOINTS
//=====================================================================//

export const getTeachersApi = async () => {
  const res = await api.get('/teachers')
  return res.data
}

export const getTeacherByIdApi = async (id: string) => {
  const res = await api.get(`/teachers/${id}`)
  return res.data
}

export const getTeacherByEmailApi = async (email: string) => {
  const res = await api.get(`/teachers/email/${email}`)
  return res.data
}

export const getTeacherByCinApi = async (cin: string) => {
  const res = await api.get(`/teachers/cin/${cin}`)
  return res.data
}

export const getTeacherClassesApi = async (id: string) => {
  const res = await api.get(`/teachers/${id}/classes`)
  return res.data
}

export const getTeacherStudentsApi = async (id: string) => {
  const res = await api.get(`/teachers/${id}/students`)
  return res.data
}

//=====================================================================//
// POST ENDPOINTS (CREATE)
//=====================================================================//

export const createTeacherApi = async (data: any) => {
  // Use formApi to handle file uploads if image is present
  const res = await formApi.post('/teachers', data)
  return res.data
}

//=====================================================================//
// PUT ENDPOINTS (UPDATE)
//=====================================================================//

export const updateTeacherApi = async (data: any) => {
  const { id, ...updateData } = data

  // Use formApi to handle file uploads if image is present
  const res = await formApi.put(`/teachers/${id}`, updateData)
  return res.data
}

//=====================================================================//
// DELETE ENDPOINTS
//=====================================================================//

export const deleteTeacherApi = async (id: string) => {
  const res = await api.delete(`/teachers/${id}`)
  return res.data
}

export const deleteAllTeachersApi = async () => {
  const res = await api.delete('/teachers')
  return res.data
}
