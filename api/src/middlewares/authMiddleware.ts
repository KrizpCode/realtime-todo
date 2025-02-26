import { NextFunction, Request, Response } from 'express'

import { generateAuthToken, verifyToken } from '../helpers/tokenHelpers'
import { setAuthCookies } from '../helpers/authCookieHelpers'
import { AuthenticationError } from '../errors/AuthenticationError'

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authToken, refreshToken } = req.cookies

  if (authToken) {
    try {
      const payload = verifyToken(authToken, process.env.AUTH_TOKEN_SECRET!)
      req.userId = payload.userId
      return next()
    } catch {
      // Continue to refresh token logic
    }
  }

  if (!refreshToken) {
    return next(new AuthenticationError('Unauthorized'))
  }

  try {
    const payload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
    const newAuthToken = generateAuthToken(payload.userId)

    setAuthCookies(res, newAuthToken, refreshToken)

    req.userId = payload.userId
    return next()
  } catch {
    return next(new AuthenticationError('Invalid refresh token'))
  }
}
