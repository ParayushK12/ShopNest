import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminMiddleware.js'
import { getproducts, getProductById, createProduct,updateProduct, deleteProduct } from '../controllers/productContoller.js';
import { validate, createProductSchema, updateProductSchema, productIdParamSchema } from '../middlewares/validate.js';
import multer from 'multer';


const upload = multer({dest: 'uploads/'})

const router = express.Router()

router.route('/')
  .get(getproducts)
  .post(protect, admin, upload.single('image'), validate(createProductSchema), createProduct);

router.route('/:id')
  .get(validate(productIdParamSchema), getProductById)
  .put(protect, admin, upload.single('image'), validate(updateProductSchema), updateProduct)
  .delete(protect, admin, validate(productIdParamSchema), deleteProduct);


export default router