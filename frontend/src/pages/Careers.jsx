import { useState } from "react";
import { Link } from "react-router-dom";

const Careers = () => {
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("retail");

    const positions = [
        { id: 1, title: "Lead Textile Designer", dept: "Creative Studio", location: "New York, USA", type: "Full-Time" },
        { id: 2, title: "Operations & Supply Chain Manager", dept: "Operations", location: "New York, USA / Remote", type: "Full-Time" },
        { id: 3, title: "Senior React Frontend Developer", dept: "Engineering", location: "Remote", type: "Full-Time" },
        { id: 4, title: "Boutique Retail Assistant", dept: "Retail Experience", location: "London, UK", type: "Part-Time" },
    ];

    const handleSubmitApplication = (e) => {
        e.preventDefault();
        if (name.trim() && email.trim()) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 8000);
            setName("");
            setEmail("");
        }
    };

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "40px" }}>
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span>/</span>
                <span style={{ color: "#000" }}>Careers</span>
            </div>

            {/* Careers Title */}
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "300", textTransform: "uppercase", letterSpacing: "2px" }}>
                    Join the season. Team
                </h1>
                <p style={{ color: "#666", fontSize: "14px", marginTop: "10px", maxWidth: "600px", margin: "10px auto 0 auto" }}>
                    We're building a team of visionary creatives, meticulous craftsmen, and engineers who care deeply about minimal, beautiful design.
                </p>
            </div>

            {/* Open positions list */}
            <section style={{ marginBottom: "60px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "25px", borderBottom: "1px solid #e5e5e5", paddingBottom: "10px" }}>
                    Open Opportunities ({positions.length})
                </h2>
                <div style={{ display: "grid", gap: "20px" }}>
                    {positions.map((p) => (
                        <div key={p.id} className="stat-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e5e5e5", transition: "all 0.2s ease" }}>
                            <div>
                                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#666", letterSpacing: "1px", fontWeight: "600" }}>{p.dept}</span>
                                <h3 style={{ fontSize: "16px", fontWeight: "500", marginTop: "4px" }}>{p.title}</h3>
                                <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
                                    <span>{p.location}</span>
                                    <span style={{ margin: "0 10px" }}>•</span>
                                    <span>{p.type}</span>
                                </div>
                            </div>
                            <a href="#apply-form" className="btn btn-outline" style={{ width: "auto", padding: "10px 20px", fontSize: "12px" }}>
                                Apply Now
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Application Form */}
            <section id="apply-form" style={{ maxWidth: "600px", margin: "0 auto 80px auto", padding: "40px", border: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", textAlign: "center" }}>
                    Spontaneous Application
                </h2>
                <p style={{ fontSize: "13px", color: "#666", textAlign: "center", marginBottom: "30px" }}>
                    Don't see your role? Submit your profile below and we will contact you as soon as a fitting role opens.
                </p>

                {submitted ? (
                    <div className="success-box text-center" style={{ padding: "20px" }}>
                        <strong>Thank you for your application!</strong><br />
                        Our Talent Acquisition team will review your profile and get in touch with you shortly.
                    </div>
                ) : (
                    <form onSubmit={handleSubmitApplication}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                className="input-field" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
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
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Area of Interest</label>
                            <select 
                                className="input-field" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                style={{ backgroundColor: "#fff" }}
                            >
                                <option value="design">Design & Creative</option>
                                <option value="operations">Operations & Logistics</option>
                                <option value="engineering">Engineering & Tech</option>
                                <option value="retail">Boutique & Retail</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Link to Resume / Portfolio</label>
                            <input type="url" className="input-field" placeholder="https://linkedin.com/in/..." />
                        </div>
                        <button type="submit" className="btn btn-black" style={{ marginTop: "10px" }}>
                            Submit Application
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
};

export default Careers;
