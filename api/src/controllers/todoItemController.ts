import { Response, Request } from 'express'

import { CreateTodoItemSchema } from '../schemas/todoItemSchemas'
import {
  createTodoitem,
  deleteTodoItem,
  updateTodoItem
} from '../services/todoItemService'
import { TypedRequest } from '../types/request'
import { getSocketIo } from '../socketIo'
import { getTodoListById } from '../services/todoListService'

export const createTodoItemHandler = async (
  req: TypedRequest<CreateTodoItemSchema>,
  res: Response
) => {
  try {
    const { text, listId } = req.body

    await createTodoitem(listId, text)

    res.status(201).json({ message: 'Todo item created successfully' })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const updateTodoItemHandler = async (
  req: TypedRequest<{ completed: boolean }, { todoItemId: string }>,
  res: Response
) => {
  try {
    const { completed } = req.body
    const { todoItemId } = req.params

    const updatedTodoItem = await updateTodoItem(Number(todoItemId), completed)

    if (!updatedTodoItem) {
      res.status(404).json({ message: 'Todo item not found' })
      return
    }

    const todoList = await getTodoListById(updatedTodoItem.listId)

    if (!todoList) {
      res.status(404).json({ message: 'Todo list not found' })
      return
    }

    const io = getSocketIo()
    io.to(todoList.uuid).emit('todoItemUpdated', updatedTodoItem)

    res.status(200).json({ message: 'Todo item updated successfully' })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteTodoItemHandler = async (req: Request, res: Response) => {
  try {
    const { todoItemId } = req.params

    await deleteTodoItem(Number(todoItemId))

    res.status(200).json({ message: 'Todo item deleted successfully' })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
