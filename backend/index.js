import 'dotenv/config';
import express from 'express'
import cors from 'cors'

import connectDB from './config/db.js';
import './config/cloudinary.js';
import userRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'


connectDB()

const app = express();
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('backend running!')
})

app.use('/api/auth', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})