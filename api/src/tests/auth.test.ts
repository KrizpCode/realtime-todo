import { afterAll, beforeEach, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import bcrypt from 'bcryptjs'

import app from '../app'
import { prisma } from '../db/client'
import { getUserByEmail } from '../services/userService'

const validUser = {
  email: 'test@test.com',
  password: 'password',
  name: 'Test User'
}

const registerUser = async (user: Partial<typeof validUser>) => {
  return request(app).post('/api/auth/register').send(user)
}

beforeEach(async () => {
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Authentication - Register', () => {
  it('should create a new user and return 201', async () => {
    const res = await registerUser(validUser)

    expect(res.status).toBe(201)

    const user = await getUserByEmail(validUser.email)

    expect(user).toBeDefined()
  })

  it('should not allow duplicate email registration', async () => {
    const firstResponse = await registerUser(validUser)

    expect(firstResponse.status).toBe(201)

    const secondResponse = await registerUser({
      ...validUser,
      name: 'Test User 2'
    })

    expect(secondResponse.status).toBe(400)
    expect(secondResponse.body).toEqual({ message: 'Email already in use' })
  })

  it('should hash the password before saving it to the database', async () => {
    const res = await registerUser(validUser)

    expect(res.status).toBe(201)

    const savedUser = await getUserByEmail(validUser.email)

    expect(savedUser).toBeDefined()
    expect(savedUser?.password).not.toBe(validUser.password)

    const isPasswordValid = await bcrypt.compare(
      validUser.password,
      savedUser?.password as string
    )

    expect(isPasswordValid).toBe(true)
  })

  it('should return 400 if email is not valid', async () => {
    const res = await registerUser({ ...validUser, email: 'invalid-email' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ errors: { email: 'Invalid email' } })
  })

  it('should return 400 if password is less than 8 characters', async () => {
    const res = await registerUser({ ...validUser, password: 'pass' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      errors: { password: 'Password must be at least 8 characters' }
    })
  })

  it('should return 400 if name is not provided', async () => {
    const res = await registerUser({
      email: validUser.email,
      password: validUser.password
    })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ errors: { name: 'Required' } })
  })
})
