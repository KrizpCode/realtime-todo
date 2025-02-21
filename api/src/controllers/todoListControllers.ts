import { Response } from 'express'

import { TypedRequestBody } from '../types/request'
import { CreateTodoListDto } from '../schemas/todoListSchemas'
import { createTodoList } from '../services/todoListService'

export const createTodoListHandler = async (
  req: TypedRequestBody<CreateTodoListDto>,
  res: Response
) => {
  try {
    const { name } = req.body
    const { userId } = req

    const todoList = await createTodoList(userId!, name)

    res
      .status(201)
      .json({ message: 'Todo list created successfully', todoList })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
