import Razorpay from 'razorpay'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

export const createOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const options = {
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex')
        }

        const order = await instance.orders.create(options)
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const verifyOrder = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body

        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        expectedSignature.update(body.toString())

        if (expectedSignature.digest('hex') !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid signature' })
        }

        res.status(200).json({ message: 'Payment successful' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}