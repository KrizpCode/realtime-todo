jest.mock('../socketIo', () => {
  return {
    getSocketIo: jest.fn(() => ({
      to: jest.fn().mockReturnValue({
        emit: jest.fn()
      })
    }))
  }
})

import {
  afterEach,
  afterAll,
  describe,
  expect,
  it,
  beforeAll,
  jest
} from '@jest/globals'
import request from 'supertest'

import app from '../app'
import { prisma } from '../db/client'
import { createUser } from '../services/userService'
import { createTodoList } from '../services/todoListService'
import { createTodoitem as createTodoItemService } from '../services/todoItemService'

const validUser = {
  email: `testingTodoItems@test.com`,
  password: 'password123',
  name: 'Test User'
}

const loginUser = async (user: Partial<typeof validUser>) => {
  return request(app).post('/api/auth/login').send(user)
}

const createTodoItem = async (
  cookies: string[],
  listId: number,
  text: string
) => {
  return request(app)
    .post('/api/todo-items')
    .set('Cookie', cookies)
    .send({ text, listId })
}

const updateTodoItem = async (
  cookies: string[],
  todoItemId: number,
  completed: boolean,
  text: string
) => {
  return request(app)
    .put(`/api/todo-items/${todoItemId}`)
    .set('Cookie', cookies)
    .send({ completed, text })
}

const deleteTodoItem = async (cookies: string[], todoItemId: number) => {
  return request(app)
    .delete(`/api/todo-items/${todoItemId}`)
    .set('Cookie', cookies)
}

let authCookies: string[]
let testUserId: number | null = null
let testTodoListId: number | null = null
let testTodoItemId: number | null = null

beforeAll(async () => {
  const user = await createUser(
    validUser.email,
    validUser.password,
    validUser.name
  )

  testUserId = user.id

  const loginRes = await loginUser(validUser)

  authCookies =
    loginRes.headers['set-cookie'] &&
    Array.isArray(loginRes.headers['set-cookie'])
      ? loginRes.headers['set-cookie']
      : []

  const todoList = await createTodoList(testUserId!, 'Test Todo List')

  testTodoListId = todoList.id
})

afterEach(async () => {
  if (testTodoItemId) {
    await prisma.todoItem.deleteMany({ where: { id: testTodoItemId } })
    testTodoItemId = null
  }
})

afterAll(async () => {
  if (testTodoListId) {
    await prisma.todoList
      .delete({ where: { id: testTodoListId } })
      .catch(() => {})
  }
  if (testUserId) {
    await prisma.user.delete({ where: { id: testUserId } }).catch(() => {})
  }
  await prisma.$disconnect()
})

describe('Todo Items - CRUD', () => {
  it('should create a new todo item', async () => {
    const res = await createTodoItem(
      authCookies,
      testTodoListId!,
      'My First Todo Item'
    )

    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Todo item created successfully')

    const createdItem = await prisma.todoItem.findFirst({
      where: { listId: testTodoListId! }
    })
    expect(createdItem).toBeDefined()
    testTodoItemId = createdItem!.id
  })

  it('should update an existing todo item', async () => {
    const createdItem = await createTodoItemService(
      testTodoListId!,
      'Update Test Item'
    )
    testTodoItemId = createdItem.id

    const res = await updateTodoItem(
      authCookies,
      testTodoItemId!,
      true,
      'Updated Todo Item'
    )

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Todo item updated successfully')

    const updatedItem = await prisma.todoItem.findUnique({
      where: { id: testTodoItemId! }
    })
    expect(updatedItem).toBeDefined()
    expect(updatedItem!.completed).toBe(true)
    expect(updatedItem!.text).toBe('Updated Todo Item')
  })

  it('should delete an existing todo item', async () => {
    const createdItem = await createTodoItemService(
      testTodoListId!,
      'Delete Test Item'
    )
    testTodoItemId = createdItem.id

    const res = await deleteTodoItem(authCookies, testTodoItemId!)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Todo item deleted successfully')

    const deletedItem = await prisma.todoItem.findUnique({
      where: { id: testTodoItemId! }
    })
    expect(deletedItem).toBeNull()
  })

  it('should return 404 for updating a non-existent todo item', async () => {
    const res = await updateTodoItem(authCookies, 999999, true, 'Non-existent')

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Todo item not found')
  })

  it('should return 404 for deleting a non-existent todo item', async () => {
    const res = await deleteTodoItem(authCookies, 999999)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Todo item not found')
  })

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app).post('/api/todo-items').send({
      text: 'Unauthorized Todo Item',
      listId: testTodoListId!
    })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })
})
