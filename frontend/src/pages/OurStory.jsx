import { Link } from "react-router-dom";

const OurStory = () => {
    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "40px" }}>
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span>/</span>
                <span style={{ color: "#000" }}>Our Story</span>
            </div>

            {/* Editorial Hero Header */}
            <section style={{ position: "relative", height: "450px", overflow: "hidden", marginBottom: "60px", backgroundColor: "#fafafa" }}>
                <img 
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80" 
                    alt="Our Story" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: "0.85" }}
                />
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "40px",
                    color: "#fff"
                }}>
                    <h1 style={{ fontSize: "36px", fontWeight: "300", textTransform: "uppercase", letterSpacing: "3px", margin: 0 }}>
                        Crafted for the Modern Wardrobe
                    </h1>
                    <p style={{ fontSize: "16px", marginTop: "10px", maxWidth: "600px", opacity: 0.9 }}>
                        We believe in the power of simplicity. Discover our journey in creating timeless staples from the world's finest fibers.
                    </p>
                </div>
            </section>

            {/* Core philosophy grid */}
            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginBottom: "80px" }}>
                <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>
                        Our Philosophy
                    </h2>
                    <p style={{ fontSize: "15px", color: "#444", lineHeight: "1.8", marginBottom: "20px" }}>
                        Founded in 2024, **season.** was born from a desire to strip away the noise of fast fashion. We set out to design a singular collection of high-quality, minimalist essentials that stand the test of time.
                    </p>
                    <p style={{ fontSize: "15px", color: "#444", lineHeight: "1.8" }}>
                        Every garment we create is a result of meticulous design, rigorous testing, and ethical manufacturing. We partner exclusively with family-owned boutiques and certified green mills to source premium extra-long staple cotton, linen, and traceably sourced wool.
                    </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div style={{ padding: "30px", border: "1px solid #e5e5e5", textAlign: "center", backgroundColor: "#fafafa" }}>
                        <h3 style={{ fontSize: "32px", fontWeight: "300", margin: 0 }}>100%</h3>
                        <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#666", letterSpacing: "1px", marginTop: "10px" }}>Traceable Fibers</p>
                    </div>
                    <div style={{ padding: "30px", border: "1px solid #e5e5e5", textAlign: "center", backgroundColor: "#fafafa" }}>
                        <h3 style={{ fontSize: "32px", fontWeight: "300", margin: 0 }}>12</h3>
                        <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#666", letterSpacing: "1px", marginTop: "10px" }}>Boutique Mills</p>
                    </div>
                    <div style={{ padding: "30px", border: "1px solid #e5e5e5", textAlign: "center", backgroundColor: "#fafafa" }}>
                        <h3 style={{ fontSize: "32px", fontWeight: "300", margin: 0 }}>Zero</h3>
                        <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#666", letterSpacing: "1px", marginTop: "10px" }}>Overproduction Waste</p>
                    </div>
                    <div style={{ padding: "30px", border: "1px solid #e5e5e5", textAlign: "center", backgroundColor: "#fafafa" }}>
                        <h3 style={{ fontSize: "32px", fontWeight: "300", margin: 0 }}>10k+</h3>
                        <p style={{ fontSize: "12px", textTransform: "uppercase", color: "#666", letterSpacing: "1px", marginTop: "10px" }}>Happy Customers</p>
                    </div>
                </div>
            </section>

            {/* Split Showcase section */}
            <section style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", marginBottom: "80px", alignItems: "center" }}>
                <div style={{ height: "400px", overflow: "hidden" }}>
                    <img 
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80" 
                        alt="Workspace" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
                <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>
                        Sustainably Produced
                    </h2>
                    <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", marginBottom: "20px" }}>
                        We design with longevity in mind. Our garments are made to be worn season after season. We work only with suppliers who share our dedication to minimal environmental impact.
                    </p>
                    <Link to="/products" className="btn btn-black" style={{ width: "200px" }}>
                        Explore Catalog
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default OurStory;
