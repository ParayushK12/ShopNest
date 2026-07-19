import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminMiddleware.js'
import { createOrder, getOrders, myOrders, updateOrderStatus } from '../controllers/orderController.js'
import { validate, createOrderSchema, updateOrderStatusSchema } from '../middlewares/validate.js'
const router = express.Router()

router.route('/').post(protect, validate(createOrderSchema), createOrder).get(protect, admin, getOrders)
router.route('/myorders').get(protect, myOrders)
router.route('/:id/status').put(protect, admin, validate(updateOrderStatusSchema), updateOrderStatus)

export default router