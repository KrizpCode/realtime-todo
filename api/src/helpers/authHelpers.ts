import { Request, Response } from 'express'

const isProduction = process.env.NODE_ENV === 'production'
const domain = isProduction ? '.taskmate.fun' : undefined

export const getBearerToken = (req: Request) => {
  const authHeader = req.headers.authorization
  return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
}

export const setBearerToken = (res: Response, token: string) => {
  res.setHeader('Authorization', `Bearer ${token}`)
}

export const setAuthCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
    domain,
    maxAge: 1000 * 60 * 60 * 24 * 30
  })
}

export const clearAuthCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProduction,
    domain,
    path: '/'
  })
}
