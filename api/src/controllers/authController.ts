import { Response } from 'express'

import { RegisterDto } from '../schemas/authSchema'
import { TypedRequestBody } from '../types/request'
import { createUser, getUserByEmail } from '../services/userService'

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
