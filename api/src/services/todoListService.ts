import { TodoList, User } from '@prisma/client'
import { prisma } from '../db/client'

export const createTodoList = async (
  userId: User['id'],
  name: TodoList['name']
) => {
  return await prisma.todoList.create({
    data: {
      name,
      ownerId: userId
    }
  })
}

export const getTodoListsByUserId = async (userId: User['id']) => {
  return await prisma.todoList.findMany({
    where: {
      ownerId: userId
    }
  })
}

export const getTodoListByUUID = async (uuid: TodoList['uuid']) => {
  return await prisma.todoList.findUnique({
    where: {
      uuid
    },
    include: {
      todos: true
    }
  })
}
