import { z } from 'zod'

export const createTodoItemSchema = z.object({
  text: z.string().nonempty('Name is required')
})

export type CreateTodoItemFormData = z.infer<typeof createTodoItemSchema>
