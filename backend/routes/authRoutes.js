import express from 'express'
import { registerUser, loginUser, getUsers, contactSupport, verifyOTP, resendOTP } from '../controllers/authController.js'
import protect from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminMiddleware.js'
import { validate, registerSchema, loginSchema, supportSchema, verifyOtpSchema, resendOtpSchema } from '../middlewares/validate.js'
const router = express.Router()

router.post('/register', validate(registerSchema), registerUser)
router.post('/login', validate(loginSchema), loginUser)
router.get('/users', protect, admin, getUsers)
router.post('/support', validate(supportSchema), contactSupport)
router.post('/verify-otp', validate(verifyOtpSchema), verifyOTP)
router.post('/resend-otp', validate(resendOtpSchema), resendOTP)

export default router