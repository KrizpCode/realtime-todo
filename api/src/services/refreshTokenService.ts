import { randomUUID } from 'crypto'

import { prisma } from '../db/client'

export const createRefreshToken = async (userId: number) => {
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const refreshToken = await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  })

  return refreshToken
}

export const invalidateRefreshToken = async (token: string) => {
  const updatedToken = await prisma.refreshToken.update({
    where: { token },
    data: { isValid: false }
  })

  return updatedToken
}

export const getRefreshToken = async (token: string) => {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true }
  })

  return refreshToken
}

export const deleteExpiredTokens = async () => {
  const deletedTokens = await prisma.refreshToken.deleteMany({
    where: {
      OR: [{ expiresAt: { lte: new Date() } }, { isValid: false }]
    }
  })

  return deletedTokens
}
