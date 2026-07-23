import api from './api'

export const getAllSalaries = (params) => api.get('/salaries', { params }).then((r) => r.data)
export const getMySalaries = (params) => api.get('/salaries/my', { params }).then((r) => r.data)
export const generateSalary = (data) => api.post('/salaries/generate', data).then((r) => r.data)
export const markSalaryPaid = (id) => api.put(`/salaries/${id}/mark-paid`).then((r) => r.data)
