import api from './api'

export const getDesignations = (params) => api.get('/designations', { params }).then((r) => r.data)
export const createDesignation = (data) => api.post('/designations', data).then((r) => r.data)
export const updateDesignation = (id, data) => api.put(`/designations/${id}`, data).then((r) => r.data)
export const deleteDesignation = (id) => api.delete(`/designations/${id}`).then((r) => r.data)
