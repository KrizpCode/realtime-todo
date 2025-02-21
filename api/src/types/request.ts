import { Request } from 'express'

export type TypedRequestBody<T> = Request<object, object, T>

declare module 'express' {
  interface Request {
    userId?: number
  }
}
