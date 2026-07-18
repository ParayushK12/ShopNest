import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import userRoutes from './routes/authRoutes.js'
dotenv.config();

connectDB()

const app = express();
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('backend running!')
})

app.use('/api/auth',userRoutes)
app.use('/api/products',productRoutes)
app.use()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})