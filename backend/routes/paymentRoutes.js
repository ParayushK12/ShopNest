import express from 'express'
import {
    createOrder,
    verifyOrder
} from '../controllers/paymentController.js'

const router = express.Router();

router.post('/order', createOrder)
router.post('/verify', verifyOrder)

export default router