import { NextFunction, Request, Response } from 'express'

import { generateAuthToken, verifyToken } from '../helpers/tokenHelpers'
import {
  getBearerToken,
  setAuthCookie,
  setBearerToken
} from '../helpers/authHelpers'
import { AuthenticationError } from '../errors/AuthenticationError'
import {
  createRefreshToken,
  getRefreshToken,
  invalidateRefreshToken
} from '../services/refreshTokenService'

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = getBearerToken(req)
  const { refreshToken } = req.cookies

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
    const storedToken = await getRefreshToken(refreshToken)

    if (
      !storedToken ||
      !storedToken.isValid ||
      storedToken.expiresAt < new Date()
    ) {
      return next(new AuthenticationError('Invalid refresh token'))
    }

    await invalidateRefreshToken(refreshToken)

    const newAuthToken = generateAuthToken(storedToken.userId)
    const newRefreshTokenRecord = await createRefreshToken(storedToken.userId)

    setAuthCookie(res, newRefreshTokenRecord.token)
    setBearerToken(res, newAuthToken)

    req.userId = storedToken.userId

    return next()
  } catch {
    return next(new AuthenticationError('Invalid refresh token'))
  }
}
