import { prisma } from '../db/client'
import { NotFoundError } from '../errors/NotFoundError'

export const createTodoList = async (ownerId: number, name: string) => {
  return await prisma.todoList.create({
    data: {
      name,
      ownerId
    }
  })
}

export const getTodoListsByUserId = async (ownerId: number) => {
  return await prisma.todoList.findMany({
    where: {
      ownerId
    }
  })
}

export const getTodoListByUUID = async (uuid: string) => {
  const todoList = await prisma.todoList.findUnique({
    where: {
      uuid
    },
    include: {
      todos: {
        orderBy: {
          id: 'asc'
        }
      }
    }
  })

  if (!todoList) {
    throw new NotFoundError('Todo list not found')
  }

  return todoList
}
