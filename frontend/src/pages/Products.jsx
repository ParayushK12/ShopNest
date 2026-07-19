import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [priceRange, setPriceRange] = useState("all");
    const [sortBy, setSortBy] = useState("recommended");
    const [showSidebar, setShowSidebar] = useState(true);

    const { toggleWishlist, isInWishlist } = useWishlist();
    const location = useLocation();

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/products");
                if (!res.ok) {
                    throw new Error("Failed to load products");
                }
                const data = await res.json();
                console.log('All products:', data);
                console.log('Total products:', data.length);
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Unable to connect to the catalog database.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Set filters based on URL queries initially
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const genderQuery = params.get("gender");
        const categoryQuery = params.get("category");

        if (genderQuery) {
            setSelectedGenders([genderQuery]);
        } else {
            setSelectedGenders([]);
        }

        if (categoryQuery) {
            setSelectedCategories([categoryQuery]);
        } else {
            setSelectedCategories([]);
        }
    }, [location.search]);

    // Dynamic categories based on selected genders
    const getAvailableCategories = () => {
        const hasMen = selectedGenders.includes("Men");
        const hasWomen = selectedGenders.includes("Women");

        if (hasMen && !hasWomen) {
            return ["T-Shirts", "Shirts", "Polo Shirts", "Denims"];
        }
        if (hasWomen && !hasMen) {
            return ["Tops", "Skirts", "Denims"];
        }
        return ["T-Shirts", "Shirts", "Polo Shirts", "Tops", "Skirts", "Denims"];
    };

    // Apply filtering and sorting
    useEffect(() => {
        // Clean up selected categories that are not valid for the current gender selection
        const hasMen = selectedGenders.includes("Men");
        const hasWomen = selectedGenders.includes("Women");
        let validCats = ["T-Shirts", "Shirts", "Polo Shirts", "Tops", "Skirts", "Denims"];
        if (hasMen && !hasWomen) {
            validCats = ["T-Shirts", "Shirts", "Polo Shirts", "Denims"];
        } else if (hasWomen && !hasMen) {
            validCats = ["Tops", "Skirts", "Denims"];
        }

        const cleaned = selectedCategories.filter(cat => validCats.includes(cat));
        if (cleaned.length !== selectedCategories.length) {
            setSelectedCategories(cleaned);
            return;
        }

        let tempProducts = [...products];

        // 1. URL Search Parameter matching
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            tempProducts = tempProducts.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query)
            );
        }

        // 2. Sidebar Category Checkboxes
        if (selectedCategories.length > 0) {
            tempProducts = tempProducts.filter((p) =>
                selectedCategories.includes(p.category)
            );
        }

        // 3. Sidebar Gender Checkboxes
        if (selectedGenders.length > 0) {
            tempProducts = tempProducts.filter((p) => {
                const name = p.name.toLowerCase();
                const description = p.description.toLowerCase();
                const combined = name + " " + description;
                
                const isWomensProduct = combined.includes("women") || combined.includes("women's");
                const isMensProduct = (combined.includes("men") || combined.includes("men's")) && !isWomensProduct;

                return (
                    (selectedGenders.includes("Men") && isMensProduct) ||
                    (selectedGenders.includes("Women") && isWomensProduct)
                );
            });
        }

        // 4. Sidebar Price filter
        if (priceRange !== "all") {
            if (priceRange === "under2000") {
                tempProducts = tempProducts.filter((p) => p.price < 2000);
            } else if (priceRange === "2000to4000") {
                tempProducts = tempProducts.filter((p) => p.price >= 2000 && p.price <= 4000);
            } else if (priceRange === "over4000") {
                tempProducts = tempProducts.filter((p) => p.price > 4000);
            }
        }

        // 5. Sorting select
        if (sortBy === "priceLowHigh") {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceHighLow") {
            tempProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            tempProducts.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "newest") {
            tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredProducts(tempProducts);
    }, [products, selectedCategories, selectedGenders, priceRange, sortBy, location.search]);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleGenderChange = (gender) => {
        setSelectedGenders((prev) =>
            prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
        );
    };

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "20px" }}>
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span>/</span>
                <span style={{ color: "#000" }}>Clothing Catalog</span>
            </div>

            {/* Title / Info Row */}
            <div className="plp-header">
                <div className="plp-title-row">
                    <div>
                        <h1>season. collections</h1>
                        <p style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                            Discover minimal, luxury staples tailored from premium fibers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Toggle & Sorting */}
            <div className="plp-controls">
                <button className="filter-toggle-btn" onClick={() => setShowSidebar(!showSidebar)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    {showSidebar ? "Hide Filters" : "Show Filters"}
                </button>

                <div className="flex align-center">
                    <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginRight: "10px" }}>
                        Sort By
                    </span>
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="recommended">Our Picks</option>
                        <option value="newest">New In</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="rating">Customer Rating</option>
                    </select>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className={`plp-layout ${!showSidebar ? "hide-sidebar" : ""}`}>
                {/* Left Sidebar Filters */}
                {showSidebar && (
                    <aside className="filter-sidebar">
                        {/* Gender group */}
                        <div className="filter-group">
                            <div className="filter-group-header">Gender</div>
                            <div className="filter-list">
                                <label className="filter-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedGenders.includes("Women")}
                                        onChange={() => handleGenderChange("Women")}
                                    />
                                    Women
                                </label>
                                <label className="filter-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedGenders.includes("Men")}
                                        onChange={() => handleGenderChange("Men")}
                                    />
                                    Men
                                </label>
                            </div>
                        </div>

                        {/* Category group */}
                        <div className="filter-group">
                            <div className="filter-group-header">Category</div>
                            <div className="filter-list">
                                {getAvailableCategories().map((cat) => (
                                    <label key={cat} className="filter-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => handleCategoryChange(cat)}
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price group */}
                        <div className="filter-group">
                            <div className="filter-group-header">Price (INR)</div>
                            <div className="filter-list">
                                <label className="filter-item">
                                    <input
                                        type="radio"
                                        name="price"
                                        checked={priceRange === "all"}
                                        onChange={() => setPriceRange("all")}
                                        style={{ marginRight: "10px" }}
                                    />
                                    All Prices
                                </label>
                                <label className="filter-item">
                                    <input
                                        type="radio"
                                        name="price"
                                        checked={priceRange === "under2000"}
                                        onChange={() => setPriceRange("under2000")}
                                        style={{ marginRight: "10px" }}
                                    />
                                    Under ₹2,000
                                </label>
                                <label className="filter-item">
                                    <input
                                        type="radio"
                                        name="price"
                                        checked={priceRange === "2000to4000"}
                                        onChange={() => setPriceRange("2000to4000")}
                                        style={{ marginRight: "10px" }}
                                    />
                                    ₹2,000 - ₹4,000
                                </label>
                                <label className="filter-item">
                                    <input
                                        type="radio"
                                        name="price"
                                        checked={priceRange === "over4000"}
                                        onChange={() => setPriceRange("over4000")}
                                        style={{ marginRight: "10px" }}
                                    />
                                    Over ₹4,000
                                </label>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Right Products Catalog */}
                <section style={{ flex: 1 }}>
                    {loading ? (
                        <div className="text-center" style={{ padding: "60px 0" }}>
                            <p style={{ letterSpacing: "1px" }}>Loading season. catalog...</p>
                        </div>
                    ) : error ? (
                        <div className="alert-box text-center" style={{ margin: "40px 0" }}>
                            {error}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center" style={{ padding: "60px 0", color: "#666" }}>
                            <p style={{ letterSpacing: "1px" }}>No clothing items found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="product-card">
                                    {/* Image and Wishlist Toggle */}
                                    <div className="product-image-wrapper">
                                        <Link to={`/product/${product._id}`}>
                                            <img src={product.imageURL} alt={product.name} />
                                        </Link>
                                        <button
                                            className={`wishlist-btn-overlay ${
                                                isInWishlist(product._id) ? "active" : ""
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(product);
                                            }}
                                            title="Add to Wishlist"
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Info Block */}
                                    <Link to={`/product/${product._id}`} className="product-info">
                                        <span className="product-brand">season. exclusive</span>
                                        <span className="product-name">{product.name}</span>
                                        <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Products;
