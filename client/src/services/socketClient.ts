import { io } from 'socket.io-client'

const VITE_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

const socketClient = io(VITE_API_BASE_URL, {
  withCredentials: true
})

export default socketClient
