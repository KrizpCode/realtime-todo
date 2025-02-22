import { createContext } from 'react'

import { LoginFormData } from '../components/LoginForm/schema'
import { RegisterFormData } from '../components/RegisterForm/schema'
import { User } from '../types/user'

export interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (data: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)
