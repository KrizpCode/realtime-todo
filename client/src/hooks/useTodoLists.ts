import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'

import {
  createTodoList,
  fetchTodoList,
  fetchTodoLists
} from '../services/todoListService'
import { CreateTodoListFormData } from '../components/CreateTodoListForm/schema'

export const todoListQueryOptions = (todoListUUID: string) =>
  queryOptions({
    queryKey: ['todoList', todoListUUID],
    queryFn: async () => fetchTodoList(todoListUUID)
  })

export const useTodoList = (todoListUUID: string) => {
  return useQuery(todoListQueryOptions(todoListUUID))
}

export const useTodoLists = () => {
  return useQuery({
    queryKey: ['todoLists'],
    queryFn: async () => fetchTodoLists()
  })
}

export const useCreateTaskList = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTodoListFormData) => createTodoList(data.name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todoLists'] })
  })
}
