import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const CustomerService = () => {
    const location = useLocation();
    const [faqOpen, setFaqOpen] = useState({
        shipping: true,
        returns: false,
        payment: false,
        sizing: false,
        terms: false,
    });

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const toggleFaq = (key) => {
        setFaqOpen((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    useEffect(() => {
        const hash = location.hash;
        if (hash) {
            const key = hash.replace("#", "");
            setFaqOpen({
                shipping: key === "shipping" || key === "delivery",
                returns: key === "returns",
                payment: key === "payment",
                sizing: key === "sizing",
                terms: key === "terms",
            });
        }
    }, [location.hash]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (name.trim() && email.trim() && message.trim()) {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/auth/support", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, message }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to submit support request.");
                }

                setFormSubmitted(true);
                setTimeout(() => setFormSubmitted(false), 8000);
                setName("");
                setEmail("");
                setMessage("");
            } catch (err) {
                setError(err.message || "Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "40px" }}>
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span>/</span>
                <span style={{ color: "#000" }}>Customer Service</span>
            </div>

            {/* Page Header */}
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "300", textTransform: "uppercase", letterSpacing: "2px" }}>
                    Contact & Customer Support
                </h1>
                <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
                    We are here to help. Reach out to our team or find answers in our frequently asked questions.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", marginBottom: "80px" }}>
                {/* Left side: FAQs */}
                <div>
                    <h2 style={{ fontSize: "18px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "25px" }}>
                        Frequently Asked Questions
                    </h2>

                    <div className="pdp-accordions" style={{ marginTop: 0, borderTop: "1px solid #e5e5e5" }}>
                        {/* FAQ 1 */}
                        <div className="pdp-accordion-item" id="delivery">
                            <div className="pdp-accordion-header" onClick={() => toggleFaq("shipping")}>
                                <span>How long will my delivery take?</span>
                                <span>{faqOpen.shipping ? "—" : "+"}</span>
                            </div>
                            {faqOpen.shipping && (
                                <div className="pdp-accordion-content">
                                    All orders are processed and shipped within 1-2 business days. Domestic shipping takes 3-5 business days. International deliveries usually take 5-9 business days depending on customs.
                                </div>
                            )}
                        </div>

                        {/* FAQ 2 */}
                        <div className="pdp-accordion-item" id="returns">
                            <div className="pdp-accordion-header" onClick={() => toggleFaq("returns")}>
                                <span>What is your return & exchange policy?</span>
                                <span>{faqOpen.returns ? "—" : "+"}</span>
                            </div>
                            {faqOpen.returns && (
                                <div className="pdp-accordion-content">
                                    We offer free returns and exchanges within 14 days of delivery. All garments must be returned in unworn, unwashed condition with all original tags attached.
                                </div>
                            )}
                        </div>

                        {/* FAQ 3 */}
                        <div className="pdp-accordion-item">
                            <div className="pdp-accordion-header" onClick={() => toggleFaq("payment")}>
                                <span>Which payment methods do you accept?</span>
                                <span>{faqOpen.payment ? "—" : "+"}</span>
                            </div>
                            {faqOpen.payment && (
                                <div className="pdp-accordion-content">
                                    We accept all major credit cards, debit cards, UPI, and net banking via our secure Razorpay integration.
                                </div>
                            )}
                        </div>

                        {/* FAQ 4 */}
                        <div className="pdp-accordion-item">
                            <div className="pdp-accordion-header" onClick={() => toggleFaq("sizing")}>
                                <span>How do I know my correct size?</span>
                                <span>{faqOpen.sizing ? "—" : "+"}</span>
                            </div>
                            {faqOpen.sizing && (
                                <div className="pdp-accordion-content">
                                    Please refer to our Sizing Guide on the product page. Most of our clothing runs true to size. If you are between sizes, we recommend ordering a size up for a relaxed fit.
                                </div>
                            )}
                        </div>

                        {/* FAQ 5 */}
                        <div className="pdp-accordion-item" id="terms">
                            <div className="pdp-accordion-header" onClick={() => toggleFaq("terms")}>
                                <span>Terms & Conditions</span>
                                <span>{faqOpen.terms ? "—" : "+"}</span>
                            </div>
                            {faqOpen.terms && (
                                <div className="pdp-accordion-content">
                                    By using our website, you agree to comply with and be bound by our terms and conditions. All orders are subject to acceptance and availability. We reserve the right to cancel orders or limit quantities at our discretion.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right side: Contact Form */}
                <div style={{ padding: "40px", border: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
                        Submit a Request
                    </h2>

                    {formSubmitted ? (
                        <div className="success-box text-center" style={{ padding: "20px" }}>
                            <strong>Message sent successfully!</strong><br />
                            Our support representative will respond to your inquiry via email within 24 hours.
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            {error && (
                                <div className="error-box" style={{ marginBottom: "15px", padding: "10px", fontSize: "13px", border: "1px solid #ffcccb", backgroundColor: "#fff5f5", color: "#d8000c" }}>
                                    {error}
                                </div>
                            )}
                            <div className="form-group">
                                <label>Your Name</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    disabled={loading}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    className="input-field" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    disabled={loading}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Message / Question</label>
                                <textarea 
                                    className="input-field" 
                                    rows="5" 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    style={{ resize: "none", fontFamily: "inherit" }}
                                    disabled={loading}
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-black" style={{ marginTop: "10px" }} disabled={loading}>
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
};

export default CustomerService;
