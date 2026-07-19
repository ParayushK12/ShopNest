import express from 'express'
import {
    createOrder,
    verifyOrder
} from '../controllers/paymentController.js'
import { validate, createPaymentOrderSchema, verifyPaymentSchema } from '../middlewares/validate.js'

const router = express.Router();

router.post('/order', validate(createPaymentOrderSchema), createOrder)
router.post('/verify', validate(verifyPaymentSchema), verifyOrder)

export default router