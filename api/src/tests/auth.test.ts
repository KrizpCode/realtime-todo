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
import {
  deleteExpiredTokens,
  getRefreshToken
} from '../services/refreshTokenService'

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
    expect(res.body).toEqual({ status: 400, message: 'Email already in use' })
  })
})

describe('Authentication - Login', () => {
  it('should return 200, with authToken and set refreshToken cookie', async () => {
    const res = await loginUser(validUser)
    expect(res.status).toBe(200)

    const authToken = res.body.token
    expect(authToken).toBeDefined()
    expect(res.headers['authorization']).toBe(`Bearer ${authToken}`)

    const cookies = (res.headers['set-cookie'] as unknown as string[]) || []
    expect(cookies).toBeDefined()
    expect(Array.isArray(cookies)).toBe(true)

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
    expect(res.body).toEqual({
      status: 401,
      message: 'Invalid credentials'
    })
  })

  it('should return 401 if password is incorrect', async () => {
    const res = await loginUser({
      email: validUser.email,
      password: 'wrongpassword'
    })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ status: 401, message: 'Invalid credentials' })
  })
})

describe('Authentication - Logout', () => {
  it('should clear authHeaders and refreshToken cookie on logout', async () => {
    const loginRes = await loginUser(validUser)
    expect(loginRes.status).toBe(200)

    const logoutRes = await request(app).post('/api/auth/logout')
    expect(logoutRes.status).toBe(200)

    expect(logoutRes.headers['authorization']).toBe('')

    const cookies = logoutRes.headers['set-cookie'] as unknown as string[]
    expect(cookies).toBeDefined()
    expect(
      cookies.find((cookie: string) => cookie.startsWith('refreshToken=;'))
    ).toBeDefined()
  })
})

describe('Authentication - Refresh Token', () => {
  it('should create and store refresh token on login', async () => {
    const loginRes = await loginUser(validUser)
    expect(loginRes.status).toBe(200)

    const cookies = loginRes.headers['set-cookie'] as unknown as string[]
    const refreshTokenCookie = cookies.find((cookie) =>
      cookie.startsWith('refreshToken=')
    )
    const token = refreshTokenCookie?.split(';')[0].split('=')[1]

    const storedToken = await getRefreshToken(token!)
    expect(storedToken).toBeDefined()
    expect(storedToken?.isValid).toBe(true)
    expect(storedToken?.userId).toBe(testUserId)
  })

  it('should rotate refresh token when used', async () => {
    const loginRes = await loginUser(validUser)
    const cookies = loginRes.headers['set-cookie'] as unknown as string[]
    const initialRefreshToken = cookies.find((cookie) =>
      cookie.startsWith('refreshToken=')
    )

    const protectedRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [initialRefreshToken!])

    expect(protectedRes.status).toBe(200)

    const oldToken = initialRefreshToken!.split(';')[0].split('=')[1]
    const invalidatedToken = await getRefreshToken(oldToken)
    expect(invalidatedToken?.isValid).toBe(false)

    const newCookies = protectedRes.headers['set-cookie'] as unknown as string[]
    const newRefreshToken = newCookies.find((cookie) =>
      cookie.startsWith('refreshToken=')
    )
    expect(newRefreshToken).toBeDefined()
    expect(newRefreshToken).not.toBe(initialRefreshToken)

    const newToken = newRefreshToken!.split(';')[0].split('=')[1]
    const newStoredToken = await getRefreshToken(newToken)
    expect(newStoredToken?.isValid).toBe(true)
  })

  it('should not allow reuse of rotated tokens', async () => {
    const loginRes = await loginUser(validUser)
    const cookies = loginRes.headers['set-cookie'] as unknown as string[]
    const initialRefreshToken = cookies.find((cookie) =>
      cookie.startsWith('refreshToken=')
    )

    const firstUseRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [initialRefreshToken!])
    expect(firstUseRes.status).toBe(200)

    const secondUseRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [initialRefreshToken!])
    expect(secondUseRes.status).toBe(401)
    expect(secondUseRes.body.message).toBe('Invalid refresh token')
  })

  it('should not accept expired refresh tokens', async () => {
    const expiredToken = await prisma.refreshToken.create({
      data: {
        token: 'expired_token',
        userId: testUserId!,
        expiresAt: new Date(Date.now() - 1000), // Set to past
        isValid: true
      }
    })

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [`refreshToken=${expiredToken.token}`])

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Invalid refresh token')
  })

  it('should cleanup expired tokens', async () => {
    await prisma.refreshToken.createMany({
      data: [
        {
          token: 'expired1',
          userId: testUserId!,
          expiresAt: new Date(Date.now() - 1000),
          isValid: true
        },
        {
          token: 'expired2',
          userId: testUserId!,
          expiresAt: new Date(Date.now() - 1000),
          isValid: false
        }
      ]
    })

    await deleteExpiredTokens()

    const remainingTokens = await prisma.refreshToken.findMany({
      where: {
        token: {
          in: ['expired1', 'expired2']
        }
      }
    })
    expect(remainingTokens).toHaveLength(0)
  })
})
