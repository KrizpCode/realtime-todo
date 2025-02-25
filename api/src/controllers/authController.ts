import { NextFunction, Request, Response } from 'express'

import { LoginDto, RegisterDto } from '../schemas/authSchemas'
import { TypedRequest } from '../types/request'
import {
  createUser,
  getUserByEmail,
  getUserById,
  loginUser
} from '../services/userService'
import {
  generateAuthToken,
  generateRefreshToken
} from '../helpers/tokenHelpers'
import { setAuthCookies } from '../helpers/setAuthCookies'

const isProduction = process.env.NODE_ENV === 'production'
const domain = isProduction ? '.taskmate.fun' : undefined

export const register = async (
  req: TypedRequest<RegisterDto>,
  res: Response
) => {
  const { email: registerEmail, password, name: registerName } = req.body

  const existingUser = await getUserByEmail(registerEmail)

  if (existingUser) {
    res.status(400).json({ message: 'Email already in use' })
    return
  }

  const newUser = await createUser(registerEmail, password, registerName)

  if (!newUser) {
    res.status(500).json({ message: 'Failed to register user' })
    return
  }

  const { id: userId, email, name } = newUser

  const authToken = generateAuthToken(userId)
  const refreshToken = generateRefreshToken(userId)

  res.cookie('authToken', authToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
    domain,
    maxAge: 1000 * 60 * 15
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
    domain,
    maxAge: 1000 * 60 * 60 * 24 * 30
  })

  res.status(201).json({
    message: 'User registered successfully',
    user: { userId, email, name }
  })
}

export const login = async (
  req: TypedRequest<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    const { user, authToken, refreshToken } = await loginUser(email, password)

    setAuthCookies(res, authToken, refreshToken)

    res.status(200).json({
      message: 'Login successful',
      user: { userId: user.id, email: user.email, name: user.name }
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
    domain,
    path: '/'
  })

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
    domain,
    path: '/'
  })

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
