import { CheckCircle2, MessageCircle, X } from "lucide-react";
import { COLORS } from "../constants";
import { formatINR } from "../utils/storage";
import { generateWhatsAppLink } from "../utils/whatsapp";

export default function OrderConfirmedModal({ order, onClose }) {
    if (!order) return null;

    const whatsappUrl = generateWhatsAppLink(order);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }} />
            <div
                style={{
                    position: "relative",
                    background: COLORS.bgElevated,
                    border: `1px solid ${COLORS.line}`,
                    width: 460,
                    maxWidth: "100%",
                    padding: 34,
                    textAlign: "center",
                    borderRadius: 8,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${COLORS.goldGlow}`,
                }}
            >
                <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>
                    <X size={18} />
                </button>

                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.goldDeep})`, color: COLORS.bgDark, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <CheckCircle2 size={32} strokeWidth={2.5} />
                </div>

                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: "0 0 8px", color: COLORS.goldLight }}>
                    Order Confirmed!
                </h3>

                <div style={{ fontSize: 13, color: COLORS.gold, fontWeight: 600, marginBottom: 12 }}>
                    Order ID: {order.id}
                </div>

                <p style={{ fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 20 }}>
                    Thank you, <strong>{order.customer.name}</strong>. Your order has been placed. JP CLOTHING will call you at <strong>{order.customer.phone}</strong> to confirm sizing and delivery.
                </p>

                <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, padding: 12, borderRadius: 6, marginBottom: 20, textAlign: "left", fontSize: 12.5, color: COLORS.textMuted }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.textLight, fontWeight: 600, marginBottom: 4 }}>
                        <span>Total Payable ({order.items.length} items):</span>
                        <span style={{ color: COLORS.goldLight }}>{formatINR(order.total)}</span>
                    </div>
                    <div>Payment: {order.paymentMethod || "Cash on Delivery"}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: "#25D366",
                            color: "#fff",
                            fontWeight: 700,
                            border: "none",
                            padding: "12px",
                            fontSize: 13.5,
                            cursor: "pointer",
                            borderRadius: 4,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)",
                        }}
                    >
                        <MessageCircle size={18} /> Send Order Details via WhatsApp
                    </a>

                    <button
                        onClick={onClose}
                        style={{
                            background: COLORS.bgCard,
                            border: `1px solid ${COLORS.line}`,
                            color: COLORS.goldLight,
                            padding: "11px",
                            fontSize: 13,
                            cursor: "pointer",
                            borderRadius: 4,
                        }}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
