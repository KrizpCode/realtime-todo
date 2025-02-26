import { prisma } from '../db/client'
import { NotFoundError } from '../errors/NotFoundError'

export const createTodoitem = async (listId: number, text: string) => {
  const todoItem = await prisma.todoItem.create({
    data: {
      text,
      listId: listId
    },
    include: {
      list: {
        select: {
          uuid: true
        }
      }
    }
  })

  if (!todoItem || !todoItem.list) {
    throw new NotFoundError('Todo list not found')
  }

  return todoItem
}

export const updateTodoItem = async (
  todoItemId: number,
  completed: boolean,
  text: string
) => {
  const updatedTodoItem = await prisma.todoItem.update({
    where: {
      id: todoItemId
    },
    data: {
      completed,
      text
    },
    include: {
      list: {
        select: {
          uuid: true
        }
      }
    }
  })

  if (!updatedTodoItem || !updatedTodoItem.list) {
    throw new NotFoundError('Todo list not found')
  }

  return updatedTodoItem
}

export const deleteTodoItem = async (todoItemId: number) => {
  const deletedTodoitem = await prisma.todoItem.delete({
    where: {
      id: todoItemId
    },
    include: {
      list: {
        select: {
          uuid: true
        }
      }
    }
  })

  if (!deletedTodoitem || !deletedTodoitem.list) {
    throw new NotFoundError('Todo list not found')
  }

  return deletedTodoitem
}
