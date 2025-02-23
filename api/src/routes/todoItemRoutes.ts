import express from 'express'

import { authenticateUser } from '../middlewares/authMiddleware'
import {
  createTodoItemHandler,
  deleteTodoItemHandler,
  updateTodoItemHandler
} from '../controllers/todoItemController'

const router = express.Router()

router.post('/', authenticateUser, createTodoItemHandler)
router.put('/:todoItemId', authenticateUser, updateTodoItemHandler)
router.delete('/:todoItemId', authenticateUser, deleteTodoItemHandler)

export default router
