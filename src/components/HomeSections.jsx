import { Sparkles, ShieldCheck, Truck, Clock, Award, Star, MessageCircle, ArrowRight } from "lucide-react";
import { COLORS, CATEGORIES, SHOP_WHATSAPP_NUMBER } from "../constants";
import ProductCard from "./ProductCard";

export function HeroSection({ onExplore, onSelectCategory }) {
    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 28px 50px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ height: 1, width: 36, background: COLORS.gold }} />
                    <span style={{ color: COLORS.gold, letterSpacing: 2, fontSize: 12, textTransform: "uppercase", fontWeight: 600 }}>
                        Royal Heritage Couture
                    </span>
                </div>

                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, lineHeight: 1.12, fontWeight: 600, margin: "0 0 20px", color: COLORS.textLight }}>
                    Dressed for every chapter, crafted for royalty.
                </h1>

                <p style={{ fontSize: 15.5, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 460, margin: "0 0 32px" }}>
                    Curated ladies', gents' and kids' wear, handpicked for weddings, festive galas and grand celebrations. Premium silk, zari & velvet designs tailored to perfection.
                </p>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <button
                        onClick={onExplore}
                        style={{
                            background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.goldDeep})`,
                            color: COLORS.bgDark,
                            border: "none",
                            padding: "14px 34px",
                            fontSize: 13.5,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "'Jost', sans-serif",
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            borderRadius: 4,
                            boxShadow: `0 6px 25px ${COLORS.goldGlow}`,
                            transition: "transform 0.2s",
                        }}
                    >
                        Explore Collection
                    </button>
                </div>
            </div>

            {/* Hero Category Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {CATEGORIES.map((cat, idx) => (
                    <div
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        style={{
                            cursor: "pointer",
                            position: "relative",
                            aspectRatio: idx === 0 ? "3/4" : "1/1",
                            gridRow: idx === 0 ? "span 2" : "auto",
                            overflow: "hidden",
                            borderRadius: 8,
                            border: `1px solid ${COLORS.line}`,
                            background: COLORS.bgCard,
                            transition: "transform 0.3s ease, border-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.02)";
                            e.currentTarget.style.borderColor = COLORS.gold;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.borderColor = COLORS.line;
                        }}
                    >
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(31,3,11,0.95))" }} />
                        <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                            <span style={{ fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1 }}>Explore Category</span>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.textLight, margin: "2px 0 0" }}>
                                {cat.label}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function WhyChooseUsSection() {
    const features = [
        { icon: <Award size={24} color={COLORS.gold} />, title: "Handcrafted Zari & Silk", desc: "Authentic weaver heritage with premium threads & hand-finished embroidery." },
        { icon: <ShieldCheck size={24} color={COLORS.gold} />, title: "Custom Fitting Support", desc: "Our tailors call you after every order to confirm custom sizing adjustments." },
        { icon: <Truck size={24} color={COLORS.gold} />, title: "Express Pan-India Shipping", desc: "Free shipping on orders above ₹2,999 with safe insured dispatch." },
        { icon: <Clock size={24} color={COLORS.gold} />, title: "WhatsApp Direct Orders", desc: "Quick 1-click order sharing & customer care directly on WhatsApp." },
    ];

    return (
        <div style={{ background: COLORS.bgCard, borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}`, padding: "60px 28px", margin: "40px 0" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <span style={{ fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 2 }}>Why Choose JP Clothing</span>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: COLORS.goldLight, margin: "6px 0 0" }}>
                        The Royal Promise of Excellence
                    </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                    {features.map((f, i) => (
                        <div key={i} style={{ background: COLORS.bgElevated, border: `1px solid ${COLORS.lineSubtle}`, padding: 24, borderRadius: 6, textAlign: "center" }}>
                            <div style={{ width: 50, height: 50, borderRadius: "50%", background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                {f.icon}
                            </div>
                            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: COLORS.textLight, margin: "0 0 8px" }}>{f.title}</h4>
                            <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CustomerReviewsSection() {
    const reviews = [
        { name: "Deepika R.", city: "Chennai", text: "The Rosewater Silk Saree was absolute perfection for my sister's wedding! The fabric feel and gold border are stunning.", rating: 5 },
        { name: "Karthik Subramanian", city: "Coimbatore", text: "Ordered the Charcoal Nehru Blazer. Perfect fitting and high quality wool blend. JP Clothing support called to double check my measurement!", rating: 5 },
        { name: "Meenakshi Sundaram", city: "Madurai", text: "Lovely Kids Sherwani for my son. Super soft inner lining so he was comfortable all evening.", rating: 5 },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: "60px auto", padding: "0 28px" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
                <span style={{ fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 2 }}>Testimonials</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: COLORS.goldLight, margin: "6px 0 0" }}>
                    Words from Our Royal Patrons
                </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {reviews.map((r, i) => (
                    <div key={i} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.line}`, padding: 24, borderRadius: 6, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                            {[...Array(r.rating)].map((_, idx) => (
                                <Star key={idx} size={15} color={COLORS.gold} fill={COLORS.gold} />
                            ))}
                        </div>
                        <p style={{ fontSize: 13.5, color: COLORS.textMuted, fontStyle: "italic", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                            "{r.text}"
                        </p>
                        <div style={{ borderTop: `1px solid ${COLORS.lineSubtle}`, paddingTop: 12 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textLight }}>{r.name}</div>
                            <div style={{ fontSize: 12, color: COLORS.gold }}>{r.city}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function WhatsAppSection() {
    const whatsappUrl = `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello JP CLOTHING, I would like to inquire about your custom couture collection.")}`;

    return (
        <div style={{ background: `linear-gradient(135deg, ${COLORS.bgCard}, ${COLORS.bgElevated})`, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: 36, maxWidth: 1200, margin: "60px auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
                <span style={{ fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 2 }}>Need Custom Fitting or Bulk Orders?</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: COLORS.goldLight, margin: "6px 0 8px" }}>
                    Chat Directly with JP Clothing Stylists
                </h3>
                <p style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }}>
                    Got questions on sizes, fabric colors, or wedding group orders? We're available 24/7 on WhatsApp.
                </p>
            </div>

            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    background: "#25D366",
                    color: "#fff",
                    fontWeight: 700,
                    padding: "14px 28px",
                    borderRadius: 6,
                    textDecoration: "none",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    boxShadow: "0 6px 20px rgba(37,211,102,0.3)",
                }}
            >
                <MessageCircle size={20} /> Open WhatsApp Chat
            </a>
        </div>
    );
}
