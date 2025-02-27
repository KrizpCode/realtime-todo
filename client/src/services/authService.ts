import { LoginFormData } from '../components/LoginForm/schema'
import { RegisterFormData } from '../components/RegisterForm/schema'
import { User } from '../types/user'
import { apiClient } from './apiClient'

export const registerUser = async (data: RegisterFormData) => {
  return await apiClient.post<{ user: User; token: string }>(
    '/api/auth/register',
    data
  )
}

export const loginUser = async (data: LoginFormData) => {
  return await apiClient.post<{ user: User; token: string }>(
    '/api/auth/login',
    data
  )
}

export const logoutUser = async () => {
  await apiClient.post('/api/auth/logout')
}

export const fetchUser = async () => {
  return await apiClient.get<{ user: User; token: string }>('/api/auth/me')
}
