import { Response } from 'express'
import bcrypt from 'bcryptjs'

import { LoginDto, RegisterDto } from '../schemas/authSchema'
import { TypedRequestBody } from '../types/request'
import { createUser, getUserByEmail } from '../services/userService'
import {
  generateAuthToken,
  generateRefreshToken
} from '../helpers/tokenHelpers'

export const register = async (
  req: TypedRequestBody<RegisterDto>,
  res: Response
) => {
  const { email, password, name } = req.body

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    res.status(400).json({ message: 'Email already in use' })
    return
  }

  await createUser(email, password, name)

  res.status(201).json({ message: 'User registered successfully' })
}

export const login = async (req: TypedRequestBody<LoginDto>, res: Response) => {
  const { email, password } = req.body

  const user = await getUserByEmail(email)
  const passwordMatch = user && (await bcrypt.compare(password, user.password))

  if (!user || !passwordMatch) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const authToken = generateAuthToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7
  })

  res.status(200).json({ message: 'Login successful', authToken })
}
