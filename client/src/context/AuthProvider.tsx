import { useCallback, useEffect, useState } from 'react'

import { AuthContext } from './AuthContext'
import { fetchUser, loginUser, logoutUser } from '../services/authService'

interface AuthProviderProps {
  children: React.ReactNode
}

export interface User {
  userId: number
  email: string
  name: string
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

  const login = useCallback(async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password)

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
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
