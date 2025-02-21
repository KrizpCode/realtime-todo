import { z } from 'zod'

export const createTodoListSchema = z.object({
  name: z.string().nonempty('Name is required')
})

export type CreateTodoListDto = z.infer<typeof createTodoListSchema>
