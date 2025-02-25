import bcrypt from 'bcryptjs'
import { User } from '@prisma/client'

import { prisma } from '../db/client'
import { AuthenticationError } from '../errors/AuthenticationError'
import {
  generateAuthToken,
  generateRefreshToken
} from '../helpers/tokenHelpers'

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } })
}

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } })
}

export const createUser = async (
  email: string,
  password: string,
  name: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  })
}

export const loginUser = async (
  email: User['email'],
  password: User['password']
) => {
  const user = await getUserByEmail(email)
  const passwordMatch = user && (await bcrypt.compare(password, user.password))

  if (!user || !passwordMatch) {
    throw new AuthenticationError('Invalid credentials')
  }

  const authToken = generateAuthToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  return { user, authToken, refreshToken }
}
