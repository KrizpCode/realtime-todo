import { ApiError } from './ApiError'

export class AuthenticationError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}
