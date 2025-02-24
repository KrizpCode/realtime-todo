import express from 'express'

import { authenticateUser } from '../middlewares/authMiddleware'
import {
  createTodoItemHandler,
  deleteTodoItemHandler,
  updateTodoItemHandler
} from '../controllers/todoItemController'
import { validate } from '../middlewares/validate'
import {
  createTodoItemSchema,
  updateTodoItemSchema
} from '../schemas/todoItemSchemas'

const router = express.Router()

router.post(
  '/',
  authenticateUser,
  validate(createTodoItemSchema),
  createTodoItemHandler
)
router.put(
  '/:todoItemId',
  authenticateUser,
  validate(updateTodoItemSchema),
  updateTodoItemHandler
)
router.delete('/:todoItemId', authenticateUser, deleteTodoItemHandler)

export default router
