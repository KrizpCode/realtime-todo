import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createTodoList, fetchTodoLists } from '../services/todoListService'
import { TodoListFormData } from '../components/CreateTodoListForm/schema'

export const useTodoLists = () => {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: async () => fetchTodoLists()
  })
}

export const useCreateTaskList = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TodoListFormData) => createTodoList(data.name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todoLists'] })
  })
}
