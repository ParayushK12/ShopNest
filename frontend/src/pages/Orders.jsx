import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login?redirect=orders");
            return;
        }

        const fetchMyOrders = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/orders/myorders", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${user.token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to retrieve orders.");
                }

                const data = await res.json();
                // Extract orders array from backend response structure: { orders: [...] }
                setOrders(data.orders || []);
            } catch (err) {
                console.error(err);
                setError("Unable to connect to order server.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="container text-center" style={{ padding: "80px 0" }}>
                <p style={{ letterSpacing: "1px" }}>Loading order history...</p>
            </div>
        );
    }

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "20px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
                My Orders
            </h1>

            {error && <div className="alert-box">{error}</div>}

            {orders.length === 0 ? (
                <div className="text-center" style={{ padding: "80px 0" }}>
                    <p style={{ color: "#666", marginBottom: "20px" }}>
                        You haven't placed any orders yet.
                    </p>
                    <Link to="/products" className="btn btn-black" style={{ maxWidth: "240px" }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            {/* Card Header metadata */}
                            <div className="order-card-header">
                                <div>
                                    Order Placed
                                    <strong>{
                                        order.createdAt 
                                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : new Date(parseInt(order._id.substring(0, 8), 16) * 1000).toLocaleDateString("en-IN", {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                    }</strong>
                                </div>
                                <div>
                                    Total Amount
                                    <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                                </div>
                                <div>
                                    Payment ID
                                    <strong style={{ textTransform: "none", fontSize: "12px", fontFamily: "monospace" }}>
                                        {order.paymentId || "N/A"}
                                    </strong>
                                </div>
                                <div>
                                    Reference ID
                                    <strong style={{ textTransform: "none", fontSize: "12px", fontFamily: "monospace" }}>
                                        {order._id}
                                    </strong>
                                </div>
                                <div className="text-right">
                                    Status
                                    <div>
                                        <span className={`order-status-badge ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Items inline */}
                            <div className="order-items-grid">
                                {order.products.map((item, index) => (
                                    <div key={index} className="order-item-inline">
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            {item.product?.imageURL && (
                                                <img
                                                    src={item.product.imageURL}
                                                    alt={item.product.name}
                                                    style={{ width: "50px", height: "65px", objectFit: "cover", border: "1px solid #e5e5e5" }}
                                                />
                                            )}
                                            <div>
                                                <div style={{ fontWeight: "500" }}>
                                                    {item.product?.name || "Unknown Product"}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                                                    Quantity: {item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {item.product?.price && (
                                                <strong>₹{item.product.price.toLocaleString("en-IN")}</strong>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Orders;
