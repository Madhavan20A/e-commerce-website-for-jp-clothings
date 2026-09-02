import { useState } from "react";
import { X, Lock, Plus, Trash2, Edit3, ShoppingBag, DollarSign, Package, AlertTriangle, CheckCircle, Tag, MessageCircle, RefreshCw } from "lucide-react";
import { COLORS, CATEGORIES, ADMIN_PASSCODE, DEFAULT_SIZES, DEFAULT_COLORS } from "../constants";
import { formatINR } from "../utils/storage";
import { generateWhatsAppLink } from "../utils/whatsapp";
import { ProductImage } from "./ProductCard";

export default function AdminDashboard({
    isOpen,
    onClose,
    products,
    orders,
    coupons,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onUpdateOrderStatus,
    onAddCoupon,
    onDeleteCoupon,
}) {
    const [authed, setAuthed] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [passcodeErr, setPasscodeErr] = useState(false);

    const [tab, setTab] = useState("overview"); // overview, add, inventory, orders, coupons

    // Product Form State
    const [editingId, setEditingId] = useState(null);
    const [productForm, setProductForm] = useState({
        name: "",
        category: "ladies",
        price: "",
        stock: "10",
        fabric: "Silk Blend",
        image: "",
        description: "",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Royal Maroon", "Antique Gold"],
    });
    const [productFormErr, setProductFormErr] = useState("");

    // Coupon Form State
    const [couponForm, setCouponForm] = useState({ code: "", type: "percent", value: "10", minOrder: "1000", description: "" });

    if (!isOpen) return null;

    const handleLogin = (e) => {
        e.preventDefault();
        if (passcode === ADMIN_PASSCODE) {
            setAuthed(true);
            setPasscodeErr(false);
        } else {
            setPasscodeErr(true);
        }
    };

    // Dashboard Metrics
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter((o) => (o.status || "Pending") === "Pending").length;
    const lowStockProducts = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
    const outOfStockProducts = products.filter((p) => (p.stock || 0) === 0).length;

    const handleSaveProduct = (e) => {
        e.preventDefault();
        if (!productForm.name.trim() || !productForm.price || Number(productForm.price) <= 0) {
            setProductFormErr("Enter a valid dress name and price.");
            return;
        }
        setProductFormErr("");

        const payload = {
            name: productForm.name.trim(),
            category: productForm.category,
            price: Number(productForm.price),
            stock: Number(productForm.stock || 0),
            fabric: productForm.fabric.trim(),
            image: productForm.image.trim(),
            description: productForm.description.trim(),
            sizes: productForm.sizes,
            colors: productForm.colors,
        };

        if (editingId) {
            onUpdateProduct({ ...payload, id: editingId });
            setEditingId(null);
        } else {
            onAddProduct(payload);
        }

        setProductForm({
            name: "",
            category: "ladies",
            price: "",
            stock: "10",
            fabric: "Silk Blend",
            image: "",
            description: "",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Royal Maroon", "Antique Gold"],
        });
        setTab("inventory");
    };

    const handleEditClick = (p) => {
        setEditingId(p.id);
        setProductForm({
            name: p.name || "",
            category: p.category || "ladies",
            price: String(p.price || ""),
            stock: String(p.stock !== undefined ? p.stock : 10),
            fabric: p.fabric || "",
            image: p.image || "",
            description: p.description || "",
            sizes: p.sizes || ["S", "M", "L"],
            colors: p.colors || ["Royal Maroon"],
        });
        setTab("add");
    };

    const handleCreateCoupon = (e) => {
        e.preventDefault();
        if (!couponForm.code.trim() || !couponForm.value) return;
        onAddCoupon({
            code: couponForm.code.trim().toUpperCase(),
            type: couponForm.type,
            value: Number(couponForm.value),
            minOrder: Number(couponForm.minOrder || 0),
            description: couponForm.description.trim() || `${couponForm.code} Discount Coupon`,
        });
        setCouponForm({ code: "", type: "percent", value: "10", minOrder: "1000", description: "" });
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 85, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }} />
            <div
                style={{
                    position: "relative",
                    background: COLORS.bgElevated,
                    border: `1px solid ${COLORS.line}`,
                    width: 900,
                    maxWidth: "100%",
                    maxHeight: "92vh",
                    overflowY: "auto",
                    borderRadius: 8,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${COLORS.goldGlow}`,
                    padding: 32,
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${COLORS.line}`, paddingBottom: 14 }}>
                    <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0, color: COLORS.goldLight }}>
                            JP CLOTHING Admin Dashboard
                        </h3>
                        <span style={{ fontSize: 12, color: COLORS.textMuted }}>Store Operations & Inventory Manager</span>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                        <X size={20} />
                    </button>
                </div>

                {!authed ? (
                    <form onSubmit={handleLogin} style={{ maxWidth: 360, margin: "40px auto", textAlign: "center" }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, color: COLORS.gold, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                            <Lock size={22} />
                        </div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.goldLight, margin: "0 0 8px" }}>
                            Unlock Shop Admin
                        </h4>
                        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>
                            Enter the admin passcode to manage inventory and view orders.
                        </p>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="Passcode (Default: jp2026)"
                            style={{ width: "100%", padding: "10px 14px", background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, color: COLORS.textLight, fontSize: 14, borderRadius: 4, marginBottom: 14, textAlign: "center" }}
                        />
                        {passcodeErr && <p style={{ fontSize: 12.5, color: COLORS.redError, margin: "0 0 12px" }}>Incorrect passcode. Try again.</p>}
                        <button
                            type="submit"
                            style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.goldDeep})`, color: COLORS.bgDark, fontWeight: 700, border: "none", padding: "12px", fontSize: 14, cursor: "pointer", borderRadius: 4, textTransform: "uppercase" }}
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                ) : (
                    <>
                        {/* Dashboard Tabs */}
                        <div style={{ display: "flex", gap: 12, borderBottom: `1px solid ${COLORS.lineSubtle}`, marginBottom: 24, flexWrap: "wrap" }}>
                            {[
                                { id: "overview", label: "Overview Metrics" },
                                { id: "inventory", label: `Catalog & Inventory (${products.length})` },
                                { id: "add", label: editingId ? "Edit Product" : "Add New Dress" },
                                { id: "orders", label: `Customer Orders (${orders.length})` },
                                { id: "coupons", label: `Coupons (${coupons.length})` },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        if (t.id !== "add") setEditingId(null);
                                        setTab(t.id);
                                    }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "8px 12px",
                                        fontSize: 13.5,
                                        fontWeight: tab === t.id ? 600 : 400,
                                        color: tab === t.id ? COLORS.goldLight : COLORS.textMuted,
                                        borderBottom: tab === t.id ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* TAB 1: OVERVIEW METRICS */}
                        {tab === "overview" && (
                            <div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
                                    <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, padding: 18, borderRadius: 6 }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: COLORS.textMuted, fontSize: 12.5, marginBottom: 8 }}>
                                            <span>Total Revenue</span>
                                            <DollarSign size={18} color={COLORS.gold} />
                                        </div>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: COLORS.goldLight }}>
                                            {formatINR(totalSales)}
                                        </div>
                                    </div>

                                    <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, padding: 18, borderRadius: 6 }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: COLORS.textMuted, fontSize: 12.5, marginBottom: 8 }}>
                                            <span>Total Orders</span>
                                            <ShoppingBag size={18} color={COLORS.gold} />
                                        </div>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: COLORS.goldLight }}>
                                            {orders.length}
                                        </div>
                                        <span style={{ fontSize: 11.5, color: COLORS.textMuted }}>{pendingOrders} Pending confirmation</span>
                                    </div>

                                    <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, padding: 18, borderRadius: 6 }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: COLORS.textMuted, fontSize: 12.5, marginBottom: 8 }}>
                                            <span>Catalog Products</span>
                                            <Package size={18} color={COLORS.gold} />
                                        </div>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: COLORS.goldLight }}>
                                            {products.length}
                                        </div>
                                        <span style={{ fontSize: 11.5, color: outOfStockProducts > 0 ? COLORS.redError : COLORS.textMuted }}>
                                            {outOfStockProducts} Out of stock | {lowStockProducts} Low stock
                                        </span>
                                    </div>
                                </div>

                                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: COLORS.goldLight, marginBottom: 14 }}>
                                    Recent Orders
                                </h4>
                                {orders.length === 0 ? (
                                    <p style={{ color: COLORS.textMuted, fontSize: 13.5 }}>No customer orders placed yet.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {orders.slice(0, 5).map((o) => (
                                            <div key={o.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, padding: 12, borderRadius: 4, fontSize: 13 }}>
                                                <div>
                                                    <strong style={{ color: COLORS.textLight }}>{o.customer.name}</strong> ({o.id})
                                                    <div style={{ fontSize: 11.5, color: COLORS.textMuted }}>{o.customer.phone} · {o.items.length} items</div>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <div style={{ fontWeight: 700, color: COLORS.goldLight }}>{formatINR(o.total)}</div>
                                                    <span style={{ fontSize: 11, background: COLORS.bgElevated, color: COLORS.gold, padding: "2px 6px", borderRadius: 3 }}>{o.status || "Pending"}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: CATALOG & INVENTORY */}
                        {tab === "inventory" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {products.length === 0 ? (
                                    <p style={{ color: COLORS.textMuted }}>No dresses in catalog.</p>
                                ) : (
                                    products.map((p) => (
                                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, padding: 12, borderRadius: 6 }}>
                                            <ProductImage src={p.image} alt={p.name} style={{ width: 48, height: 60, objectFit: "cover", borderRadius: 4 }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.textLight }}>{p.name}</div>
                                                <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                                                    Category: <strong style={{ color: COLORS.gold }}>{p.category}</strong> | Price: <strong style={{ color: COLORS.goldLight }}>{formatINR(p.price)}</strong> | Fabric: {p.fabric || "N/A"}
                                                </div>
                                                <div style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 2 }}>
                                                    Sizes: {(p.sizes || []).join(", ")} | Colors: {(p.colors || []).join(", ")}
                                                </div>
                                            </div>

                                            {/* Stock Edit Controls */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bgElevated, border: `1px solid ${COLORS.lineSubtle}`, padding: "4px 8px", borderRadius: 4 }}>
                                                <span style={{ fontSize: 12, color: COLORS.textMuted }}>Stock:</span>
                                                <input
                                                    type="number"
                                                    value={p.stock !== undefined ? p.stock : 0}
                                                    onChange={(e) => {
                                                        const val = Math.max(0, parseInt(e.target.value) || 0);
                                                        onUpdateProduct({ ...p, stock: val });
                                                    }}
                                                    style={{ width: 54, background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.goldLight, fontWeight: 700, padding: "2px 4px", borderRadius: 3, textAlign: "center" }}
                                                />
                                            </div>

                                            <button onClick={() => handleEditClick(p)} style={{ background: "none", border: "none", color: COLORS.gold, cursor: "pointer" }} title="Edit Product">
                                                <Edit3 size={17} />
                                            </button>

                                            <button onClick={() => onDeleteProduct(p.id)} style={{ background: "none", border: "none", color: COLORS.redError, cursor: "pointer" }} title="Delete Product">
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* TAB 3: ADD / EDIT PRODUCT */}
                        {tab === "add" && (
                            <form onSubmit={handleSaveProduct} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Dress Name *</label>
                                    <input
                                        type="text"
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        placeholder="e.g. Royal Maroon Silk Lehenga"
                                        style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4, marginBottom: 14 }}
                                    />

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Category</label>
                                            <select
                                                value={productForm.category}
                                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4 }}
                                            >
                                                {CATEGORIES.map((c) => (
                                                    <option key={c.id} value={c.id} style={{ background: COLORS.bgCard }}>{c.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Price (INR) *</label>
                                            <input
                                                type="text"
                                                value={productForm.price}
                                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value.replace(/[^0-9]/g, "") })}
                                                placeholder="3500"
                                                style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4 }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                                        <div>
                                            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Stock Quantity</label>
                                            <input
                                                type="number"
                                                value={productForm.stock}
                                                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                                placeholder="10"
                                                style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4 }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Fabric / Material</label>
                                            <input
                                                type="text"
                                                value={productForm.fabric}
                                                onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                                                placeholder="Kanjivaram Silk"
                                                style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4 }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Photo (Upload File or Paste Image URL)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (up) => setProductForm({ ...productForm, image: up.target.result });
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}
                                        />
                                        <input
                                            type="text"
                                            value={productForm.image}
                                            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                            placeholder="https://images.unsplash.com/..."
                                            style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4, marginBottom: 14 }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Available Sizes (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={(productForm.sizes || []).join(", ")}
                                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                                        placeholder="S, M, L, XL, XXL"
                                        style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4, marginBottom: 14 }}
                                    />

                                    <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Available Colors (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={(productForm.colors || []).join(", ")}
                                        onChange={(e) => setProductForm({ ...productForm, colors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })}
                                        placeholder="Royal Maroon, Antique Gold"
                                        style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4, marginBottom: 14 }}
                                    />

                                    <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Description</label>
                                    <textarea
                                        rows={4}
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        placeholder="Describe weaving, fitting, occasion..."
                                        style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4, marginBottom: 14, fontFamily: "'Jost', sans-serif" }}
                                    />

                                    {productFormErr && <p style={{ fontSize: 12.5, color: COLORS.redError }}>{productFormErr}</p>}

                                    <button
                                        type="submit"
                                        style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.goldDeep})`, color: COLORS.bgDark, fontWeight: 700, border: "none", padding: "12px", fontSize: 14, cursor: "pointer", borderRadius: 4, textTransform: "uppercase" }}
                                    >
                                        {editingId ? "Update Product" : "Save & Add to Catalog"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 4: CUSTOMER ORDERS */}
                        {tab === "orders" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {orders.length === 0 ? (
                                    <p style={{ color: COLORS.textMuted }}>No customer orders placed yet.</p>
                                ) : (
                                    orders.map((o) => {
                                        const waUrl = generateWhatsAppLink(o);
                                        return (
                                            <div key={o.id} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, padding: 16, borderRadius: 6 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, borderBottom: `1px solid ${COLORS.lineSubtle}`, paddingBottom: 10 }}>
                                                    <div>
                                                        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.goldLight }}>Order #{o.id}</span>
                                                        <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 10 }}>{new Date(o.date).toLocaleString("en-IN")}</span>
                                                    </div>

                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        {/* Status Changer */}
                                                        <select
                                                            value={o.status || "Pending"}
                                                            onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                                                            style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.gold}`, color: COLORS.goldLight, fontWeight: 600, padding: "4px 8px", borderRadius: 4, fontSize: 12 }}
                                                        >
                                                            {["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map((st) => (
                                                                <option key={st} value={st} style={{ background: COLORS.bgCard }}>{st}</option>
                                                            ))}
                                                        </select>

                                                        <a
                                                            href={waUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ background: "#25D366", color: "#fff", padding: "4px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                                                        >
                                                            <MessageCircle size={14} /> WhatsApp
                                                        </a>
                                                    </div>
                                                </div>

                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
                                                    <div style={{ fontSize: 12.5, color: COLORS.textMuted }}>
                                                        <div>Customer: <strong style={{ color: COLORS.textLight }}>{o.customer.name}</strong></div>
                                                        <div>Phone: <strong style={{ color: COLORS.goldLight }}>{o.customer.phone}</strong></div>
                                                        <div>Address: {o.customer.address}, {o.customer.city} - {o.customer.pincode}</div>
                                                        <div>Payment: {o.paymentMethod || "COD"}</div>
                                                    </div>

                                                    <div style={{ background: COLORS.bgElevated, padding: 10, borderRadius: 4, fontSize: 12 }}>
                                                        <div style={{ fontWeight: 600, color: COLORS.goldLight, marginBottom: 4 }}>Items Ordered:</div>
                                                        {o.items.map((it, idx) => (
                                                            <div key={idx} style={{ color: COLORS.textLight, marginBottom: 2 }}>
                                                                • {it.name} ({it.selectedSize || "M"} / {it.selectedColor || "Maroon"}) x {it.qty} = {formatINR(it.price * it.qty)}
                                                            </div>
                                                        ))}
                                                        <div style={{ textAlign: "right", fontWeight: 700, color: COLORS.goldLight, marginTop: 6, paddingTop: 4, borderTop: `1px dashed ${COLORS.lineSubtle}` }}>
                                                            Total: {formatINR(o.total)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {/* TAB 5: COUPONS */}
                        {tab === "coupons" && (
                            <div>
                                <form onSubmit={handleCreateCoupon} style={{ display: "flex", gap: 10, marginBottom: 24, background: COLORS.bgCard, padding: 14, borderRadius: 6, border: `1px solid ${COLORS.lineSubtle}` }}>
                                    <input
                                        type="text"
                                        placeholder="COUPON CODE"
                                        value={couponForm.code}
                                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                                        style={{ padding: "8px 12px", background: COLORS.bgElevated, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4, textTransform: "uppercase" }}
                                    />
                                    <select
                                        value={couponForm.type}
                                        onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}
                                        style={{ padding: "8px 12px", background: COLORS.bgElevated, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4 }}
                                    >
                                        <option value="percent">% Discount</option>
                                        <option value="flat">Flat ₹ Discount</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Discount Value"
                                        value={couponForm.value}
                                        onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
                                        style={{ width: 120, padding: "8px 12px", background: COLORS.bgElevated, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4 }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Min Order (₹)"
                                        value={couponForm.minOrder}
                                        onChange={(e) => setCouponForm({ ...couponForm, minOrder: e.target.value })}
                                        style={{ width: 130, padding: "8px 12px", background: COLORS.bgElevated, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4 }}
                                    />
                                    <button type="submit" style={{ background: COLORS.gold, color: COLORS.bgDark, fontWeight: 700, border: "none", padding: "8px 16px", fontSize: 13, cursor: "pointer", borderRadius: 4 }}>
                                        Add Coupon
                                    </button>
                                </form>

                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {coupons.map((c) => (
                                        <div key={c.code} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, padding: 12, borderRadius: 6 }}>
                                            <div>
                                                <strong style={{ fontSize: 15, color: COLORS.goldLight }}>{c.code}</strong>
                                                <span style={{ fontSize: 12.5, color: COLORS.textMuted, marginLeft: 12 }}>
                                                    {c.type === "percent" ? `${c.value}% OFF` : `₹${c.value} OFF`} | Min Order: {formatINR(c.minOrder)}
                                                </span>
                                            </div>
                                            <button onClick={() => onDeleteCoupon(c.code)} style={{ background: "none", border: "none", color: COLORS.redError, cursor: "pointer" }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
