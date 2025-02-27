import { useMutation } from '@tanstack/react-query'
import {
  createTodoItem,
  deleteTodoItem,
  updateTodoItem
} from '../services/todoItemService'
import { TodoList } from '../types/todoList'

interface CreateTodoItemMutation {
  listId: TodoList['id']
  text: string
}

export const useCreateTodoItem = () => {
  return useMutation({
    mutationFn: ({ listId, text }: CreateTodoItemMutation) =>
      createTodoItem(listId, text)
  })
}

interface UpdateTodoItemMutation {
  completed: boolean
  todoItemId: number
  text: string
}

export const useUpdateTodoItem = () => {
  return useMutation({
    mutationFn: ({ completed, todoItemId, text }: UpdateTodoItemMutation) =>
      updateTodoItem(todoItemId, completed, text)
  })
}

export const useDeleteTodoItem = () => {
  return useMutation({
    mutationFn: (todoItemId: number) => deleteTodoItem(todoItemId)
  })
}
