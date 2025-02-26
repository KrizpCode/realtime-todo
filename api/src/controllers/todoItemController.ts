import { Response, Request, NextFunction } from 'express'

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
  res: Response,
  next: NextFunction
) => {
  try {
    const { text, listId } = req.body

    const { list, ...todoItemResponse } = await createTodoitem(listId, text)

    const io = getSocketIo()
    io.to(list.uuid).emit('todoItemCreated', todoItemResponse)

    res.status(201).json({ message: 'Todo item created successfully' })
  } catch (error) {
    next(error)
  }
}

export const updateTodoItemHandler = async (
  req: TypedRequest<UpdateTodoItemDto, { todoItemId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { completed, text } = req.body
    const { todoItemId } = req.params

    const { list, ...todoItemResponse } = await updateTodoItem(
      Number(todoItemId),
      completed,
      text
    )

    const io = getSocketIo()
    io.to(list.uuid).emit('todoItemUpdated', todoItemResponse)

    res.status(200).json({ message: 'Todo item updated successfully' })
  } catch (error) {
    next(error)
  }
}

export const deleteTodoItemHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { todoItemId } = req.params

    const { list, ...deletedTodoItemResponse } = await deleteTodoItem(
      Number(todoItemId)
    )

    const io = getSocketIo()
    io.to(list.uuid).emit('todoItemDeleted', deletedTodoItemResponse)

    res.status(200).json({ message: 'Todo item deleted successfully' })
  } catch (error) {
    next(error)
  }
}
