import { Link } from "react-router-dom";

const Home = () => {
    return (
        <main className="container" style={{ minHeight: "80vh" }}>
            {/* Hero Banners Grid (Men / Women Editorial Split) */}
            <section className="home-hero">
                <div className="hero-banner">
                    <img
                        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80"
                        alt="Women's Collection"
                    />
                    <div className="hero-content">
                        <h2>The Women's Edit</h2>
                        <p>Modern silhouettes, fluid silk shirts, wide-leg denims, and ribbed cotton tees.</p>
                        <Link to="/products?gender=Women" className="hero-btn">
                            Shop Women
                        </Link>
                    </div>
                </div>

                <div className="hero-banner">
                    <img
                        src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&auto=format&fit=crop&q=80"
                        alt="Men's Collection"
                    />
                    <div className="hero-content">
                        <h2>The Men's Edit</h2>
                        <p>Japanese selvedge denims, crisp linen and oxford shirts, pique polo shirts, and clean oversized tees.</p>
                        <Link to="/products?gender=Men" className="hero-btn">
                            Shop Men
                        </Link>
                    </div>
                </div>
            </section>

            {/* Shop by Category Section */}
            <section style={{ marginTop: "60px" }}>
                <h3 className="section-title">Shop by Category</h3>
                <div className="category-grid">
                    <Link to="/products?category=T-Shirts" className="category-card">
                        <img
                            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80"
                            alt="T-Shirts"
                        />
                        <div className="category-title">T-Shirts</div>
                    </Link>

                    <Link to="/products?category=Shirts" className="category-card">
                        <img
                            src="https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&auto=format&fit=crop&q=80"
                            alt="Shirts"
                        />
                        <div className="category-title">Shirts</div>
                    </Link>

                    <Link to="/products?category=Polo Shirts" className="category-card">
                        <img
                            src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=80"
                            alt="Polo Shirts"
                        />
                        <div className="category-title">Polo Shirts</div>
                    </Link>

                    <Link to="/products?category=Denims" className="category-card">
                        <img
                            src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=80"
                            alt="Denims"
                        />
                        <div className="category-title">Denims</div>
                    </Link>
                </div>
            </section>

            {/* Season editorial statement */}
            <section style={{ margin: "80px auto 40px auto", maxWidth: "800px", textAlign: "center" }}>
                <h4 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600", marginBottom: "16px" }}>
                    season. Editorial Statement
                </h4>
                <p style={{ fontSize: "16px", fontWeight: "300", color: "#666", lineHeight: "1.8", fontStyle: "italic" }}>
                    "A curation of everyday essential wear crafted from the finest materials. We believe in simplicity, enduring silhouettes, and sustainability. Every piece in the collection is designed to develop character and age gracefully with the wearer."
                </p>
            </section>
        </main>
    );
};

export default Home;
