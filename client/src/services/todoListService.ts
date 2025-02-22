import { apiClient } from './apiClient'
import { TodoList } from '../types/todoList'

export const fetchTodoList = (todoListUUID: TodoList['uuid']) =>
  apiClient.get<TodoList>(`/api/todo-lists/${todoListUUID}`)

export const fetchTodoLists = () => apiClient.get<TodoList[]>('/api/todo-lists')

export const createTodoList = (name: TodoList['name']) =>
  apiClient.post<TodoList>('/api/todo-lists', { name })
