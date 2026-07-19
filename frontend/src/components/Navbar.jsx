import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const [searchQuery, setSearchQuery] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Helper to see if category matches gender URL filters
    const isGenderActive = (gender) => {
        const params = new URLSearchParams(location.search);
        return location.pathname === "/products" && params.get("gender") === gender;
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            {/* Promo Bar */}
            <div className="promo-bar">
                Free standard shipping on orders over ₹5,000 | Discover the Season collection
            </div>

            {/* Main Nav Row */}
            <nav className="nav-row">
                {/* Left Side: Gender Categories */}
                <div className="nav-left">
                    <Link
                        to="/products?gender=Women"
                        className={isGenderActive("Women") ? "active" : ""}
                    >
                        Women
                    </Link>
                    <Link
                        to="/products?gender=Men"
                        className={isGenderActive("Men") ? "active" : ""}
                    >
                        Men
                    </Link>
                    <Link
                        to="/products"
                        className={location.pathname === "/products" && !location.search ? "active" : ""}
                    >
                        All Clothing
                    </Link>
                </div>

                {/* Center: Brand Wordmark Logo */}
                <div className="nav-logo">
                    <Link to="/">
                        <img src="/season_logo_black.svg" alt="season." />
                    </Link>
                </div>

                {/* Right Side: Search & Utility Actions */}
                <div className="nav-right">
                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="search-container">
                        <input
                            type="text"
                            placeholder="Search clothing..."
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-icon-btn">
                            {/* Search Icon SVG */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </form>

                    {/* Navigation Action Links */}
                    <div className="nav-actions">
                        {/* Profile Dropdown */}
                        <div className="profile-menu-container" ref={profileRef}>
                            <button
                                className="nav-icon-link"
                                onClick={() => setProfileOpen(!profileOpen)}
                                aria-expanded={profileOpen}
                                aria-haspopup="true"
                                aria-label="Account menu"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>
                            {profileOpen && (
                                <div className="profile-dropdown" style={{ display: 'flex' }}>
                                    {user ? (
                                        <>
                                            <div style={{ padding: "8px 16px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", borderBottom: "1px solid #e5e5e5" }}>
                                                Hi, {user.name}
                                            </div>
                                            <Link to="/orders" onClick={() => setProfileOpen(false)}>My Orders</Link>
                                            {user.role === "admin" && (
                                                <Link to="/admin" onClick={() => setProfileOpen(false)}>Admin Dashboard</Link>
                                            )}
                                            <button onClick={() => { logout(); setProfileOpen(false); }} className="logout-btn">
                                                Log Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setProfileOpen(false)}>Sign In</Link>
                                            <Link to="/register" onClick={() => setProfileOpen(false)}>Create Account</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Wishlist Link */}
                        <Link to="/wishlist" className="nav-icon-link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="icon-badge">{wishlistCount}</span>
                            )}
                        </Link>

                        {/* Cart/Shopping Bag Link */}
                        <Link to="/cart" className="nav-icon-link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span className="icon-badge">{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;