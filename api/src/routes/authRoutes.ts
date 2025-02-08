import express from 'express'

import { register } from '../controllers/authController'
import { validate } from '../middlewares/validate'
import { registerSchema } from '../schemas/authSchema'

const router = express.Router()

router.post('/register', validate(registerSchema), register)

export default router
