import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import logger from './config/logger'

let io: SocketServer

export const initializeSocketIo = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? 'https://app.taskmate.fun'
          : ['http://localhost:3000'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`)

    socket.on('joinTodoList', (todoListUUID: string) => {
      socket.join(todoListUUID)
      logger.info(`Client ${socket.id} joined todo list ${todoListUUID}`)
    })

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`)
    })
  })

  return io
}

export const getSocketIo = () => io
