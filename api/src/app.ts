import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import requestLogger from './middlewares/requestLogger'
import authRoutes from './routes/authRoutes'
import todoListRoutes from './routes/todoListRoutes'
import todoItemRoutes from './routes/todoItemRoutes'

const app = express()

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://app.taskmate.fun'
        : ['http://localhost:3000'],
    credentials: true
  })
)

app.use(express.json())
app.use(cookieParser())

app.use(requestLogger)

app.use('/api/auth', authRoutes)
app.use('/api/todo-lists', todoListRoutes)
app.use('/api/todo-items', todoItemRoutes)

export default app
