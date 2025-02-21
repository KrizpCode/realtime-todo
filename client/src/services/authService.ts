import { User } from '../context/AuthProvider'

export const loginUser = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Login failed')
  }

  return result.user as User
}

export const logoutUser = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  })
}

export const fetchUser = async () => {
  const response = await fetch('/api/auth/me', {
    credentials: 'include'
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch user')
  }

  return result.user as User
}
