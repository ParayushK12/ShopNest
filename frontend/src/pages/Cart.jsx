import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
    const { cartItems, updateCartQty, removeFromCart, cartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const deliveryFee = cartTotal >= 5000 || cartTotal === 0 ? 0 : 250;
    const finalTotal = cartTotal + deliveryFee;

    const handleCheckoutRedirect = () => {
        if (user) {
            navigate("/checkout");
        } else {
            navigate("/login?redirect=checkout");
        }
    };

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "20px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
                Shopping Bag ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center" style={{ padding: "80px 0" }}>
                    <p style={{ color: "#666", marginBottom: "20px", letterSpacing: "0.5px" }}>
                        Your shopping bag is currently empty.
                    </p>
                    <Link to="/products" className="btn btn-black" style={{ maxWidth: "240px" }}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    {/* Left Column: Bag Items List */}
                    <div className="cart-items-list">
                        {cartItems.map((item, idx) => (
                            <div key={`${item.product._id}-${item.size}-${idx}`} className="cart-item-row">
                                {/* Item Image */}
                                <div className="cart-item-image">
                                    <Link to={`/product/${item.product._id}`}>
                                        <img src={item.product.imageURL} alt={item.product.name} />
                                    </Link>
                                </div>

                                {/* Item Details */}
                                <div className="cart-item-details">
                                    <div>
                                        <div className="cart-item-header">
                                            <div>
                                                <span className="cart-item-brand">season. exclusive</span>
                                                <h4 className="cart-item-name">
                                                    <Link to={`/product/${item.product._id}`}>
                                                        {item.product.name}
                                                    </Link>
                                                </h4>
                                            </div>
                                            <div style={{ fontWeight: "500", fontSize: "14px" }}>
                                                ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                            </div>
                                        </div>

                                        <div className="cart-item-meta">
                                            <span>Size: <strong>{item.size}</strong></span>
                                            <span>Price: ₹{item.product.price.toLocaleString("en-IN")}</span>
                                        </div>

                                        <div className="cart-item-qty-adjust">
                                            <button
                                                onClick={() =>
                                                    updateCartQty(item.product._id, item.size, item.quantity - 1)
                                                }
                                            >
                                                —
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    updateCartQty(item.product._id, item.size, item.quantity + 1)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <span
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(item.product._id, item.size)}
                                    >
                                        Remove item
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Checkout Pricing Summary */}
                    <div>
                        <div className="summary-box">
                            <h3 className="summary-title">Summary</h3>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery</span>
                                <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                            </div>

                            <div className="summary-row" style={{ fontSize: "12px", color: "#666" }}>
                                <span>Estimated Import Duties / Taxes</span>
                                <span>Included</span>
                            </div>

                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                            </div>

                            <button
                                className="btn btn-black"
                                onClick={handleCheckoutRedirect}
                                style={{ marginTop: "20px" }}
                            >
                                Go to Checkout
                            </button>

                            <div style={{ marginTop: "20px", fontSize: "11px", color: "#666", textAlign: "center", lineHeight: "1.4" }}>
                                We accept secure card transactions, net banking, and wallets processed through Razorpay.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;
