import { z } from 'zod'

export const createTodoListSchema = z.object({
  name: z.string().nonempty('Name is required').max(255)
})

export type CreateTodoListFormData = z.infer<typeof createTodoListSchema>
