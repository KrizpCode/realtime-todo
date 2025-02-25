import {
  beforeEach,
  afterEach,
  afterAll,
  describe,
  expect,
  it
} from '@jest/globals'
import request from 'supertest'

import app from '../app'
import { prisma } from '../db/client'
import { createUser } from '../services/userService'
import { createTodoList as createTodoListService } from '../services/todoListService'

const validUser = {
  email: 'test@test.com',
  password: 'password123',
  name: 'Test User'
}

const loginUser = async (user: Partial<typeof validUser>) => {
  return request(app).post('/api/auth/login').send(user)
}

const createTodoList = async (cookies: string[], name: string) => {
  return request(app)
    .post('/api/todo-lists')
    .set('Cookie', cookies)
    .send({ name })
}

const getTodoLists = async (cookies: string[]) => {
  return request(app).get('/api/todo-lists').set('Cookie', cookies)
}

const getTodoListByUUID = async (cookies: string[], uuid: string) => {
  return request(app).get(`/api/todo-lists/${uuid}`).set('Cookie', cookies)
}

let authCookies: string[]
let testUserId: number | null = null

beforeEach(async () => {
  const user = await createUser(
    validUser.email,
    validUser.password,
    validUser.name
  )
  testUserId = user.id

  const loginRes = await loginUser(validUser)

  authCookies = Array.isArray(loginRes.headers['set-cookie'])
    ? loginRes.headers['set-cookie']
    : [loginRes.headers['set-cookie']]
})

afterEach(async () => {
  if (testUserId) {
    await prisma.user.delete({ where: { id: testUserId } })
  }
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Todo Lists - CRUD', () => {
  it('should create a new todo list', async () => {
    const res = await createTodoList(authCookies, 'My First Todo List')

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Todo list created successfully')
  })

  it('should return a list of the users todo lists', async () => {
    await createTodoList(authCookies, 'Shopping List')
    await createTodoList(authCookies, 'Work Tasks')

    const res = await getTodoLists(authCookies)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)
  })

  it('should fetch a specific todo list by UUID', async () => {
    const createdTodoList = await createTodoListService(
      testUserId!,
      'My Test List'
    )
    const res = await getTodoListByUUID(authCookies, createdTodoList.uuid)

    expect(res.status).toBe(200)
    expect(res.body.uuid).toBe(createdTodoList.uuid)
  })

  it('should return 404 for a non-existent todo list UUID', async () => {
    const res = await getTodoListByUUID(authCookies, 'non-existent-uuid')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Todo list not found')
  })

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).get('/api/todo-lists')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })
})
