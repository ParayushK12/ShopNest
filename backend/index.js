import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import connectDB from './config/db.js';
import './config/cloudinary.js';
import userRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import { errorHandler } from './middlewares/validate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB()

const app = express();
app.use(cors())
app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

// Serve frontend build static files in production
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

app.get('*splat', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
