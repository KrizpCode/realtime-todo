import { Response } from 'express'

const isProduction = process.env.NODE_ENV === 'production'
const domain = isProduction ? '.taskmate.fun' : undefined

export const setAuthCookies = (
  res: Response,
  authToken: string,
  refreshToken: string
) => {
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
}
