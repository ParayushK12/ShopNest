import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Tab control state
    const [activeTab, setActiveTab] = useState("stats");

    // Data states
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal forms states
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
    const [editingProductId, setEditingProductId] = useState("");

    // Form inputs
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("T-Shirts");
    const [stock, setStock] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");

    // Redirect if not admin
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    // Data Load functions
    const fetchStats = async () => {
        try {
            const res = await fetch("/api/analytics", {
                headers: { "Authorization": `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders", {
                headers: { "Authorization": `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Load initial data
    useEffect(() => {
        if (user && user.role === "admin") {
            const loadData = async () => {
                setLoading(true);
                await Promise.all([fetchStats(), fetchProducts(), fetchOrders()]);
                setLoading(false);
            };
            loadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Manage order status update
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchOrders();
                fetchStats();
            } else {
                alert("Failed to update status.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Manage product deletion
    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await fetch(`/api/products/${productId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${user.token}` },
                });

                if (res.ok) {
                    fetchProducts();
                    fetchStats();
                } else {
                    alert("Failed to delete product.");
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Trigger product modal for create
    const openCreateModal = () => {
        setModalMode("create");
        setName("");
        setPrice("");
        setDescription("");
        setCategory("T-Shirts");
        setStock("");
        setImageFile(null);
        setFormError("");
        setIsProductModalOpen(true);
    };

    // Trigger product modal for edit
    const openEditModal = (product) => {
        setModalMode("edit");
        setEditingProductId(product._id);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setCategory(product.category);
        setStock(product.stock);
        setImageFile(null);
        setFormError("");
        setIsProductModalOpen(true);
    };

    // Form submit product handler (supporting file upload)
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("stock", stock);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        const url = modalMode === "create" ? "/api/products" : `/api/products/${editingProductId}`;
        const method = modalMode === "create" ? "POST" : "PUT";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to save product details.");
            }

            setIsProductModalOpen(false);
            fetchProducts();
            fetchStats();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container text-center" style={{ padding: "80px 0" }}>
                <p style={{ letterSpacing: "1px" }}>Loading dashboard console...</p>
            </div>
        );
    }

    return (
        <main className="container" style={{ minHeight: "80vh", paddingTop: "20px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "400", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
                Admin Dashboard Control Panel
            </h1>

            {/* Admin Tabs headers */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab-btn ${activeTab === "stats" ? "active" : ""}`}
                    onClick={() => setActiveTab("stats")}
                >
                    Overview
                </button>
                <button
                    className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
                    onClick={() => setActiveTab("products")}
                >
                    Products List
                </button>
                <button
                    className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                >
                    Order Logs
                </button>
            </div>

            {/* SECTION 1: Stats Overview tab */}
            {activeTab === "stats" && stats && (
                <div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h5>Total Revenue</h5>
                            <p>₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="stat-card">
                            <h5>Total Users</h5>
                            <p>{stats.totalUsers}</p>
                        </div>
                        <div className="stat-card">
                            <h5>Catalog Products</h5>
                            <p>{stats.totalProducts}</p>
                        </div>
                        <div className="stat-card">
                            <h5>Orders Placed</h5>
                            <p>{stats.totalOrders}</p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
                        <div className="stat-card">
                            <h5 style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: "8px", marginBottom: "12px" }}>
                                Order Status Breakdown
                            </h5>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                                <div className="flex justify-between">
                                    <span>Pending Processing</span>
                                    <strong>{stats.totalPendingOrders}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipped Out</span>
                                    <strong>{stats.totalShippedOrders}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivered Successfully</span>
                                    <strong>{stats.totalDeliveredOrders}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 2: Manage Products Catalog tab */}
            {activeTab === "products" && (
                <div>
                    <div className="flex justify-between align-center" style={{ marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", textTransform: "uppercase" }}>Catalog Items ({products.length})</h3>
                        <button className="btn btn-black" onClick={openCreateModal} style={{ width: "200px", padding: "10px 16px", fontSize: "12px" }}>
                            + Add New Product
                        </button>
                    </div>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id}>
                                    <td>
                                        <img src={p.imageURL} alt={p.name} style={{ width: "40px", height: "50px", objectFit: "cover" }} />
                                    </td>
                                    <td><strong>{p.name}</strong></td>
                                    <td>{p.category}</td>
                                    <td>₹{p.price.toLocaleString("en-IN")}</td>
                                    <td>{p.stock} pcs</td>
                                    <td className="admin-actions-cell">
                                        <button onClick={() => openEditModal(p)}>Edit</button>
                                        <button onClick={() => handleDeleteProduct(p._id)} style={{ color: "#d93838", borderColor: "#fca5a5" }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* SECTION 3: Manage Orders tab */}
            {activeTab === "orders" && (
                <div>
                    <h3 style={{ fontSize: "16px", textTransform: "uppercase", marginBottom: "20px" }}>Placed Orders Logs ({orders.length})</h3>
                    {orders.length === 0 ? (
                        <p style={{ color: "#666" }}>No orders placed on the system yet.</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Items Count</th>
                                    <th>Revenue</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o._id}>
                                        <td><strong style={{ fontFamily: "monospace" }}>{o._id.substring(12)}...</strong></td>
                                        <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : new Date(parseInt(o._id.substring(0, 8), 16) * 1000).toLocaleDateString()}</td>
                                        <td>
                                            <div>{o.user?.name}</div>
                                            <div style={{ fontSize: "11px", color: "#666" }}>{o.user?.email}</div>
                                        </td>
                                        <td>{o.products.reduce((acc, curr) => acc + curr.quantity, 0)} items</td>
                                        <td>₹{o.totalAmount.toLocaleString("en-IN")}</td>
                                        <td>
                                            <select
                                                value={o.status}
                                                onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                                className={`order-status-badge ${o.status}`}
                                                style={{ border: "1px solid #ccc", padding: "4px 8px", cursor: "pointer", outline: "none", display: "inline-block" }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* MODAL WINDOW: Create/Edit Product */}
            {isProductModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="flex justify-between align-center" style={{ borderBottom: "1px solid #e5e5e5", paddingBottom: "10px", marginBottom: "20px" }}>
                            <h3 style={{ textTransform: "uppercase", fontSize: "16px" }}>
                                {modalMode === "create" ? "Add New Product" : "Edit Product details"}
                            </h3>
                            <button onClick={() => setIsProductModalOpen(false)} style={{ fontSize: "20px", cursor: "pointer", fontWeight: "300" }}>
                                &times;
                            </button>
                        </div>

                        {formError && <div className="alert-box">{formError}</div>}

                        <form onSubmit={handleProductSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <div className="form-group">
                                    <label>Price (INR)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Qty</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="input-field"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{ display: "block", appearance: "auto" }}
                                    required
                                >
                                    <option value="T-Shirts">T-Shirts</option>
                                    <option value="Shirts">Shirts</option>
                                    <option value="Polo Shirts">Polo Shirts</option>
                                    <option value="Tops">Tops</option>
                                    <option value="Skirts">Skirts</option>
                                    <option value="Denims">Denims</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="input-field"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ height: "100px", resize: "none" }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Product Image File</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    accept="image/*"
                                    style={{ fontSize: "13px" }}
                                    required={modalMode === "create"}
                                />
                                {modalMode === "edit" && (
                                    <p style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
                                        Leave empty to preserve existing image.
                                    </p>
                                )}
                            </div>

                            <button type="submit" className="btn btn-black" disabled={formLoading} style={{ marginTop: "10px" }}>
                                {formLoading ? "Saving Product..." : "Save Product Details"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AdminDashboard;
