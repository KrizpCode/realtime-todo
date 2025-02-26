import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'

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
import { ApiError } from '../services/apiClient'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const search = useSearch({ strict: false })
  const { auth } = router.options.context

  const [user, setUser] = useState<User | null>(auth.user)
  const isAuthenticated = !!user

  useEffect(() => {
    if (JSON.stringify(auth.user) !== JSON.stringify(user)) {
      setUser(auth.user)
    }
  }, [auth.user, user])

  const syncAuthState = useCallback(
    (user: User | null) => {
      setUser(user)
      auth.user = user
      auth.isAuthenticated = !!user
    },
    [auth]
  )

  const register = useCallback(
    async (data: RegisterFormData) => {
      try {
        const userData = await registerUser(data)
        syncAuthState(userData.user)

        await router.navigate({ to: '/dashboard' })

        return { success: true }
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : 'An unexpected error occurred'

        return {
          success: false,
          message
        }
      }
    },
    [syncAuthState, router]
  )

  const login = useCallback(
    async (data: LoginFormData) => {
      try {
        const userData = await loginUser(data)
        syncAuthState(userData.user)

        await router.navigate({ to: search.redirect || '/dashboard' })

        return { success: true }
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : 'An unexpected error occurred'

        return {
          success: false,
          message
        }
      }
    },
    [syncAuthState, router, search.redirect]
  )

  const logout = useCallback(async () => {
    try {
      await logoutUser()
      syncAuthState(null)
      await router.navigate({ to: '/login' })
    } catch (error) {
      console.error('Logout failed', error)
      // TODO: Display error message to user
    }
  }, [syncAuthState, router])

  const refreshUser = useCallback(async () => {
    try {
      const userData = await fetchUser()
      syncAuthState(userData)
    } catch {
      syncAuthState(null)
      await router.navigate({ to: '/login' })
      // TODO: Display error message to user
    }
  }, [syncAuthState, router])

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(
      () => {
        refreshUser()
      },
      1000 * 60 * 1
    )

    return () => clearInterval(interval)
  }, [isAuthenticated, refreshUser])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
