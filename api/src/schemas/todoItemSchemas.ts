import { z } from 'zod'

export const createTodoItemSchema = z.object({
  text: z.string().nonempty('Name is required'),
  listId: z.number().positive()
})

export type CreateTodoItemSchema = z.infer<typeof createTodoItemSchema>
