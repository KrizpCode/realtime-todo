import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { generateAuthToken } from '../helpers/tokenHelpers'

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies.authToken

  if (!authToken) {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as { userId: number }

      const newAuthToken = generateAuthToken(payload.userId)

      const isProduction = process.env.NODE_ENV === 'production'

      res.cookie('authToken', newAuthToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: isProduction,
        domain: isProduction ? '.taskmate.fun' : undefined,
        maxAge: 1000 * 60 * 15
      })

      req.userId = payload.userId
      return next()
    } catch {
      res.status(401).json({ message: 'Invalid refresh token' })
      return
    }
  }

  try {
    const payload = jwt.verify(authToken, process.env.AUTH_TOKEN_SECRET!) as {
      userId: number
    }

    req.userId = payload.userId
    return next()
  } catch {
    res.status(401).json({ message: 'Invalid auth token' })
    return
  }
}
