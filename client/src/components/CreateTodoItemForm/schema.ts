import { z } from 'zod'

export const createTodoItemSchema = z.object({
  text: z.string().nonempty('Name is required').max(500, 'Name is too long')
})

export type CreateTodoItemFormData = z.infer<typeof createTodoItemSchema>
