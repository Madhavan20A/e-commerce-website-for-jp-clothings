import { useState } from "react";
import { X, CheckCircle, ShieldCheck, CreditCard, QrCode, Banknote } from "lucide-react";
import { COLORS } from "../constants";
import { formatINR } from "../utils/storage";

export default function CheckoutModal({ cart, pricing, isOpen, onClose, onConfirmOrder }) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "",
        notes: "",
        paymentMethod: "Cash on Delivery",
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Full name is required";

        // Phone validation (10 digits)
        const cleanPhone = form.phone.replace(/[^0-9]/g, "");
        if (!cleanPhone || cleanPhone.length < 10) {
            errs.phone = "Enter a valid 10-digit phone number";
        }

        // Email validation optional check if typed
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
            errs.email = "Enter a valid email address";
        }

        if (!form.address.trim()) errs.address = "Delivery address is required";
        if (!form.city.trim()) errs.city = "City is required";

        // Pincode validation (6 digits)
        const cleanPin = form.pincode.replace(/[^0-9]/g, "");
        if (!cleanPin || cleanPin.length !== 6) {
            errs.pincode = "Enter a valid 6-digit PIN code";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        onConfirmOrder({
            customer: { ...form },
            items: cart,
            subtotal: pricing.subtotal,
            discount: pricing.discount,
            deliveryCharge: pricing.deliveryCharge,
            total: pricing.total,
            paymentMethod: form.paymentMethod,
            status: "Pending",
        });
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }} />
            <div
                style={{
                    position: "relative",
                    background: COLORS.bgElevated,
                    border: `1px solid ${COLORS.line}`,
                    width: 780,
                    maxWidth: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    borderRadius: 8,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${COLORS.goldGlow}`,
                    padding: 32,
                }}
            >
                {/* Modal Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, borderBottom: `1px solid ${COLORS.line}`, paddingBottom: 14 }}>
                    <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0, color: COLORS.goldLight }}>
                            Express Checkout
                        </h3>
                        <span style={{ fontSize: 12, color: COLORS.textMuted }}>JP CLOTHING · Secure Order Placement</span>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 28 }}>
                    {/* Left: Customer Info Form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <h4 style={{ fontSize: 14, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>
                            1. Delivery Details
                        </h4>

                        <div>
                            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Full Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Priya Kumar"
                                style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${errors.name ? COLORS.redError : COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4 }}
                            />
                            {errors.name && <span style={{ fontSize: 11, color: COLORS.redError }}>{errors.name}</span>}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Phone Number *</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="10-digit mobile"
                                    style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${errors.phone ? COLORS.redError : COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4 }}
                                />
                                {errors.phone && <span style={{ fontSize: 11, color: COLORS.redError }}>{errors.phone}</span>}
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="name@example.com"
                                    style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${errors.email ? COLORS.redError : COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4 }}
                                />
                                {errors.email && <span style={{ fontSize: 11, color: COLORS.redError }}>{errors.email}</span>}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Delivery Street Address *</label>
                            <textarea
                                rows={2}
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                placeholder="House No, Building, Street Name, Area"
                                style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${errors.address ? COLORS.redError : COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13.5, borderRadius: 4, fontFamily: "'Jost', sans-serif" }}
                            />
                            {errors.address && <span style={{ fontSize: 11, color: COLORS.redError }}>{errors.address}</span>}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>City *</label>
                                <input
                                    type="text"
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${errors.city ? COLORS.redError : COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4 }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>State</label>
                                <input
                                    type="text"
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4 }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Pincode *</label>
                                <input
                                    type="text"
                                    value={form.pincode}
                                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                                    placeholder="600001"
                                    style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${errors.pincode ? COLORS.redError : COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4 }}
                                />
                                {errors.pincode && <span style={{ fontSize: 11, color: COLORS.redError }}>{errors.pincode}</span>}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Special Delivery Notes</label>
                            <input
                                type="text"
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                placeholder="e.g. Ring bell twice, deliver after 4 PM"
                                style={{ width: "100%", padding: "10px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 13, borderRadius: 4 }}
                            />
                        </div>

                        <h4 style={{ fontSize: 14, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1, margin: "10px 0 4px" }}>
                            2. Payment Method
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[
                                { id: "Cash on Delivery", label: "Cash on Delivery (COD)", icon: <Banknote size={16} /> },
                                { id: "UPI Payment", label: "UPI (GPay / PhonePe / PayTM)", icon: <QrCode size={16} /> },
                                { id: "Credit/Debit Card", label: "Online Card / NetBanking", icon: <CreditCard size={16} /> },
                            ].map((pm) => (
                                <label
                                    key={pm.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "10px 14px",
                                        background: form.paymentMethod === pm.id ? COLORS.goldGlow : COLORS.bgCard,
                                        border: `1px solid ${form.paymentMethod === pm.id ? COLORS.gold : COLORS.lineSubtle}`,
                                        borderRadius: 4,
                                        cursor: "pointer",
                                        fontSize: 13,
                                        color: form.paymentMethod === pm.id ? COLORS.goldLight : COLORS.textLight,
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={form.paymentMethod === pm.id}
                                        onChange={() => setForm({ ...form, paymentMethod: pm.id })}
                                        style={{ accentColor: COLORS.gold }}
                                    />
                                    {pm.icon}
                                    {pm.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Right: Order Summary & Place Order */}
                    <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, borderRadius: 6, padding: 20, display: "flex", flexDirection: "column" }}>
                        <h4 style={{ fontSize: 14, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 14px" }}>
                            Order Summary ({cart.length} items)
                        </h4>

                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", maxHeight: 220, marginBottom: 16, paddingRight: 4 }}>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{ display: "flex", justify: "space-between", fontSize: 12.5, borderBottom: `1px solid ${COLORS.lineSubtle}`, paddingBottom: 6 }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: COLORS.textLight }}>{item.name}</div>
                                        <div style={{ color: COLORS.textMuted, fontSize: 11 }}>
                                            {item.selectedSize} / {item.selectedColor} x {item.qty}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, color: COLORS.goldLight }}>
                                        {formatINR(item.price * item.qty)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: `1px solid ${COLORS.line}`, paddingTop: 12, fontSize: 13 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textMuted, marginBottom: 4 }}>
                                <span>Subtotal</span>
                                <span>{formatINR(pricing.subtotal)}</span>
                            </div>
                            {pricing.discount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", color: "#81C784", marginBottom: 4 }}>
                                    <span>Discount</span>
                                    <span>-{formatINR(pricing.discount)}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textMuted, marginBottom: 8 }}>
                                <span>Delivery</span>
                                <span>{pricing.deliveryCharge === 0 ? "FREE" : formatINR(pricing.deliveryCharge)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 700, color: COLORS.goldLight, borderTop: `1px dashed ${COLORS.line}`, paddingTop: 8, marginBottom: 18 }}>
                                <span>Total Amount</span>
                                <span>{formatINR(pricing.total)}</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: COLORS.textMuted, marginBottom: 14 }}>
                                <ShieldCheck size={16} color={COLORS.gold} />
                                <span>100% Safe & Verified Order Confirmation</span>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.goldDeep})`,
                                    color: COLORS.bgDark,
                                    fontWeight: 700,
                                    border: "none",
                                    padding: "14px",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    borderRadius: 4,
                                    letterSpacing: 1,
                                    textTransform: "uppercase",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                }}
                            >
                                <CheckCircle size={18} /> Confirm Order
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
