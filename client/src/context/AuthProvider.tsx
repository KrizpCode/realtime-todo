import { useCallback, useEffect, useState } from 'react'

import { AuthContext } from './AuthContext'
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser
} from '../services/authService'
import { User } from '../types/user'
import { LoginFormData } from '../components/LoginForm/schema'
import { RegisterFormData } from '../components/RegisterForm/schema'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchUser()

        setUser(userData)
      } catch {
        setUser(null)
      }
    }

    fetchUserData()
  }, [])

  const register = useCallback(async (data: RegisterFormData) => {
    try {
      const userData = await registerUser(data)

      setUser(userData)
    } catch (error) {
      console.error(error)
      // TODO: Display error message to user
    }
  }, [])

  const login = useCallback(async (data: LoginFormData) => {
    try {
      const userData = await loginUser(data)

      setUser(userData)
    } catch (error) {
      console.error(error)
      // TODO: Display error message to user
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout failed', error)
      // TODO: Display error message to user
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
