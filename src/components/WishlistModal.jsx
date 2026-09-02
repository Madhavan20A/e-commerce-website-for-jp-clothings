import { X, Trash2, ShoppingBag, Heart } from "lucide-react";
import { COLORS } from "../constants";
import { formatINR } from "../utils/storage";
import { ProductImage } from "./ProductCard";

export default function WishlistModal({ wishlist, isOpen, onClose, onMoveToCart, onRemoveFromWishlist, onClearWishlist }) {
    if (!isOpen) return null;

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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: `1px solid ${COLORS.line}`, paddingBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Heart size={20} color={COLORS.gold} fill={COLORS.gold} />
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0, color: COLORS.goldLight }}>
                            Your Wishlist ({wishlist.length})
                        </h3>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                {wishlist.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20 }}>
                        <Heart size={48} color={COLORS.lineSubtle} style={{ marginBottom: 16 }} />
                        <p style={{ color: COLORS.textMuted, fontSize: 15, marginBottom: 20 }}>Your wishlist is currently empty.</p>
                        <button
                            onClick={onClose}
                            style={{
                                background: COLORS.gold,
                                color: COLORS.bgDark,
                                fontWeight: 600,
                                border: "none",
                                padding: "10px 20px",
                                fontSize: 13,
                                cursor: "pointer",
                                borderRadius: 4,
                            }}
                        >
                            Explore Collection
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                            {wishlist.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        gap: 14,
                                        background: COLORS.bgCard,
                                        padding: 12,
                                        border: `1px solid ${COLORS.lineSubtle}`,
                                        borderRadius: 6,
                                    }}
                                >
                                    <ProductImage src={item.image} alt={item.name} style={{ width: 68, height: 84, objectFit: "cover", flexShrink: 0, borderRadius: 4 }} />
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: COLORS.textLight, margin: "0 0 4px" }}>
                                                {item.name}
                                            </h4>
                                            <button onClick={() => onRemoveFromWishlist(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted }} title="Remove">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                        <span style={{ fontSize: 13.5, color: COLORS.goldLight, fontWeight: 700, marginBottom: 8 }}>
                                            {formatINR(item.price)}
                                        </span>
                                        <button
                                            disabled={item.stock === 0}
                                            onClick={() => onMoveToCart(item)}
                                            style={{
                                                marginTop: "auto",
                                                background: item.stock === 0 ? "rgba(255,255,255,0.05)" : "transparent",
                                                border: `1px solid ${item.stock === 0 ? COLORS.lineSubtle : COLORS.gold}`,
                                                color: item.stock === 0 ? COLORS.textMuted : COLORS.goldLight,
                                                fontSize: 11,
                                                padding: "6px 12px",
                                                cursor: item.stock === 0 ? "not-allowed" : "pointer",
                                                borderRadius: 3,
                                                display: "flex",
                                                alignItems: "center",
                                                justify: "center",
                                                gap: 6,
                                                textTransform: "uppercase",
                                                letterSpacing: 0.8,
                                            }}
                                        >
                                            <ShoppingBag size={13} /> {item.stock === 0 ? "Out of Stock" : "Move to Bag"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: `1px solid ${COLORS.line}`, paddingTop: 16, marginTop: 16 }}>
                            <button
                                onClick={onClearWishlist}
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: `1px solid ${COLORS.lineSubtle}`,
                                    color: COLORS.textMuted,
                                    padding: "10px",
                                    fontSize: 12.5,
                                    cursor: "pointer",
                                    borderRadius: 4,
                                }}
                            >
                                Clear Entire Wishlist
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
