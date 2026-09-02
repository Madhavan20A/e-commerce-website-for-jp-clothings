import { useState } from "react";
import { X, Trash2, Plus, Minus, Tag, Check, ArrowRight, Truck } from "lucide-react";
import { COLORS } from "../constants";
import { formatINR } from "../utils/storage";
import { ProductImage } from "./ProductCard";

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING_FEE = 150;

export default function CartDrawer({
    cart,
    isOpen,
    onClose,
    onChangeQty,
    onRemoveFromCart,
    onClearCart,
    onProceedToCheckout,
    appliedCoupon,
    onApplyCoupon,
    onRemoveCoupon,
    availableCoupons,
}) {
    const [couponCodeInput, setCouponCodeInput] = useState("");
    const [couponError, setCouponError] = useState("");

    if (!isOpen) return null;

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    // Discount calculation
    let discountAmount = 0;
    if (appliedCoupon && subtotal >= (appliedCoupon.minOrder || 0)) {
        if (appliedCoupon.type === "percent") {
            discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
        } else if (appliedCoupon.type === "flat") {
            discountAmount = appliedCoupon.value;
        }
    }

    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
    const deliveryCharge = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
    const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

    const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    const handleApplyCouponForm = (e) => {
        e.preventDefault();
        setCouponError("");
        const cleanCode = couponCodeInput.trim().toUpperCase();
        if (!cleanCode) return;

        const matched = availableCoupons.find((c) => c.code.toUpperCase() === cleanCode);
        if (!matched) {
            setCouponError("Invalid coupon code.");
            return;
        }
        if (subtotal < (matched.minOrder || 0)) {
            setCouponError(`Min order ${formatINR(matched.minOrder)} required for ${matched.code}.`);
            return;
        }

        onApplyCoupon(matched);
        setCouponCodeInput("");
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", justifyContent: "flex-end" }}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />
            <div
                style={{
                    position: "relative",
                    width: 420,
                    maxWidth: "92vw",
                    background: COLORS.bgElevated,
                    height: "100%",
                    padding: 26,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    borderLeft: `1px solid ${COLORS.line}`,
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, borderBottom: `1px solid ${COLORS.line}`, paddingBottom: 14 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0, color: COLORS.goldLight }}>
                        Your Shopping Bag ({cart.reduce((s, i) => s + i.qty, 0)})
                    </h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                        <X size={20} />
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                        <Truck size={48} color={COLORS.lineSubtle} style={{ marginBottom: 16 }} />
                        <p style={{ color: COLORS.textMuted, fontSize: 15 }}>Your bag is empty.</p>
                    </div>
                ) : (
                    <>
                        {/* Free Shipping Progress Indicator */}
                        <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, padding: 12, borderRadius: 6, marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: COLORS.goldLight, marginBottom: 6 }}>
                                <Truck size={15} />
                                {isFreeShipping ? (
                                    <span><strong>Congratulations!</strong> You unlocked <strong>FREE Delivery</strong></span>
                                ) : (
                                    <span>Add <strong>{formatINR(amountNeededForFreeShipping)}</strong> more to get <strong>FREE Delivery</strong></span>
                                )}
                            </div>
                            <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${freeShippingProgress}%`, background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})`, transition: "width 0.3s" }} />
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", paddingRight: 4 }}>
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} style={{ display: "flex", gap: 12, background: COLORS.bgCard, padding: 12, borderRadius: 6, border: `1px solid ${COLORS.lineSubtle}` }}>
                                    <ProductImage src={item.image} alt={item.name} style={{ width: 64, height: 80, objectFit: "cover", flexShrink: 0, borderRadius: 4 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 14.5, fontWeight: 600, color: COLORS.textLight, margin: "0 0 2px" }}>
                                                {item.name}
                                            </h4>
                                            <button onClick={() => onRemoveFromCart(item.id, item.selectedSize, item.selectedColor)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>

                                        <div style={{ fontSize: 11.5, color: COLORS.textMuted, marginBottom: 6 }}>
                                            Size: <strong style={{ color: COLORS.goldLight }}>{item.selectedSize || "Default"}</strong> | Color: <strong style={{ color: COLORS.goldLight }}>{item.selectedColor || "Standard"}</strong>
                                        </div>

                                        {item.customNotes && (
                                            <div style={{ fontSize: 11, color: COLORS.gold, fontStyle: "italic", marginBottom: 6 }}>
                                                Note: {item.customNotes}
                                            </div>
                                        )}

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                                            <span style={{ fontSize: 13.5, color: COLORS.goldLight, fontWeight: 700 }}>
                                                {formatINR(item.price * item.qty)}
                                            </span>

                                            <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${COLORS.lineSubtle}`, background: COLORS.bgElevated, borderRadius: 4, padding: "2px 6px" }}>
                                                <button onClick={() => onChangeQty(item.id, item.selectedSize, item.selectedColor, -1)} style={{ background: "none", border: "none", color: COLORS.textLight, cursor: "pointer" }}>
                                                    <Minus size={11} />
                                                </button>
                                                <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.textLight, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                                                <button onClick={() => onChangeQty(item.id, item.selectedSize, item.selectedColor, 1)} style={{ background: "none", border: "none", color: COLORS.textLight, cursor: "pointer" }}>
                                                    <Plus size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Code Section */}
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.lineSubtle}` }}>
                            {appliedCoupon ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(46,125,50,0.15)", border: `1px solid ${COLORS.greenSuccess}`, padding: "8px 12px", borderRadius: 4 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#81C784" }}>
                                        <Check size={14} /> Coupon <strong>{appliedCoupon.code}</strong> Applied ({appliedCoupon.type === "percent" ? `${appliedCoupon.value}% OFF` : `${formatINR(appliedCoupon.value)} OFF`})
                                    </div>
                                    <button onClick={onRemoveCoupon} style={{ background: "none", border: "none", color: COLORS.redError, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCouponForm} style={{ display: "flex", gap: 8 }}>
                                    <div style={{ position: "relative", flex: 1 }}>
                                        <Tag size={14} color={COLORS.textMuted} style={{ position: "absolute", left: 10, top: 11 }} />
                                        <input
                                            type="text"
                                            value={couponCodeInput}
                                            onChange={(e) => setCouponCodeInput(e.target.value)}
                                            placeholder="Coupon Code (e.g. JP10)"
                                            style={{ width: "100%", padding: "8px 10px 8px 30px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, fontSize: 12.5, borderRadius: 4, textTransform: "uppercase" }}
                                        />
                                    </div>
                                    <button type="submit" style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.gold}`, color: COLORS.goldLight, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 4 }}>
                                        Apply
                                    </button>
                                </form>
                            )}
                            {couponError && <p style={{ fontSize: 11.5, color: COLORS.redError, margin: "4px 0 0" }}>{couponError}</p>}
                        </div>

                        {/* Price Summary Breakdown */}
                        <div style={{ borderTop: `1px solid ${COLORS.line}`, paddingTop: 14, marginTop: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.textMuted, marginBottom: 6 }}>
                                <span>Subtotal</span>
                                <span>{formatINR(subtotal)}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#81C784", marginBottom: 6 }}>
                                    <span>Discount ({appliedCoupon?.code})</span>
                                    <span>-{formatINR(discountAmount)}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.textMuted, marginBottom: 10 }}>
                                <span>Delivery Charge</span>
                                <span>{deliveryCharge === 0 ? <strong style={{ color: COLORS.greenSuccess }}>FREE</strong> : formatINR(deliveryCharge)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px dashed ${COLORS.lineSubtle}`, paddingTop: 10, marginBottom: 16 }}>
                                <span style={{ fontSize: 15, color: COLORS.textLight, fontWeight: 600 }}>Grand Total</span>
                                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: COLORS.goldLight }}>
                                    {formatINR(grandTotal)}
                                </span>
                            </div>

                            <div style={{ display: "flex", gap: 10 }}>
                                <button
                                    onClick={onClearCart}
                                    style={{ background: "transparent", border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textMuted, padding: "12px", fontSize: 12, cursor: "pointer", borderRadius: 4 }}
                                >
                                    Clear Bag
                                </button>
                                <button
                                    onClick={() => {
                                        onClose();
                                        onProceedToCheckout({ subtotal, discount: discountAmount, deliveryCharge, total: grandTotal });
                                    }}
                                    style={{
                                        flex: 1,
                                        background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.goldDeep})`,
                                        color: COLORS.bgDark,
                                        fontWeight: 700,
                                        border: "none",
                                        padding: "12px",
                                        fontSize: 13,
                                        cursor: "pointer",
                                        borderRadius: 4,
                                        letterSpacing: 1,
                                        textTransform: "uppercase",
                                        display: "flex",
                                        alignItems: "center",
                                        justify: "center",
                                        gap: 6,
                                    }}
                                >
                                    Checkout <ArrowRight size={15} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
