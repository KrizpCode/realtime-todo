import { z } from 'zod'

export const createTodoListSchema = z.object({
  name: z.string().nonempty('Name is required')
})

export type CreateTodoListFormData = z.infer<typeof createTodoListSchema>
