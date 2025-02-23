import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTodoItem } from '../services/todoItemService'
import { TodoList } from '../types/todoList'

interface CreateTaskItemMutation {
  listId: TodoList['id']
  text: string
}

export const useCreateTaskItem = (todoListUUID: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, text }: CreateTaskItemMutation) =>
      createTodoItem(listId, text),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['todoList', todoListUUID] })
  })
}
