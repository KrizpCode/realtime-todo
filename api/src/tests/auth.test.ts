import {
  beforeEach,
  afterEach,
  afterAll,
  describe,
  expect,
  it
} from '@jest/globals'
import request from 'supertest'

import { prisma } from '../db/client'
import app from '../app'
import { createUser, getUserByEmail } from '../services/userService'

const generateUniqueEmail = () => `test+${Date.now()}@test.com`

const registerUser = async (user: Partial<typeof validUser>) => {
  return request(app).post('/api/auth/register').send(user)
}

const loginUser = async (user: Partial<typeof validUser>) => {
  return request(app).post('/api/auth/login').send(user)
}

const userCleanup = async (userId: number) => {
  await prisma.user.delete({
    where: { id: userId }
  })
}

let validUser: { email: string; password: string; name: string }
let testUserId: number | null = null

beforeEach(async () => {
  validUser = {
    email: generateUniqueEmail(),
    password: 'password123',
    name: 'Test User'
  }

  const user = await createUser(
    validUser.email,
    validUser.password,
    validUser.name
  )

  testUserId = user.id
})

afterEach(async () => {
  if (testUserId) {
    userCleanup(testUserId)
  }
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Authentication - Register', () => {
  it('should create a new user and return 201', async () => {
    const res = await registerUser({
      email: 'newuser@test.com',
      password: 'password123',
      name: 'New User'
    })

    expect(res.status).toBe(201)

    const user = await getUserByEmail('newuser@test.com')
    expect(user).toBeDefined()

    if (user) {
      await userCleanup(user.id)
    }
  })

  it('should not allow duplicate email registration', async () => {
    const res = await registerUser(validUser)
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ message: 'Email already in use' })
  })
})

describe('Authentication - Login', () => {
  it('should return 200 and set authentication cookies', async () => {
    const res = await loginUser(validUser)
    expect(res.status).toBe(200)

    const cookies = (res.headers['set-cookie'] as unknown as string[]) || []
    expect(cookies).toBeDefined()
    expect(Array.isArray(cookies)).toBe(true)

    const authTokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith('authToken')
    )
    expect(authTokenCookie).toBeDefined()
    expect(authTokenCookie).toContain('HttpOnly')

    const refreshTokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith('refreshToken')
    )
    expect(refreshTokenCookie).toBeDefined()
    expect(refreshTokenCookie).toContain('HttpOnly')
  })

  it('should return 401 if email does not exist', async () => {
    const res = await loginUser({
      email: 'unknown@test.com',
      password: validUser.password
    })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ message: 'Invalid credentials' })
  })

  it('should return 401 if password is incorrect', async () => {
    const res = await loginUser({
      email: validUser.email,
      password: 'wrongpassword'
    })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ message: 'Invalid credentials' })
  })
})

describe('Authentication - Logout', () => {
  it('should clear auth cookies on logout', async () => {
    const loginRes = await loginUser(validUser)
    expect(loginRes.status).toBe(200)

    const logoutRes = await request(app).post('/api/auth/logout')
    expect(logoutRes.status).toBe(200)

    const cookies = logoutRes.headers['set-cookie'] as unknown as string[]
    expect(cookies).toBeDefined()
    expect(
      cookies.find((cookie: string) => cookie.startsWith('authToken=;'))
    ).toBeDefined()
    expect(
      cookies.find((cookie: string) => cookie.startsWith('refreshToken=;'))
    ).toBeDefined()
  })
})

describe('Authentication - Refresh Token', () => {
  it('should refresh the authToken if refreshToken is valid', async () => {
    const loginRes = await loginUser(validUser)
    expect(loginRes.status).toBe(200)

    const cookies = loginRes.headers['set-cookie'] as unknown as string[]
    const refreshOnlyCookies = cookies.filter((cookie) =>
      cookie.startsWith('refreshToken')
    )

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', refreshOnlyCookies)

    expect(res.status).toBe(200)
    expect(res.body.user).toBeDefined()

    const newCookies = res.headers['set-cookie'] as unknown as string[]
    const newAuthToken = newCookies.find((cookie: string) =>
      cookie.startsWith('authToken')
    )

    expect(newAuthToken).toBeDefined()
  })

  it('should return 401 if both authToken and refreshToken are missing', async () => {
    const res = await request(app).get('/api/auth/me')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  it('should return 401 if refreshToken is invalid', async () => {
    const invalidCookies = ['refreshToken=invalid']

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', invalidCookies)

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid refresh token')
  })
})
