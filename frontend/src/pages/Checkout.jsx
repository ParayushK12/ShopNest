import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Address fields
    const [fullName, setFullName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("India");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState("");

    // Calculate final total
    const deliveryFee = cartTotal >= 5000 ? 0 : 250;
    const finalTotal = cartTotal + deliveryFee;

    // Check login state and empty cart state
    useEffect(() => {
        if (!user) {
            navigate("/login?redirect=checkout");
            return;
        }
        if (cartItems.length === 0 && !paymentSuccess) {
            navigate("/cart");
        }
    }, [user, cartItems, navigate, paymentSuccess]);

    // Load Razorpay Script dynamically
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayAndPlaceOrder = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            setError("Razorpay SDK failed to load. Please check your internet connection.");
            setLoading(false);
            return;
        }

        try {
            // 1. Create a Razorpay Order in the backend
            const res = await fetch("/api/payment/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: finalTotal }),
            });

            if (!res.ok) {
                throw new Error("Unable to create Razorpay payment order. Try again.");
            }

            const razorpayOrder = await res.json();

            // 2. Open Razorpay Checkout Dialog
            const options = {
                key: "rzp_test_TFI4NXWT7z9vOK", // Razorpay Test Key ID
                amount: razorpayOrder.amount, // in paisa
                currency: razorpayOrder.currency,
                name: "season.",
                description: "Purchase of designer clothing items",
                image: "/season_favicon.svg",
                order_id: razorpayOrder.id,
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#0B0B0B",
                },
                handler: async function (response) {
                    try {
                        setLoading(true);
                        // 3. Verify Payment Signature
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verificationData = await verifyRes.json();

                        if (!verifyRes.ok) {
                            throw new Error(verificationData.message || "Payment verification failed.");
                        }

                        // 4. Create Order in database via Order API
                        // Format products list for DB schema
                        const productsPayload = cartItems.map((item) => ({
                            product: item.product._id,
                            quantity: item.quantity,
                        }));

                        const orderPayload = {
                            address: { fullName, street, city, postalCode, country },
                            totalAmount: finalTotal,
                            paymentId: response.razorpay_payment_id,
                            products: productsPayload,
                        };

                        const orderRes = await fetch("/api/orders", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${user.token}`,
                            },
                            body: JSON.stringify(orderPayload),
                        });

                        const orderData = await orderRes.json();

                        if (!orderRes.ok) {
                            throw new Error(orderData.message || "Error finalizing the order.");
                        }

                        // 5. Successful State Update
                        setPlacedOrderId(orderData.order._id);
                        setPaymentSuccess(true);
                        clearCart();
                    } catch (err) {
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (paymentSuccess) {
        return (
            <main className="container text-center" style={{ padding: "80px 0", minHeight: "80vh" }}>
                <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                    {/* Success Icon */}
                    <div style={{ margin: "0 auto 20px auto", color: "#10b981", display: "flex", justifyContent: "center" }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h2 style={{ fontSize: "24px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                        Order Placed Successfully
                    </h2>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "30px", lineHeight: "1.6" }}>
                        Thank you for shopping with us! Your payment is confirmed. We have sent a confirmation invoice to <strong>{user?.email}</strong>.
                    </p>
                    <div style={{ padding: "16px", backgroundColor: "#fafafa", border: "1px solid #e5e5e5", marginBottom: "30px", fontSize: "13px" }}>
                        <strong>Order Reference:</strong> #{placedOrderId}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Link to="/orders" className="btn btn-black">
                            View My Orders
                        </Link>
                        <Link to="/products" className="btn btn-outline">
                            Keep Shopping
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "20px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
                Secure Checkout
            </h1>

            {error && <div className="alert-box">{error}</div>}

            <form onSubmit={handlePayAndPlaceOrder} className="checkout-layout">
                {/* Left Side: Delivery Details Form */}
                <div className="cart-items-list">
                    <div className="checkout-section">
                        <h3>Delivery Address</h3>
                        <div className="form-group">
                            <label htmlFor="name">Consignee Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="input-field"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="E.g. John Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="street">Street & Apartment Info</label>
                            <input
                                type="text"
                                id="street"
                                className="input-field"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                placeholder="E.g. Apartment 4B, 12 Park Avenue"
                                required
                            />
                        </div>

                        <div className="checkout-grid-2">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    className="input-field"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Mumbai"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="zip">ZIP / Postal Code</label>
                                <input
                                    type="text"
                                    id="zip"
                                    className="input-field"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    placeholder="400001"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                className="input-field"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="India"
                                required
                            />
                        </div>
                    </div>

                    {/* Order summary item rows */}
                    <div className="checkout-section">
                        <h3>Review Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {cartItems.map((item, index) => (
                                <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                    <span style={{ color: "#666" }}>
                                        {item.product.name} (Size: {item.size}) x {item.quantity}
                                    </span>
                                    <strong>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Price Summary and Checkout Action */}
                <div>
                    <div className="summary-box">
                        <h3 className="summary-title">Order Total</h3>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                        </div>

                        <div className="summary-row total-row">
                            <span>Total (INR)</span>
                            <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-black"
                            disabled={loading || cartItems.length === 0}
                            style={{ marginTop: "20px" }}
                        >
                            {loading ? "Processing Secure Checkout..." : "Place Order & Pay"}
                        </button>

                        <div style={{ marginTop: "16px", fontSize: "11px", color: "#666", textAlign: "center", lineHeight: "1.4" }}>
                            By placing this order you agree to our 14-day return and refund policy. Transactions are processed securely via 256-bit encryption.
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default Checkout;
