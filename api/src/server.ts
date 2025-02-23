import dotenv from 'dotenv'
import http from 'http'

import app from './app'
import { initializeSocketIo } from './socketIo'

dotenv.config()

const port = process.env.PORT || 5000
const server = http.createServer(app)

initializeSocketIo(server)

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
