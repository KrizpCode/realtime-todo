import express from 'express'

import { authenticateUser } from '../middlewares/authMiddleware'
import {
  createTodoListHandler,
  getTodoListsHandler
} from '../controllers/todoListControllers'

const router = express.Router()

router.post('/', authenticateUser, createTodoListHandler)
router.get('/', authenticateUser, getTodoListsHandler)

export default router
