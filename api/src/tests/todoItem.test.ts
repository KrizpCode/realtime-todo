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
import { createTodoList as createTodoListService } from '../services/todoListService'
import { createTodoitem as createTodoItemService } from '../services/todoItemService'

const validUser = {
  email: 'testingTodoItem@test.com',
  password: 'password123',
  name: 'Test User'
}

const loginUser = async (user: Partial<typeof validUser>) => {
  return request(app).post('/api/auth/login').send(user)
}

let authState: {
  cookies: string[]
  token: string
}

const updateAuthState = (res: request.Response) => {
  const cookies = res.headers['set-cookie'] as unknown as string[]
  const token = res.body.token || res.headers.authorization?.split(' ')[1]

  if (cookies) authState.cookies = cookies
  if (token) authState.token = token
}

const createTodoItem = async (listId: number, text: string) => {
  const res = await request(app)
    .post(`/api/todo-items`)
    .set('Cookie', authState.cookies)
    .set('Authorization', `Bearer ${authState.token}`)
    .send({ text, listId })

  updateAuthState(res)
  return res
}

const updateTodoItem = async (
  itemId: number,
  updates: { text?: string; completed?: boolean; listId: number }
) => {
  const res = await request(app)
    .put(`/api/todo-items/${itemId}`)
    .set('Cookie', authState.cookies)
    .set('Authorization', `Bearer ${authState.token}`)
    .send(updates)

  updateAuthState(res)
  return res
}

const deleteTodoItem = async (itemId: number) => {
  const res = await request(app)
    .delete(`/api/todo-items/${itemId}`)
    .set('Cookie', authState.cookies)
    .set('Authorization', `Bearer ${authState.token}`)

  updateAuthState(res)
  return res
}

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

  authState = {
    cookies: loginRes.headers['set-cookie'] as unknown as string[],
    token: loginRes.body.token
  }

  const todoList = await createTodoListService(testUserId!, 'Test Todo List')
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
    const res = await createTodoItem(testTodoListId!, 'My First Todo Item')

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

    const res = await updateTodoItem(testTodoItemId!, {
      completed: true,
      text: 'Updated Todo Item',
      listId: testTodoListId!
    })

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

    const res = await deleteTodoItem(testTodoItemId!)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Todo item deleted successfully')

    const deletedItem = await prisma.todoItem.findUnique({
      where: { id: testTodoItemId! }
    })
    expect(deletedItem).toBeNull()
  })

  it('should return 404 for updating a non-existent todo item', async () => {
    const res = await updateTodoItem(999999, {
      completed: true,
      text: 'Non-existent',
      listId: testTodoListId!
    })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Todo item not found')
  })

  it('should return 404 for deleting a non-existent todo item', async () => {
    const res = await deleteTodoItem(999999)

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
