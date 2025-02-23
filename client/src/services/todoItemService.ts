import { TodoItem } from '../types/todoItem'
import { TodoList } from '../types/todoList'
import { apiClient } from './apiClient'

export const createTodoItem = (
  listId: TodoList['id'],
  text: TodoItem['text']
) => apiClient.post<TodoItem>('/api/todo-items', { listId, text })
