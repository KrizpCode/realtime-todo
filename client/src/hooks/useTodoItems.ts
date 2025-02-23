import { useMutation, useQueryClient } from '@tanstack/react-query'
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

export const useCreateTodoItem = (todoListUUID: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, text }: CreateTodoItemMutation) =>
      createTodoItem(listId, text),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListUUID] })
  })
}

interface UpdateTodoItemMutation {
  completed: boolean
  todoItemId: number
}

export const useUpdateTodoItem = (todoListUUID: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ completed, todoItemId }: UpdateTodoItemMutation) =>
      updateTodoItem(todoItemId, completed),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListUUID] })
  })
}

export const useDeleteTodoItem = (todoListUUID: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todoItemId: number) => deleteTodoItem(todoItemId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListUUID] })
  })
}
