import { Response } from 'express'

import { CreateTodoItemSchema } from '../schemas/todoItemSchemas'
import { createTodoitem, updateTodoItem } from '../services/todoItemService'
import { TypedRequest } from '../types/request'

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

    await updateTodoItem(Number(todoItemId), completed)

    res.status(200).json({ message: 'Todo item updated successfully' })
  } catch {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
