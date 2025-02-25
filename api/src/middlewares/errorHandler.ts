import { NextFunction, Request, Response } from 'express'

import logger from '../config/logger'
import { ApiError } from '../errors/ApiError'

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500

  logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${err.message}`)

  res.status(statusCode).json({
    status: statusCode,
    message: err.message || 'Internal Server Error'
  })
}
