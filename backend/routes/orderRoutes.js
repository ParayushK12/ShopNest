import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminMiddleware.js'
import { createOrder, getOrders, myOrders, updateOrderStatus } from '../controllers/orderController.js'
const router = express.Router()

router.route('/').post(protect, createOrder).get(protect, admin, getOrders)
router.route('/myorders').get(protect, myOrders)
router.route('/:id/status').put(protect, admin, updateOrderStatus)

export default router