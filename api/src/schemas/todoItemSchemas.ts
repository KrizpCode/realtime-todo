import { z } from 'zod'

export const createTodoItemSchema = z.object({
  text: z.string().nonempty('Name is required'),
  listId: z.number().positive()
})

export type CreateTodoItemDto = z.infer<typeof createTodoItemSchema>

export const updateTodoItemSchema = z.object({
  text: z.string().nonempty('Name is required').max(500, 'Text is too long'),
  completed: z.boolean()
})

export type UpdateTodoItemDto = z.infer<typeof updateTodoItemSchema>
