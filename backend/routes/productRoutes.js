import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminMiddleware.js'
import { getproducts, getProductById, createProduct,updateProduct, deleteProduct } from '../controllers/productContoller.js';
import multer from 'multer';


const upload = multer({dest: 'uploads/'})

const router = express.Router()

router.route('/').get(getproducts).post(protect,admin,upload.single('image'),createProduct);
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);


export default router