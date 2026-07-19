import Order from "../model/Order.js";
import sendMail from "../utils/sendMail.js";

export const createOrder = async (req, res) => {
  try {
    const { address, totalAmount, paymentId, products } = req.body;

    if (!products || products.length < 1) {
      return res.status(400).json({ message: "Invalid order data" })
    }

    const newOrder = await Order.create({
      user: req.user._id,
      address,
      totalAmount,
      paymentId,
      products,
    });

    const populatedOrder = await Order.findById(newOrder._id).populate("products.product");

    const itemsHtml = populatedOrder.products
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #333333;">
            ${item.product ? item.product.name : "Unknown Product"}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #333333; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #333333; text-align: right;">
            $${item.product ? item.product.price.toFixed(2) : "0.00"}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #333333; text-align: right;">
            $${item.product ? (item.product.price * item.quantity).toFixed(2) : "0.00"}
          </td>
        </tr>
      `
      )
      .join("");

    const message = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f6f8; -webkit-text-size-adjust: none; -ms-text-size-adjust: none;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e0e0e0;">
                <!-- Header -->
                <tr>
                  <td style="background-color: #6200ee; padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; color: #ffffff; font-weight: bold; letter-spacing: 1px;">ShopNest</h1>
                    <p style="margin: 10px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #e1d5ff;">Your order has been placed successfully!</p>
                  </td>
                </tr>
                
                <!-- Main Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333;">
                      Hi <strong>${req.user.name}</strong>,
                    </p>
                    <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #666666;">
                      Thank you for shopping with us! We have received your order and are currently preparing it for shipment. Below are your order details:
                    </p>
                    
                    <!-- Order Details Summary Card -->
                    <table width="100%" cellpadding="15" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px; border: 1px solid #eeeeee;">
                      <tr>
                        <td width="50%" valign="top" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999999; font-weight: bold; display: block; margin-bottom: 5px;">Order Details</span>
                          <strong>Order ID:</strong> #${newOrder._id}<br>
                          <strong>Payment ID:</strong> ${paymentId}
                        </td>
                        <td width="50%" valign="top" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
                          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999999; font-weight: bold; display: block; margin-bottom: 5px;">Shipping Address</span>
                          <strong>${newOrder.address.fullName}</strong><br>
                          ${newOrder.address.street}<br>
                          ${newOrder.address.city}, ${newOrder.address.postalCode}<br>
                          ${newOrder.address.country}
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Products Table -->
                    <h3 style="margin: 0 0 15px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; color: #333333; border-bottom: 2px solid #6200ee; padding-bottom: 8px;">Items Ordered</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                      <thead>
                        <tr>
                          <th align="left" style="padding: 12px; border-bottom: 2px solid #eeeeee; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                          <th align="center" style="padding: 12px; border-bottom: 2px solid #eeeeee; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; width: 60px;">Qty</th>
                          <th align="right" style="padding: 12px; border-bottom: 2px solid #eeeeee; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; width: 80px;">Price</th>
                          <th align="right" style="padding: 12px; border-bottom: 2px solid #eeeeee; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #999999; text-transform: uppercase; letter-spacing: 1px; width: 100px;">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                    
                    <!-- Total Amount -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="right" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; color: #333333; padding-top: 10px;">
                          <strong>Grand Total:</strong>
                          <span style="font-size: 22px; color: #6200ee; font-weight: bold; margin-left: 10px;">$${newOrder.totalAmount.toFixed(2)}</span>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f4f6f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0 0 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #999999; line-height: 1.5;">
                      If you have any questions about this order, please contact our support team.
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #999999;">
                      &copy; 2026 ShopNest. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await sendMail(req.user.email, "Order Created Successfully", message);

    return res.status(201).json({ message: "Order created successfully", order: newOrder });

  } catch (error) {
    return res.status(500).json({ message: 'error creating order', error: error.message })
  }
};

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product')
    return res.status(200).json({ orders })
  } catch (error) {
    return res.status(500).json({ message: 'error fetching orders', error: error.message })
  }
}

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('products.product', 'name price description');
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'error fetching orders', error: error.message });
  }
}


export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'order not found' })
    }

    const { status } = req.body

    if (status) {
      order.status = status
    }

    await order.save()
    return res.status(200).json({ message: 'order updated successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'error updating order', error: error.message })
  }
}