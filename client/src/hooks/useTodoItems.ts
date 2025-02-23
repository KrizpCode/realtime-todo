import { useMutation } from '@tanstack/react-query'
import { createTodoItem } from '../services/todoItemService'
import { TodoList } from '../types/todoList'

interface CreateTaskItemMutation {
  listId: TodoList['id']
  text: string
}

export const useCreateTaskItem = () => {
  return useMutation({
    mutationFn: ({ listId, text }: CreateTaskItemMutation) =>
      createTodoItem(listId, text)
  })
}
