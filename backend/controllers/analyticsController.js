import Order from "../model/Order.js"
import User from "../model/User.js"
import Product from "../model/Product.js"


export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' })
        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()
        const totalDeliveredOrders = await Order.countDocuments({ status: 'delivered' })
        const totalPendingOrders = await Order.countDocuments({ status: 'pending' })
        const totalShippedOrders = await Order.countDocuments({ status: 'shipped' })
        
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
        const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].total : 0
        
        return res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalDeliveredOrders,
            totalPendingOrders,
            totalShippedOrders,
            totalRevenue: totalRevenueAmount
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching analytics stats', error: error.message })
    }
}