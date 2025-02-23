import { TodoItem } from './todoItem'

export type TodoList = {
  id: number
  uuid: string
  name: string
  ownerId: number
  todos: TodoItem[]
  createdAt: string
  updatedAt: string
}
