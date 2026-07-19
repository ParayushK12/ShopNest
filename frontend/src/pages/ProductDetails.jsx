import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form inputs
    const [selectedSize, setSelectedSize] = useState("");
    const [sizeError, setSizeError] = useState(false);
    const [addedToBagMessage, setAddedToBagMessage] = useState(false);

    // Accordion toggle states
    const [openAccordions, setOpenAccordions] = useState({
        description: true,
        shipping: false,
        care: false,
    });

    const toggleAccordion = (section) => {
        setOpenAccordions((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) {
                    throw new Error("Product details not found");
                }
                const data = await res.json();
                console.log('Product data:', data);
                console.log('Image URL:', data.imageURL);
                setProduct(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Unable to find the requested product.");
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [id]);

    const handleAddToBag = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        setSizeError(false);
        addToCart(product, 1, selectedSize);
        setAddedToBagMessage(true);
        setTimeout(() => setAddedToBagMessage(false), 4000);
    };

    if (loading) {
        return (
            <div className="container text-center" style={{ padding: "80px 0" }}>
                <p style={{ letterSpacing: "1px" }}>Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container" style={{ padding: "60px 0" }}>
                <div className="alert-box text-center">{error || "Product not found."}</div>
                <div className="text-center" style={{ marginTop: "20px" }}>
                    <Link to="/products" className="btn btn-black" style={{ width: "200px" }}>
                        Back to Catalog
                    </Link>
                </div>
            </div>
        );
    }

    const sizes = ["S", "M", "L", "XL"];

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "20px" }}>
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/products">Catalog</Link>
                <span>/</span>
                <span style={{ color: "#000" }}>{product.category}</span>
            </div>

            {/* Split PDP Layout */}
            <div className="pdp-container">
                {/* Left side: Hero Image Display */}
                <div className="pdp-gallery">
                    <div className="pdp-main-image">
                        <img 
                            src={product.imageURL} 
                            alt={product.name}
                            onError={(e) => {
                                console.error('Image failed to load:', product.imageURL);
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#f5f5f5;color:#999;font-size:14px;">Image not available</div>';
                            }}
                        />
                    </div>
                </div>

                {/* Right side: Sticky details column */}
                <div className="pdp-details-sidebar">
                    <div>
                        <span className="pdp-brand">season. exclusive</span>
                        <h1 className="pdp-name">{product.name}</h1>
                        <div className="pdp-price">₹{product.price.toLocaleString("en-IN")}</div>
                    </div>

                    {/* Size Selection Section */}
                    <div className="pdp-size-section">
                        <div className="pdp-size-title">
                            <span>Select Size</span>
                            <span style={{ textDecoration: "underline", cursor: "pointer", fontSize: "11px" }}>
                                Size Guide
                            </span>
                        </div>

                        {sizeError && (
                            <p style={{ color: "#d93838", fontSize: "12px", marginBottom: "10px", fontWeight: "500" }}>
                                Please select a size before adding to bag.
                            </p>
                        )}

                        <div className="size-selector-grid">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-option-btn ${selectedSize === size ? "selected" : ""}`}
                                    onClick={() => {
                                        setSelectedSize(size);
                                        setSizeError(false);
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="pdp-actions-row">
                        {addedToBagMessage && (
                            <div className="success-box text-center">
                                Added to bag successfully! <Link to="/cart" style={{ textDecoration: "underline", fontWeight: "600" }}>View Shopping Bag</Link>
                            </div>
                        )}

                        <button className="btn btn-black" onClick={handleAddToBag}>
                            Add to Bag
                        </button>

                        <button
                            className="btn btn-outline"
                            onClick={() => toggleWishlist(product)}
                            style={{ display: "flex", gap: "10px" }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={isInWishlist(product._id) ? "#e02424" : "none"}
                                stroke={isInWishlist(product._id) ? "#e02424" : "currentColor"}
                                strokeWidth="1.5"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            {isInWishlist(product._id) ? "Wishlisted" : "Add to Wishlist"}
                        </button>
                    </div>

                    {/* Collapse Accordion Blocks */}
                    <div className="pdp-accordions">
                        {/* 1. Description */}
                        <div className="pdp-accordion-item">
                            <div className="pdp-accordion-header" onClick={() => toggleAccordion("description")}>
                                <span>Description & Fit</span>
                                <span>{openAccordions.description ? "—" : "+"}</span>
                            </div>
                            {openAccordions.description && (
                                <div className="pdp-accordion-content">
                                    <p>{product.description}</p>
                                    <p style={{ marginTop: "10px" }}>
                                        • Model is wearing size M<br />
                                        • Clean modern stitching details<br />
                                        • Designed for relaxed elegant drape
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 2. Shipping */}
                        <div className="pdp-accordion-item">
                            <div className="pdp-accordion-header" onClick={() => toggleAccordion("shipping")}>
                                <span>Shipping & Free Returns</span>
                                <span>{openAccordions.shipping ? "—" : "+"}</span>
                            </div>
                            {openAccordions.shipping && (
                                <div className="pdp-accordion-content">
                                    <p>
                                        We offer express worldwide shipping. Free deliveries on orders above ₹5,000.
                                    </p>
                                    <p style={{ marginTop: "10px" }}>
                                        Returns are free of charge within 14 days of receipt. Items must be unworn and in their original packaging with security tags intact.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 3. Composition */}
                        <div className="pdp-accordion-item">
                            <div className="pdp-accordion-header" onClick={() => toggleAccordion("care")}>
                                <span>Composition & Care</span>
                                <span>{openAccordions.care ? "—" : "+"}</span>
                            </div>
                            {openAccordions.care && (
                                <div className="pdp-accordion-content">
                                    <p>
                                        • 100% premium extra-long staple fiber cotton / raw indigo selvedge denim.<br />
                                        • Machine wash cold, dry flat in shade.<br />
                                        • Iron medium temperature if needed.<br />
                                        • Ethically constructed at our boutique partner factories.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
