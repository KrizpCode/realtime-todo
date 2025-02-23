import { Request } from 'express'

export type TypedRequest<T, U = object> = Request<U, object, T>

declare module 'express' {
  interface Request {
    userId?: number
  }
}
