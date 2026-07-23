import api from './api'

export const getDepartments = (params) => api.get('/departments', { params }).then((r) => r.data)
export const createDepartment = (data) => api.post('/departments', data).then((r) => r.data)
export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data).then((r) => r.data)
export const deleteDepartment = (id) => api.delete(`/departments/${id}`).then((r) => r.data)
