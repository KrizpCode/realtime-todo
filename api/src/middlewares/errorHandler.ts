import { NextFunction, Request, Response } from 'express'

import logger from '../config/logger'
import { ApiError } from '../errors/ApiError'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
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

      res.status(404).json({
        status: statusCode,
        message: `${resource} not found`
      })

      return
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
