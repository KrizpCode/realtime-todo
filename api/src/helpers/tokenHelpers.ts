import jwt from 'jsonwebtoken'

export const generateAuthToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.AUTH_TOKEN_SECRET!, {
    expiresIn: '15min'
  })
}

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d'
  })
}
