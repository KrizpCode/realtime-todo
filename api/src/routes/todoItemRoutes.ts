import express from 'express'

import { authenticateUser } from '../middlewares/authMiddleware'
import { createTodoItemHandler } from '../controllers/todoItemController'

const router = express.Router()

router.post('/', authenticateUser, createTodoItemHandler)

export default router
