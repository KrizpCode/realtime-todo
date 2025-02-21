import express from 'express'

import {
  getAuthenticatedUser,
  login,
  logout,
  register
} from '../controllers/authController'
import { validate } from '../middlewares/validate'
import { loginSchema, registerSchema } from '../schemas/authSchemas'
import { authenticateUser } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.get('/me', authenticateUser, getAuthenticatedUser)

export default router
