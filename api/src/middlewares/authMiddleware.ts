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
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    jwt.verify(authToken, process.env.AUTH_TOKEN_SECRET!)
    next()
  } catch {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as {
        userId: number
      }

      const newAuthToken = generateAuthToken(payload.userId)

      res.cookie('authToken', newAuthToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15
      })

      next()
    } catch {
      res.status(401).json({ message: 'Invalid refresh token' })
    }
  }
}
