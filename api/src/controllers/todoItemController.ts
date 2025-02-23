import { Response } from 'express'

import { CreateTodoItemSchema } from '../schemas/todoItemSchemas'
import { createTodoitem } from '../services/todoItemService'
import { TypedRequestBody } from '../types/request'

export const createTodoItemHandler = async (
  req: TypedRequestBody<CreateTodoItemSchema>,
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
