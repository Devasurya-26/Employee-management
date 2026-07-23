import api from './api'

export const login = (username, password) =>
  api.post('/auth/login', { username, password }).then((res) => res.data)

export const register = (payload) =>
  api.post('/auth/register', payload).then((res) => res.data)
