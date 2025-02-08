import bcrypt from 'bcryptjs'

import { prisma } from '../db/client'

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } })
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
