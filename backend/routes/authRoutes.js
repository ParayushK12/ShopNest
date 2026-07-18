import express from 'express'
import {registerUser,loginUser,getUsers} from '../controllers/authController.js'
import protect from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminMiddleware.js'
const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/users',protect,admin,getUsers)

export default router