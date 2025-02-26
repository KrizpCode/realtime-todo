import { createContext } from 'react'

import { LoginFormData } from '../components/LoginForm/schema'
import { RegisterFormData } from '../components/RegisterForm/schema'
import { User } from '../types/user'

export interface AuthContextType {
  isAuthenticated?: boolean
  user: User | null
  login: (
    data: LoginFormData
  ) => Promise<{ success: boolean; message?: string }>
  register: (
    data: RegisterFormData
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {
    throw new Error('AuthProvider is not initialized')
  },
  register: async () => {
    throw new Error('AuthProvider is not initialized')
  },
  logout: async () => {
    throw new Error('AuthProvider is not initialized')
  }
})
