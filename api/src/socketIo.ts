import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'

let io: SocketServer

export const initializeSocketIo = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('joinTodoList', (todoListUUID: string) => {
      socket.join(todoListUUID)
      console.log(`Client ${socket.id} joined todo list ${todoListUUID}`)
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
    })
  })

  return io
}

export const getSocketIo = () => io
