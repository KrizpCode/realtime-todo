import { LoginFormData } from '../components/LoginForm/schema'
import { RegisterFormData } from '../components/RegisterForm/schema'
import { User } from '../types/user'
import { apiClient } from './apiClient'

export const registerUser = async (data: RegisterFormData) => {
  const response = await apiClient.post<{ user: User }>(
    '/api/auth/register',
    data
  )

  return response.user
}

export const loginUser = async (data: LoginFormData) => {
  const response = await apiClient.post<{ user: User }>('/api/auth/login', data)

  return response.user
}

export const logoutUser = async () => {
  await apiClient.post('/api/auth/logout')
}

export const fetchUser = async () => {
  const response = await apiClient.get<{ user: User }>('/api/auth/me')

  return response.user
}
