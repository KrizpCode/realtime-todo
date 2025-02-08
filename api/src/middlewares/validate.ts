import { NextFunction, Request, Response } from 'express'
import { TypeOf, ZodError, ZodSchema } from 'zod'

const formatZodErrors = (zodError: ZodError) => {
  const formattedErrors: Record<string, string> = {}

  zodError.errors.forEach((error) => {
    const field = error.path[0] as string
    const message = error.message
    formattedErrors[field] = message
  })

  return formattedErrors
}

export const validate = <T extends ZodSchema>(schema: T) => {
  return (
    req: Request<object, object, TypeOf<T>>,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error)
      res.status(400).json({ errors: formattedErrors })
      return
    }

    next()
  }
}
