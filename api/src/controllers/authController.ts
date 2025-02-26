import { NextFunction, Request, Response } from 'express'

import { LoginDto, RegisterDto } from '../schemas/authSchemas'
import { TypedRequest } from '../types/request'
import { getMe, loginUser, registerUser } from '../services/userService'

import { clearAuthCookies, setAuthCookies } from '../helpers/authCookieHelpers'
import { AuthenticationError } from '../errors/AuthenticationError'

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

    setAuthCookies(res, authToken, refreshToken)

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, email: user.email, name: user.name }
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

    setAuthCookies(res, authToken, refreshToken)

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name }
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (_req: Request, res: Response) => {
  clearAuthCookies(res)

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

    const user = getMe(req.userId as number)

    res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}
