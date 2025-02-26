import jwt from 'jsonwebtoken'

export const generateAuthToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.AUTH_TOKEN_SECRET!, {
    expiresIn: '15min'
  })
}

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '30d'
  })
}

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as { userId: number }
}
