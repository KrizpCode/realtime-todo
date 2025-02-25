import dotenv from 'dotenv'
import http from 'http'

import app from './app'
import logger from './config/logger'
import { initializeSocketIo } from './socketIo'

dotenv.config()

const port = process.env.PORT || 5000
const server = http.createServer(app)

initializeSocketIo(server)

server.listen(port, () => {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? `https://api.taskmate.fun`
      : `http://localhost:${port}`

  logger.info(`Server is running at ${baseUrl}`)
})
