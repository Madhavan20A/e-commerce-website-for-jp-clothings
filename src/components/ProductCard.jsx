import { useState } from "react";
import { Heart, Sparkles, ImageOff } from "lucide-react";
import { COLORS, CATEGORIES } from "../constants";
import { formatINR } from "../utils/storage";

export function ProductImage({ src, alt, style }) {
    const [failed, setFailed] = useState(false);
    if (!src || failed) {
        return (
            <div style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bgElevated, color: COLORS.gold }}>
                <ImageOff size={28} strokeWidth={1.3} />
            </div>
        );
    }
    return <img src={src} alt={alt} style={style} onError={() => setFailed(true)} />;
}

export default function ProductCard({ product, onSelect, onAddToCart, wishlist, onToggleWishlist }) {
    const cat = CATEGORIES.find((c) => c.id === product.category);
    const isWishlisted = wishlist?.some((item) => item.id === product.id);

    const getStockBadge = () => {
        if (product.stock === 0) {
            return <span style={{ background: COLORS.redError, color: "#fff", padding: "3px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderRadius: 2 }}>Out of Stock</span>;
        }
        if (product.stock <= 5) {
            return <span style={{ background: COLORS.goldDeep, color: "#fff", padding: "3px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderRadius: 2 }}>Only {product.stock} Left</span>;
        }
        return <span style={{ background: "rgba(46, 125, 50, 0.85)", color: "#fff", padding: "3px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderRadius: 2 }}>In Stock</span>;
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 6,
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 28px ${COLORS.goldGlow}`;
                e.currentTarget.style.borderColor = COLORS.gold;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = COLORS.line;
            }}
        >
            {/* Top Badges & Wishlist Heart */}
            <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
                <div>{getStockBadge()}</div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                    }}
                    style={{
                        background: "rgba(31, 3, 11, 0.75)",
                        backdropFilter: "blur(4px)",
                        border: `1px solid ${isWishlisted ? COLORS.gold : "rgba(255,255,255,0.2)"}`,
                        borderRadius: "50%",
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justify: "center",
                        cursor: "pointer",
                        color: isWishlisted ? COLORS.gold : "#fff",
                        transition: "all 0.2s",
                    }}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart size={16} fill={isWishlisted ? COLORS.gold : "none"} strokeWidth={1.8} />
                </button>
            </div>

            {/* Image Container */}
            <div
                onClick={() => onSelect(product)}
                style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: COLORS.bgElevated, cursor: "pointer" }}
            >
                <ProductImage src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} />
            </div>

            {/* Card Content */}
            <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1.2 }}>
                        <Sparkles size={10} style={{ marginRight: 4 }} />
                        {cat ? cat.label : product.category}
                    </div>
                    {product.fabric && (
                        <span style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic" }}>{product.fabric}</span>
                    )}
                </div>

                <h3
                    onClick={() => onSelect(product)}
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: COLORS.textLight,
                        margin: "0 0 6px",
                        cursor: "pointer",
                        lineHeight: 1.3,
                    }}
                >
                    {product.name}
                </h3>

                {product.description ? (
                    <p style={{ fontSize: 12.5, color: COLORS.textMuted, margin: "0 0 12px", lineHeight: 1.4, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.description}
                    </p>
                ) : (
                    <div style={{ marginBottom: 12, flex: 1 }} />
                )}

                {/* Sizes Pills */}
                {product.sizes && product.sizes.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
                        {product.sizes.map((s) => (
                            <span key={s} style={{ fontSize: 10, background: COLORS.bgElevated, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textMuted, padding: "2px 6px", borderRadius: 3 }}>
                                {s}
                            </span>
                        ))}
                    </div>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${COLORS.lineSubtle}` }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, color: COLORS.goldLight, fontWeight: 700 }}>
                        {formatINR(product.price)}
                    </span>
                    <button
                        disabled={product.stock === 0}
                        onClick={() => onAddToCart(product)}
                        style={{
                            background: product.stock === 0 ? "rgba(255,255,255,0.05)" : "transparent",
                            border: `1px solid ${product.stock === 0 ? COLORS.lineSubtle : COLORS.gold}`,
                            color: product.stock === 0 ? COLORS.textMuted : COLORS.goldLight,
                            fontSize: 11.5,
                            padding: "7px 14px",
                            cursor: product.stock === 0 ? "not-allowed" : "pointer",
                            fontFamily: "'Jost', sans-serif",
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            if (product.stock > 0) {
                                e.currentTarget.style.background = COLORS.gold;
                                e.currentTarget.style.color = COLORS.bgDark;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (product.stock > 0) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = COLORS.goldLight;
                            }
                        }}
                    >
                        {product.stock === 0 ? "Sold Out" : "Add to Bag"}
                    </button>
                </div>
            </div>
        </div>
    );
}
