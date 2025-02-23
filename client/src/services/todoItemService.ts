import { TodoItem } from '../types/todoItem'
import { TodoList } from '../types/todoList'
import { apiClient } from './apiClient'

export const createTodoItem = (
  listId: TodoList['id'],
  text: TodoItem['text']
) => apiClient.post<TodoItem>('/api/todo-items', { listId, text })

export const updateTodoItem = (
  todoItemId: TodoItem['id'],
  completed: TodoItem['completed']
) => apiClient.put<TodoItem>(`/api/todo-items/${todoItemId}`, { completed })

export const deleteTodoItem = (todoItemId: TodoItem['id']) =>
  apiClient.delete(`/api/todo-items/${todoItemId}`)
