import express from 'express'
import { registerUser, loginUser, getUsers, contactSupport } from '../controllers/authController.js'
import protect from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminMiddleware.js'
import { validate, registerSchema, loginSchema, supportSchema } from '../middlewares/validate.js'
const router = express.Router()

router.post('/register', validate(registerSchema), registerUser)
router.post('/login', validate(loginSchema), loginUser)
router.get('/users', protect, admin, getUsers)
router.post('/support', validate(supportSchema), contactSupport)

export default router