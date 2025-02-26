import { NextFunction, Request, Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import logger from '../config/logger'
import { ApiError } from '../errors/ApiError'
import { getResourceNameFromPath } from '../helpers/resourceHelpers'

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500
  let message = 'Internal Server Error'

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      const resource = getResourceNameFromPath(req)

      statusCode = 404
      message = `${resource} not found`
    }
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
  }

  logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${err.message}`)

  res.status(statusCode).json({
    status: statusCode,
    message
  })
}
