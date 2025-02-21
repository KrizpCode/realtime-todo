import express from 'express'

import { authenticateUser } from '../middlewares/authMiddleware'
import { createTodoListHandler } from '../controllers/todoListControllers'

const router = express.Router()

router.post('/', authenticateUser, createTodoListHandler)

export default router
