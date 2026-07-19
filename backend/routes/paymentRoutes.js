import express from 'express'
import {
    createOrder,
    verifyOrder
} from '../controllers/paymentController.js'
import protect from '../middlewares/authMiddleware.js'
import { validate, createPaymentOrderSchema, verifyPaymentSchema } from '../middlewares/validate.js'

const router = express.Router();

router.post('/order', protect, validate(createPaymentOrderSchema), createOrder)
router.post('/verify', protect, validate(verifyPaymentSchema), verifyOrder)

export default router