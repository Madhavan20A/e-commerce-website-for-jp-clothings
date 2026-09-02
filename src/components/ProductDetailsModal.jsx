import { useState } from "react";
import { X, Heart, ShoppingBag, Plus, Minus, Check, Sparkles } from "lucide-react";
import { COLORS, CATEGORIES, DEFAULT_SIZES, DEFAULT_COLORS } from "../constants";
import { formatINR } from "../utils/storage";
import { ProductImage } from "./ProductCard";

export default function ProductDetailsModal({ product, onClose, onAddToCart, wishlist, onToggleWishlist }) {
    if (!product) return null;

    const cat = CATEGORIES.find((c) => c.id === product.category);
    const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : (DEFAULT_SIZES[product.category] || DEFAULT_SIZES.ladies);
    const availableColors = product.colors && product.colors.length > 0 ? product.colors : DEFAULT_COLORS;

    const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "M");
    const [selectedColor, setSelectedColor] = useState(availableColors[0] || "Royal Maroon");
    const [qty, setQty] = useState(1);
    const [notes, setNotes] = useState("");

    const isWishlisted = wishlist?.some((item) => item.id === product.id);
    const maxAllowed = product.stock || 0;

    const handleAddToCart = () => {
        if (maxAllowed <= 0) return;
        onAddToCart({
            ...product,
            selectedSize,
            selectedColor,
            customNotes: notes,
        }, qty);
        onClose();
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }} />
            <div
                style={{
                    position: "relative",
                    background: COLORS.bgElevated,
                    border: `1px solid ${COLORS.line}`,
                    width: 820,
                    maxWidth: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    borderRadius: 8,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${COLORS.goldGlow}`,
                    display: "grid",
                    gridTemplateColumns: "1fr 1.1fr",
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        zIndex: 10,
                        background: "rgba(0,0,0,0.6)",
                        border: `1px solid ${COLORS.lineSubtle}`,
                        borderRadius: "50%",
                        width: 34,
                        height: 34,
                        color: COLORS.textLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <X size={18} />
                </button>

                {/* Left: Product Image */}
                <div style={{ position: "relative", background: COLORS.bgCard, minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ProductImage src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                {/* Right: Product Details & Selectors */}
                <div style={{ padding: 30, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1.5, display: "flex", alignItems: "center", gap: 4 }}>
                            <Sparkles size={11} /> {cat ? cat.label : product.category}
                        </span>
                        {product.stock === 0 ? (
                            <span style={{ background: COLORS.redError, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 2 }}>Out of Stock</span>
                        ) : product.stock <= 5 ? (
                            <span style={{ background: COLORS.goldDeep, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 2 }}>Only {product.stock} left in stock</span>
                        ) : (
                            <span style={{ background: COLORS.greenSuccess, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 2 }}>In Stock ({product.stock})</span>
                        )}
                    </div>

                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, color: COLORS.textLight, margin: "0 0 10px", lineHeight: 1.2 }}>
                        {product.name}
                    </h2>

                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: COLORS.goldLight, fontWeight: 700 }}>
                            {formatINR(product.price)}
                        </span>
                        {product.fabric && (
                            <span style={{ fontSize: 12.5, color: COLORS.textMuted, borderLeft: `1px solid ${COLORS.lineSubtle}`, paddingLeft: 12 }}>
                                Fabric: <strong style={{ color: COLORS.textLight }}>{product.fabric}</strong>
                            </span>
                        )}
                    </div>

                    {product.description && (
                        <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.6, margin: "0 0 20px" }}>
                            {product.description}
                        </p>
                    )}

                    {/* Size Selector */}
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontSize: 12, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                            Select Size
                        </label>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {availableSizes.map((sz) => (
                                <button
                                    key={sz}
                                    onClick={() => setSelectedSize(sz)}
                                    style={{
                                        background: selectedSize === sz ? COLORS.gold : COLORS.bgCard,
                                        color: selectedSize === sz ? COLORS.bgDark : COLORS.textLight,
                                        border: `1px solid ${selectedSize === sz ? COLORS.gold : COLORS.line}`,
                                        fontWeight: selectedSize === sz ? 700 : 400,
                                        padding: "6px 14px",
                                        fontSize: 12.5,
                                        cursor: "pointer",
                                        borderRadius: 4,
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ display: "block", fontSize: 12, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                            Select Color
                        </label>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {availableColors.map((clr) => (
                                <button
                                    key={clr}
                                    onClick={() => setSelectedColor(clr)}
                                    style={{
                                        background: selectedColor === clr ? COLORS.goldGlow : COLORS.bgCard,
                                        color: selectedColor === clr ? COLORS.goldLight : COLORS.textMuted,
                                        border: `1px solid ${selectedColor === clr ? COLORS.gold : COLORS.lineSubtle}`,
                                        padding: "5px 12px",
                                        fontSize: 12,
                                        cursor: "pointer",
                                        borderRadius: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    {selectedColor === clr && <Check size={12} color={COLORS.gold} />}
                                    {clr}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Notes */}
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>
                            Custom Fitting Notes / Alterations (Optional)
                        </label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Sleeve length adjustments, urgent delivery..."
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                border: `1px solid ${COLORS.lineSubtle}`,
                                background: COLORS.bgCard,
                                fontSize: 13,
                                color: COLORS.textLight,
                                borderRadius: 4,
                            }}
                        />
                    </div>

                    {/* Quantity Selector & Action Buttons */}
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: "auto" }}>
                        <div style={{ display: "flex", alignItems: "center", border: `1px solid ${COLORS.line}`, background: COLORS.bgCard, borderRadius: 4 }}>
                            <button
                                disabled={qty <= 1}
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                style={{ background: "none", border: "none", color: COLORS.textLight, width: 34, height: 38, cursor: qty <= 1 ? "not-allowed" : "pointer", opacity: qty <= 1 ? 0.4 : 1 }}
                            >
                                <Minus size={14} />
                            </button>
                            <span style={{ fontSize: 14, fontWeight: 600, width: 32, textAlign: "center", color: COLORS.goldLight }}>{qty}</span>
                            <button
                                disabled={qty >= maxAllowed}
                                onClick={() => setQty((q) => Math.min(maxAllowed, q + 1))}
                                style={{ background: "none", border: "none", color: COLORS.textLight, width: 34, height: 38, cursor: qty >= maxAllowed ? "not-allowed" : "pointer", opacity: qty >= maxAllowed ? 0.4 : 1 }}
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        <button
                            disabled={maxAllowed === 0}
                            onClick={handleAddToCart}
                            style={{
                                flex: 1,
                                background: maxAllowed === 0 ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.goldDeep})`,
                                color: maxAllowed === 0 ? COLORS.textMuted : COLORS.bgDark,
                                fontWeight: 700,
                                border: "none",
                                padding: "12px",
                                fontSize: 13.5,
                                cursor: maxAllowed === 0 ? "not-allowed" : "pointer",
                                borderRadius: 4,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            <ShoppingBag size={17} /> {maxAllowed === 0 ? "Out of Stock" : "Add to Bag"}
                        </button>

                        <button
                            onClick={() => onToggleWishlist(product)}
                            style={{
                                background: COLORS.bgCard,
                                border: `1px solid ${isWishlisted ? COLORS.gold : COLORS.line}`,
                                color: isWishlisted ? COLORS.gold : COLORS.textMuted,
                                borderRadius: 4,
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart size={20} fill={isWishlisted ? COLORS.gold : "none"} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
