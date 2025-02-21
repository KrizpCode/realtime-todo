import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import { LoginDto, RegisterDto } from '../schemas/authSchema'
import { TypedRequestBody } from '../types/request'
import {
  createUser,
  getUserByEmail,
  getUserById
} from '../services/userService'
import {
  generateAuthToken,
  generateRefreshToken
} from '../helpers/tokenHelpers'

export const register = async (
  req: TypedRequestBody<RegisterDto>,
  res: Response
) => {
  const { email, password, name } = req.body

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    res.status(400).json({ message: 'Email already in use' })
    return
  }

  await createUser(email, password, name)

  // Should register also log the user in?

  res.status(201).json({ message: 'User registered successfully' })
}

export const login = async (req: TypedRequestBody<LoginDto>, res: Response) => {
  const { email: loginEmail, password } = req.body

  const user = await getUserByEmail(loginEmail)
  const passwordMatch = user && (await bcrypt.compare(password, user.password))

  if (!user || !passwordMatch) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const { id: userId, email, name } = user

  const authToken = generateAuthToken(userId)
  const refreshToken = generateRefreshToken(userId)

  res.cookie('authToken', authToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 30
  })

  res
    .status(200)
    .json({ message: 'Login successful', user: { userId, email, name } })
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('authToken')
  res.clearCookie('refreshToken')
  res.status(200).json({ message: 'Logged out successfully' })
}

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  const userId = req.userId

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const user = await getUserById(userId)

  if (!user) {
    res.status(401).json({ message: 'User not found' })
    return
  }

  res
    .status(200)
    .json({ user: { userId: user.id, email: user.email, name: user.name } })
}
