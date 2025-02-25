import { z } from 'zod'

export const createTodoListSchema = z.object({
  name: z
    .string()
    .nonempty('Name is required')
    .max(255, 'Name cannot be longer than 255 characters')
})

export type CreateTodoListDto = z.infer<typeof createTodoListSchema>
