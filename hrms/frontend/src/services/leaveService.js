import api from './api'

export const getAllLeaves = (params) => api.get('/leaves', { params }).then((r) => r.data)
export const getMyLeaves = (params) => api.get('/leaves/my', { params }).then((r) => r.data)
export const applyLeave = (data) => api.post('/leaves/apply', data).then((r) => r.data)
export const updateLeaveStatus = (id, status, remarks) =>
  api.put(`/leaves/${id}/status`, null, { params: { status, remarks } }).then((r) => r.data)
export const cancelLeave = (id) => api.delete(`/leaves/${id}`).then((r) => r.data)
