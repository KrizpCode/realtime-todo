import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from './routes/authRoutes'
import todoListRoutes from './routes/todoListRoutes'
import todoItemRoutes from './routes/todoItemRoutes'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://johan-realtime-todo.vercel.app'],
    credentials: true
  })
)

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/todo-lists', todoListRoutes)
app.use('/api/todo-items', todoItemRoutes)

export default app
