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

export const updateTodoItem = async (
  todoItemId: TodoItem['id'],
  completed: TodoItem['completed']
) => {
  return await prisma.todoItem.update({
    where: {
      id: todoItemId
    },
    data: {
      completed
    }
  })
}

export const deleteTodoItem = async (todoItemId: TodoItem['id']) => {
  return await prisma.todoItem.delete({
    where: {
      id: todoItemId
    }
  })
}
