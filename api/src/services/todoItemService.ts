import { TodoItem, TodoList } from '@prisma/client'

import { prisma } from '../db/client'

export const createTodoitem = async (
  listId: TodoList['id'],
  text: TodoItem['text']
) => {
  return await prisma.todoItem.create({
    data: {
      text,
      listId: listId
    }
  })
}
