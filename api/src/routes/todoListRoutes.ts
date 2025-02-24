import express from 'express'

import { authenticateUser } from '../middlewares/authMiddleware'
import {
  createTodoListHandler,
  getTodoListByUUIDHandler,
  getTodoListsHandler
} from '../controllers/todoListControllers'
import { validate } from '../middlewares/validate'
import { createTodoListSchema } from '../schemas/todoListSchemas'

const router = express.Router()

router.post(
  '/',
  authenticateUser,
  validate(createTodoListSchema),
  createTodoListHandler
)
router.get('/', authenticateUser, getTodoListsHandler)
router.get('/:uuid', authenticateUser, getTodoListByUUIDHandler)

export default router
