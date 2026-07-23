import api from './api'

export const getEmployeeAttendance = (employeeId, params) =>
  api.get(`/attendance/employee/${employeeId}`, { params }).then((r) => r.data)
export const checkIn = () => api.post('/attendance/check-in').then((r) => r.data)
export const checkOut = () => api.post('/attendance/check-out').then((r) => r.data)
