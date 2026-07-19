import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Parse redirect query param
    const query = new URLSearchParams(location.search);
    const redirect = query.get("redirect") || "/";

    // If already logged in, redirect immediately
    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [user, navigate, redirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401 && data.unverified) {
                    navigate(`/register?verify=true&email=${encodeURIComponent(data.email)}&redirect=${encodeURIComponent(redirect)}`);
                    return;
                }
                throw new Error(data.message || "Invalid credentials. Please try again.");
            }

            // Save user data in AuthContext (stores in state & localStorage)
            login(data);
            navigate(redirect);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="auth-page">
                <h2 className="auth-title">Sign In</h2>

                {error && <div className="alert-box">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <Link
                    to={redirect !== "/" ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}
                    className="form-footer-link"
                >
                    New to season.? Create an account
                </Link>
            </div>
        </main>
    );
};

export default Login;
