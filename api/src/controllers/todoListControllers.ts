import { Request, Response } from 'express'

import { TypedRequest } from '../types/request'
import { CreateTodoListDto } from '../schemas/todoListSchemas'
import {
  createTodoList,
  getTodoListByUUID,
  getTodoListsByUserId
} from '../services/todoListService'

export const createTodoListHandler = async (
  req: TypedRequest<CreateTodoListDto>,
  res: Response
) => {
  try {
    const { name } = req.body
    const { userId } = req

    await createTodoList(userId!, name)

    res.status(201).json({ message: 'Todo list created successfully' })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const getTodoListByUUIDHandler = async (req: Request, res: Response) => {
  const { uuid } = req.params

  try {
    const todoList = await getTodoListByUUID(uuid)

    if (!todoList) {
      res.status(404).json({ message: 'Todo list not found' })
      return
    }

    res.status(200).json(todoList)
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const getTodoListsHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req

    const todoLists = await getTodoListsByUserId(userId!)

    res.status(200).json(todoLists)
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
