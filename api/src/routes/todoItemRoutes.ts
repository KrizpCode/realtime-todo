import express from 'express'

import { authenticateUser } from '../middlewares/authMiddleware'
import {
  createTodoItemHandler,
  updateTodoItemHandler
} from '../controllers/todoItemController'

const router = express.Router()

router.post('/', authenticateUser, createTodoItemHandler)
router.put('/:todoItemId', authenticateUser, updateTodoItemHandler)

export default router
