import bcrypt from 'bcryptjs'

import { prisma } from '../db/client'
import { AuthenticationError } from '../errors/AuthenticationError'
import { ValidationError } from '../errors/ValidationError'
import { ApiError } from '../errors/ApiError'
import { generateAuthToken } from '../helpers/tokenHelpers'
import { NotFoundError } from '../errors/NotFoundError'
import { createRefreshToken } from '../services/refreshTokenService'

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

export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    throw new ValidationError('Email already in use')
  }

  const newUser = await createUser(email, password, name)

  if (!newUser) {
    throw new ApiError('Failed to register user')
  }

  const authToken = generateAuthToken(newUser.id)
  const refreshToken = await createRefreshToken(newUser.id)

  return { user: newUser, authToken, refreshToken: refreshToken.token }
}

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email)
  const passwordMatch = user && (await bcrypt.compare(password, user.password))

  if (!user || !passwordMatch) {
    throw new AuthenticationError('Invalid credentials')
  }

  const authToken = generateAuthToken(user.id)
  const refreshToken = await createRefreshToken(user.id)

  return {
    user,
    authToken,
    refreshToken: refreshToken.token
  }
}

export const getMe = async (userId: number) => {
  const user = await getUserById(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return { id: user.id, email: user.email, name: user.name }
}
