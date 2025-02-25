import { Response, Request } from 'express'

import {
  CreateTodoItemDto,
  UpdateTodoItemDto
} from '../schemas/todoItemSchemas'
import {
  createTodoitem,
  deleteTodoItem,
  updateTodoItem
} from '../services/todoItemService'
import { TypedRequest } from '../types/request'
import { getSocketIo } from '../socketIo'

export const createTodoItemHandler = async (
  req: TypedRequest<CreateTodoItemDto>,
  res: Response
) => {
  try {
    const { text, listId } = req.body

    const createdTodoItem = await createTodoitem(listId, text).catch(() => {})

    if (!createdTodoItem || !createdTodoItem.list) {
      res.status(404).json({ message: 'Todo list not found' })
      return
    }

    const { list, ...todoItemResponse } = createdTodoItem

    const io = getSocketIo()
    io.to(list.uuid).emit('todoItemCreated', todoItemResponse)

    res.status(201).json({ message: 'Todo item created successfully' })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const updateTodoItemHandler = async (
  req: TypedRequest<UpdateTodoItemDto, { todoItemId: string }>,
  res: Response
) => {
  try {
    const { completed, text } = req.body
    const { todoItemId } = req.params

    const updatedTodoItem = await updateTodoItem(
      Number(todoItemId),
      completed,
      text
    ).catch(() => {})

    if (!updatedTodoItem || !updatedTodoItem.list) {
      res.status(404).json({ message: 'Todo item not found' })
      return
    }

    const { list, ...todoItemResponse } = updatedTodoItem

    const io = getSocketIo()
    io.to(list.uuid).emit('todoItemUpdated', todoItemResponse)

    res.status(200).json({ message: 'Todo item updated successfully' })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const deleteTodoItemHandler = async (req: Request, res: Response) => {
  try {
    const { todoItemId } = req.params

    const deletedTodoItem = await deleteTodoItem(Number(todoItemId)).catch(
      () => {}
    )

    if (!deletedTodoItem || !deletedTodoItem.list) {
      res.status(404).json({ message: 'Todo item not found' })
      return
    }

    const { list, ...deletedTodoItemResponse } = deletedTodoItem

    const io = getSocketIo()
    io.to(list.uuid).emit('todoItemDeleted', deletedTodoItemResponse)

    res.status(200).json({ message: 'Todo item deleted successfully' })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
