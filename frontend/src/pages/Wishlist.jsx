import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
    const { wishlistItems, toggleWishlist } = useWishlist();

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "20px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
                Wishlist / Favorites ({wishlistItems.length})
            </h1>

            {wishlistItems.length === 0 ? (
                <div className="text-center" style={{ padding: "80px 0" }}>
                    <p style={{ color: "#666", marginBottom: "20px", letterSpacing: "0.5px" }}>
                        Your wishlist is currently empty.
                    </p>
                    <Link to="/products" className="btn btn-black" style={{ maxWidth: "240px" }}>
                        Discover Collections
                    </Link>
                </div>
            ) : (
                <div className="product-grid">
                    {wishlistItems.map((product) => (
                        <div key={product._id} className="product-card">
                            {/* Image and remove overlay */}
                            <div className="product-image-wrapper">
                                <Link to={`/product/${product._id}`}>
                                    <img src={product.imageURL} alt={product.name} />
                                </Link>
                                <button
                                    className="wishlist-btn-overlay active"
                                    onClick={() => toggleWishlist(product)}
                                    title="Remove from Wishlist"
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* Details */}
                            <div className="product-info" style={{ marginBottom: "10px" }}>
                                <span className="product-brand">season. exclusive</span>
                                <span className="product-name">{product.name}</span>
                                <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
                            </div>

                            {/* CTA Action button */}
                            <Link
                                to={`/product/${product._id}`}
                                className="btn btn-outline"
                                style={{ padding: "10px 16px", fontSize: "12px", textTransform: "uppercase" }}
                            >
                                Shop Item
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Wishlist;
