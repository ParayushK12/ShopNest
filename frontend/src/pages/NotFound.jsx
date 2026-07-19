import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "80px", maxWidth: "800px" }}>
            {/* Wordmark Branding */}
            <div style={{ marginBottom: "40px" }}>
                <img src="/season_logo_black.svg" alt="season." style={{ height: "48px", width: "auto" }} />
            </div>

            {/* Error Message Header */}
            <h1 style={{ fontSize: "28px", fontWeight: "600", textTransform: "none", letterSpacing: "-0.5px", marginBottom: "24px" }}>
                Sorry, this page doesn't exist
            </h1>

            {/* Explanatory Description */}
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "40px", maxWidth: "420px" }}>
                This may be because the link has expired or the website is experiencing a few issues behind the scenes.
            </p>

            {/* Navigation options list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontSize: "14px", fontWeight: "600" }}>
                <Link to="/products?sort=newest" style={{ textDecoration: "none", borderBottom: "1px solid transparent", width: "fit-content" }}>
                    New In
                </Link>
                <Link to="/products" style={{ textDecoration: "none", borderBottom: "1px solid transparent", width: "fit-content" }}>
                    Clothing
                </Link>
                <Link to="/" style={{ textDecoration: "none", borderBottom: "1px solid transparent", width: "fit-content" }}>
                    Back to home
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
