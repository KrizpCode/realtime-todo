import express from 'express'

import { authenticateUser } from '../middlewares/authMiddleware'
import {
  createTodoListHandler,
  getTodoListByUUIDHandler,
  getTodoListsHandler
} from '../controllers/todoListControllers'

const router = express.Router()

router.post('/', authenticateUser, createTodoListHandler)
router.get('/', authenticateUser, getTodoListsHandler)
router.get('/:uuid', authenticateUser, getTodoListByUUIDHandler)

export default router
