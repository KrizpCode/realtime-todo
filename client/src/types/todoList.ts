import { Todoitem } from './todoItem'

export type TodoList = {
  id: number
  uuid: string
  name: string
  ownerId: number
  todos: Todoitem[]
  createdAt: string
  updatedAt: string
}
