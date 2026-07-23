import api from './api'

export const getEmployees = (params) => api.get('/employees', { params }).then((r) => r.data)
export const getEmployee = (id) => api.get(`/employees/${id}`).then((r) => r.data)
export const createEmployee = (data) => api.post('/employees', data).then((r) => r.data)
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data).then((r) => r.data)
export const deleteEmployee = (id) => api.delete(`/employees/${id}`).then((r) => r.data)
export const uploadProfileImage = (id, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post(`/employees/${id}/profile-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}
export const getMyProfile = () => api.get('/employees/me').then((r) => r.data)
export const exportEmployeesExcel = async () => {
  const response = await api.get('/employees/export', { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'employees.xlsx')
  document.body.appendChild(link)
  link.click()
  link.remove()
}
