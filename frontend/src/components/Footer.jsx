import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                {/* Column lists */}
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Customer Service</h4>
                        <ul>
                            <li><Link to="/customer-service">Contact & Help</Link></li>
                            <li><Link to="/customer-service#delivery">Orders & Delivery</Link></li>
                            <li><Link to="/customer-service#returns">Returns & Refunds</Link></li>
                            <li><Link to="/customer-service#terms">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>About season.</h4>
                        <ul>
                            <li><Link to="/our-story">Our Story</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Categories</h4>
                        <ul>
                            <li><Link to="/products?category=T-Shirts">T-Shirts</Link></li>
                            <li><Link to="/products?category=Shirts">Shirts</Link></li>
                            <li><Link to="/products?category=Polo Shirts">Polo Shirts</Link></li>
                            <li><Link to="/products?category=Tops">Tops</Link></li>
                            <li><Link to="/products?category=Skirts">Skirts</Link></li>
                            <li><Link to="/products?category=Denims">Denims</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Newsletter</h4>
                        <p style={{ fontSize: "13px", color: "#666666" }}>
                            Sign up for the latest trends, arrivals, and exclusive collections.
                        </p>
                        {subscribed ? (
                            <div className="success-box" style={{ marginTop: "10px", padding: "8px", fontSize: "12px" }}>
                                Thank you for subscribing!
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="newsletter-form">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="newsletter-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="newsletter-btn">
                                    Join
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footnotes */}
                <div className="footer-bottom">
                    <div>&copy; {new Date().getFullYear()} season. All rights reserved.</div>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <Link to="/customer-service#terms">Privacy Policy</Link>
                        <Link to="/customer-service#terms">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
