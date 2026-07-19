import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // OTP states
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationMessage, setVerificationMessage] = useState("");

    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Parse redirect query param
    const query = new URLSearchParams(location.search);
    const redirect = query.get("redirect") || "/";

    // If already logged in, redirect immediately, or auto-toggle OTP mode
    useEffect(() => {
        if (user) {
            navigate(redirect);
        }

        const localQuery = new URLSearchParams(location.search);
        const verifyParam = localQuery.get("verify");
        const emailParam = localQuery.get("email");
        if (verifyParam === "true" && emailParam) {
            setIsVerifying(true);
            setVerificationEmail(emailParam);
        }
    }, [user, navigate, redirect, location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create account. Please check inputs.");
            }

            setVerificationEmail(email);
            setIsVerifying(true);
            setVerificationMessage(data.message || "OTP code sent to email.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: verificationEmail, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid or expired OTP code.");
            }

            login(data);
            navigate(redirect);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError("");
        setVerificationMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: verificationEmail }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to resend OTP.");
            }

            setVerificationMessage("A new OTP code has been sent to your email.");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="auth-page">
                {isVerifying ? (
                    <>
                        <h2 className="auth-title">Verify Email</h2>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", textAlign: "center" }}>
                            Please enter the 6-digit OTP code sent to <strong>{verificationEmail}</strong>.
                        </p>

                        {verificationMessage && <div className="success-box" style={{ marginBottom: "15px", padding: "10px", fontSize: "13px" }}>{verificationMessage}</div>}
                        {error && <div className="alert-box" style={{ marginBottom: "15px" }}>{error}</div>}

                        <form onSubmit={handleVerifyOtp}>
                            <div className="form-group">
                                <label htmlFor="otp">One-Time Password (OTP)</label>
                                <input
                                    type="text"
                                    id="otp"
                                    className="input-field"
                                    maxLength="6"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-black" disabled={loading} style={{ marginTop: "10px" }}>
                                {loading ? "Verifying..." : "Verify & Sign In"}
                            </button>
                        </form>

                        <button 
                            type="button" 
                            className="btn-link" 
                            disabled={loading} 
                            onClick={handleResendOtp}
                            style={{ display: "block", width: "100%", textAlign: "center", marginTop: "15px", background: "none", border: "none", color: "#666", cursor: "pointer", textDecoration: "underline", fontSize: "13px" }}
                        >
                            Resend OTP Code
                        </button>

                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => {
                                setIsVerifying(false);
                                setError("");
                                setVerificationMessage("");
                                setOtp("");
                            }}
                            style={{ display: "block", width: "100%", textAlign: "center", marginTop: "10px", background: "none", border: "none", color: "#000", cursor: "pointer", fontSize: "13px" }}
                        >
                            Back to Registration
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="auth-title">Create Account</h2>

                        {error && <div className="alert-box">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="input-field"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="input-field"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-black" disabled={loading} style={{ marginTop: "10px" }}>
                                {loading ? "Creating Account..." : "Register"}
                            </button>
                        </form>

                        <Link
                            to={redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
                            className="form-footer-link"
                        >
                            Already have an account? Sign In
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
};

export default Register;
