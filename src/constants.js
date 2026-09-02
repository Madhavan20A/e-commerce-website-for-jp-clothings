export const COLORS = {
    bgDark: "#1F030B",
    bgCard: "#2B0714",
    bgElevated: "#380A1A",
    goldLight: "#F5D886",
    gold: "#D4AF37",
    goldDeep: "#B88E2C",
    goldGlow: "rgba(212, 175, 55, 0.35)",
    textLight: "#F7EFE8",
    textMuted: "#C4A69F",
    line: "rgba(212, 175, 55, 0.25)",
    lineSubtle: "rgba(255, 255, 255, 0.08)",
    burgundyAccent: "#500C22",
    greenSuccess: "#2E7D32",
    redError: "#C62828",
};

export const CATEGORIES = [
    { id: "ladies", label: "Ladies", accent: COLORS.goldLight },
    { id: "gents", label: "Gents", accent: COLORS.gold },
    { id: "kids", label: "Kids", accent: COLORS.goldDeep },
];

export const ADMIN_PASSCODE = "jp2026";

// Configurable Shop WhatsApp number (Country code + number without + or spaces)
export const SHOP_WHATSAPP_NUMBER = "919876543210";

export const DEFAULT_SIZES = {
    ladies: ["XS", "S", "M", "L", "XL", "XXL"],
    gents: ["S", "M", "L", "XL", "XXL"],
    kids: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-12Y"],
};

export const DEFAULT_COLORS = [
    "Royal Maroon",
    "Antique Gold",
    "Ivory White",
    "Midnight Navy",
    "Emerald Green",
    "Rose Blush",
];

export const INITIAL_COUPONS = [
    { code: "JP10", type: "percent", value: 10, minOrder: 1000, description: "10% OFF on orders above ₹1,000" },
    { code: "FESTIVE500", type: "flat", value: 500, minOrder: 3000, description: "₹500 Flat OFF on orders above ₹3,000" },
    { code: "ROYAL20", type: "percent", value: 20, minOrder: 5000, description: "20% OFF on Luxury Silk Collection above ₹5,000" },
];

export const SEED_PRODUCTS = [
    {
        id: "p1",
        name: "Rosewater Silk Saree",
        category: "ladies",
        price: 4200,
        stock: 12,
        sizes: ["Free Size"],
        colors: ["Rose Blush", "Antique Gold"],
        fabric: "Kanjivaram Pure Silk",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80",
        description: "Hand-finished pure Kanjivaram silk saree with intricate woven gold zari border and rich pallu.",
        isNew: true,
        isBestSeller: true,
        isFestive: true,
    },
    {
        id: "p2",
        name: "Ivory Anarkali Gown",
        category: "ladies",
        price: 5600,
        stock: 5,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Ivory White", "Royal Maroon"],
        fabric: "Georgette with Resham Work",
        image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=700&q=80",
        description: "Floor-length royal anarkali gown featuring delicate thread work, sequin highlights and matching dupatta.",
        isNew: true,
        isBestSeller: true,
        isFestive: true,
    },
    {
        id: "p3",
        name: "Charcoal Nehru Blazer",
        category: "gents",
        price: 3800,
        stock: 8,
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Midnight Navy", "Charcoal Gray"],
        fabric: "Brushed Wool Blend",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=700&q=80",
        description: "Tailored luxury bandhgala blazer in brushed wool with velvet piping and engraved brass buttons.",
        isNew: false,
        isBestSeller: true,
        isFestive: false,
    },
    {
        id: "p4",
        name: "Slate Linen Kurta Set",
        category: "gents",
        price: 2400,
        stock: 15,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Slate Blue", "Ivory White"],
        fabric: "100% Organic Linen",
        image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=700&q=80",
        description: "Ultra-breathable premium organic linen kurta set with fine mandarin collar and cotton pyjama.",
        isNew: false,
        isBestSeller: false,
        isFestive: true,
    },
    {
        id: "p5",
        name: "Sunshine Party Frock",
        category: "kids",
        price: 1200,
        stock: 3,
        sizes: ["2-3Y", "4-5Y", "6-7Y"],
        colors: ["Sunshine Yellow", "Rose Blush"],
        fabric: "Soft Net with Satin Lining",
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=700&q=80",
        description: "Twirl-ready festive party frock for little princesses with skin-friendly satin inner lining.",
        isNew: true,
        isBestSeller: false,
        isFestive: true,
    },
    {
        id: "p6",
        name: "Little Prince Sherwani",
        category: "kids",
        price: 1800,
        stock: 0,
        sizes: ["4-5Y", "6-7Y", "8-9Y"],
        colors: ["Antique Gold", "Royal Maroon"],
        fabric: "Jacquard Silk",
        image: "https://images.unsplash.com/photo-1622290291165-d9dd07d1b4ff?w=700&q=80",
        description: "Mini royal sherwani set with embroidered collar and comfortable churidar for grand celebrations.",
        isNew: false,
        isBestSeller: true,
        isFestive: true,
    },
];
