import { NextFunction, Request, Response } from 'express'

import { LoginDto, RegisterDto } from '../schemas/authSchemas'
import { TypedRequest } from '../types/request'
import { getMe, loginUser, registerUser } from '../services/userService'

import {
  clearAuthCookie,
  setAuthCookie,
  setBearerToken
} from '../helpers/authHelpers'
import { AuthenticationError } from '../errors/AuthenticationError'
import { generateAuthToken } from '../helpers/tokenHelpers'

export const register = async (
  req: TypedRequest<RegisterDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body

    const { user, authToken, refreshToken } = await registerUser(
      email,
      password,
      name
    )

    setAuthCookie(res, refreshToken)
    setBearerToken(res, authToken)

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, email: user.email, name: user.name },
      token: authToken
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: TypedRequest<LoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    const { user, authToken, refreshToken } = await loginUser(email, password)

    setAuthCookie(res, refreshToken)
    setBearerToken(res, authToken)

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
      token: authToken
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (_req: Request, res: Response) => {
  clearAuthCookie(res)

  res.setHeader('Authorization', '')
  res.status(200).json({ message: 'Logged out successfully' })
}

export const getAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (typeof req.userId !== 'number') {
      throw new AuthenticationError('Unauthorized')
    }

    const user = await getMe(req.userId as number)

    const newAuthToken = generateAuthToken(user.id)
    setBearerToken(res, newAuthToken)

    res.status(200).json({ user, token: newAuthToken })
  } catch (error) {
    next(error)
  }
}
