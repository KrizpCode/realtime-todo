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
