import api from './api'

export const getAnnouncements = (params) => api.get('/announcements', { params }).then((r) => r.data)
export const createAnnouncement = (data) => api.post('/announcements', data).then((r) => r.data)
export const deleteAnnouncement = (id) => api.delete(`/announcements/${id}`).then((r) => r.data)
