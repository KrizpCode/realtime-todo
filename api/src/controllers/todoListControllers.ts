import { NextFunction, Request, Response } from 'express'

import { TypedRequest } from '../types/request'
import { CreateTodoListDto } from '../schemas/todoListSchemas'
import {
  createTodoList,
  getTodoListByUUID,
  getTodoListsByUserId
} from '../services/todoListService'
import { AuthenticationError } from '../errors/AuthenticationError'

export const createTodoListHandler = async (
  req: TypedRequest<CreateTodoListDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (typeof req.userId !== 'number') {
      throw new AuthenticationError('Unauthorized')
    }

    const { name } = req.body
    await createTodoList(req.userId as number, name)

    res.status(201).json({ message: 'Todo list created successfully' })
  } catch (error) {
    next(error)
  }
}

export const getTodoListByUUIDHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uuid } = req.params

    const todoList = await getTodoListByUUID(uuid)

    res.status(200).json(todoList)
  } catch (error) {
    next(error)
  }
}

export const getTodoListsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (typeof req.userId !== 'number') {
      throw new AuthenticationError('Unauthorized')
    }

    const todoLists = await getTodoListsByUserId(req.userId as number)

    res.status(200).json(todoLists)
  } catch (error) {
    next(error)
  }
}
