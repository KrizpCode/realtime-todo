import { ApiError } from './ApiError'

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404)
  }
}
