import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Heart, Search, Filter, RotateCcw, Lock } from "lucide-react";
import { COLORS, CATEGORIES } from "./constants";
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredOrders,
  saveStoredOrders,
  getStoredWishlist,
  saveStoredWishlist,
  getStoredCoupons,
  saveStoredCoupons,
} from "./utils/storage";

import Toast from "./components/Toast";
import ProductCard from "./components/ProductCard";
import ProductDetailsModal from "./components/ProductDetailsModal";
import WishlistModal from "./components/WishlistModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrderConfirmedModal from "./components/OrderConfirmedModal";
import AdminDashboard from "./components/AdminDashboard";
import { HeroSection, WhyChooseUsSection, CustomerReviewsSection, WhatsAppSection } from "./components/HomeSections";

function JPLogoSvg({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E69A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA8214" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="130" r="95" stroke="url(#goldGradNav)" strokeWidth="3" />
      <path d="M150 24 C150 24 144 33 138 33 C132 33 135 24 150 15 C165 24 168 33 162 33 C156 33 150 24 150 24 Z" fill="url(#goldGradNav)" />
      <text x="110" y="155" fontFamily="'Playfair Display', serif" fontSize="72" fontWeight="700" fill="url(#goldGradNav)">J</text>
      <text x="146" y="155" fontFamily="'Playfair Display', serif" fontSize="72" fontWeight="700" fill="url(#goldGradNav)">P</text>
      <line x1="45" y1="262" x2="255" y2="262" stroke="url(#goldGradNav)" strokeWidth="2" />
    </svg>
  );
}

export default function App() {
  // Store States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [cart, setCart] = useState([]);

  // Filtering & Search
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // UI Modal / Drawer States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPricing, setCheckoutPricing] = useState({ subtotal: 0, discount: 0, deliveryCharge: 0, total: 0 });
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  // Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);
  const shopRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial Load from localStorage
  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setWishlist(getStoredWishlist());
    setCoupons(getStoredCoupons());
  }, []);

  // Sync state helpers
  const updateProducts = (next) => {
    setProducts(next);
    saveStoredProducts(next);
  };

  const updateOrders = (next) => {
    setOrders(next);
    saveStoredOrders(next);
  };

  const updateWishlist = (next) => {
    setWishlist(next);
    saveStoredWishlist(next);
  };

  const updateCoupons = (next) => {
    setCoupons(next);
    saveStoredCoupons(next);
  };

  // Scroll helper
  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = (p.description || "").toLowerCase().includes(q);
      const matchFabric = (p.fabric || "").toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchFabric) return false;
    }
    if (priceFilter === "under2000" && p.price >= 2000) return false;
    if (priceFilter === "2000to5000" && (p.price < 2000 || p.price > 5000)) return false;
    if (priceFilter === "above5000" && p.price <= 5000) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceLowHigh") return a.price - b.price;
    if (sortBy === "priceHighLow") return b.price - a.price;
    if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return 0; // featured default
  });

  const handleResetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setPriceFilter("all");
    setSortBy("featured");
  };

  // Wishlist Actions
  const handleToggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    let next;
    if (exists) {
      next = wishlist.filter((item) => item.id !== product.id);
      showToast(`Removed "${product.name}" from Wishlist`, "info");
    } else {
      next = [...wishlist, product];
      showToast(`Added "${product.name}" to Wishlist!`, "success");
    }
    updateWishlist(next);
  };

  const handleMoveWishlistToCart = (product) => {
    handleAddToCart(product, 1);
    updateWishlist(wishlist.filter((item) => item.id !== product.id));
  };

  const handleClearWishlist = () => {
    updateWishlist([]);
    showToast("Wishlist cleared", "info");
  };

  // Cart Actions
  const handleAddToCart = (product, qtyToAdd = 1) => {
    const size = product.selectedSize || (product.sizes && product.sizes[0]) || "M";
    const color = product.selectedColor || (product.colors && product.colors[0]) || "Royal Maroon";
    const notes = product.customNotes || "";

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.id === product.id && i.selectedSize === size && i.selectedColor === color
      );

      if (existingIdx > -1) {
        const currentQty = prev[existingIdx].qty;
        const newQty = Math.min(product.stock || 99, currentQty + qtyToAdd);
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], qty: newQty, customNotes: notes };
        return copy;
      }

      return [...prev, { ...product, selectedSize: size, selectedColor: color, customNotes: notes, qty: Math.min(product.stock || 99, qtyToAdd) }];
    });

    showToast(`Added "${product.name}" (${size}) to Bag!`, "success");
  };

  const handleChangeCartQty = (id, size, color, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
            const productRef = products.find((p) => p.id === id);
            const maxAllowed = productRef ? productRef.stock : 99;
            const newQty = Math.max(1, Math.min(maxAllowed, item.qty + delta));
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveFromCart = (id, size, color) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size && item.selectedColor === color)));
    showToast("Item removed from bag", "info");
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    showToast("Bag cleared", "info");
  };

  // Order Placement (Inventory Auto-Reduction)
  const handleConfirmOrder = (orderData) => {
    const orderId = "JP-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
    };

    // Auto-reduce stock in products catalog
    const nextProducts = products.map((p) => {
      const orderedItems = orderData.items.filter((it) => it.id === p.id);
      if (orderedItems.length > 0) {
        const totalQtyOrdered = orderedItems.reduce((s, it) => s + it.qty, 0);
        return { ...p, stock: Math.max(0, (p.stock || 0) - totalQtyOrdered) };
      }
      return p;
    });

    updateProducts(nextProducts);
    updateOrders([newOrder, ...orders]);
    setOrderConfirmed(newOrder);
    setCart([]);
    setAppliedCoupon(null);
    setCheckoutOpen(false);
    showToast("Order placed successfully!", "success");
  };

  // Admin Actions
  const handleAddProduct = (newProd) => {
    const prod = { ...newProd, id: "p" + Date.now(), isNew: true };
    updateProducts([prod, ...products]);
    showToast(`Added "${prod.name}" to catalog!`, "success");
  };

  const handleUpdateProduct = (updatedProd) => {
    const next = products.map((p) => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p));
    updateProducts(next);
    showToast("Product updated!", "success");
  };

  const handleDeleteProduct = (id) => {
    const next = products.filter((p) => p.id !== id);
    updateProducts(next);
    showToast("Product removed from catalog", "info");
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const next = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    updateOrders(next);
    showToast(`Order #${orderId} status changed to ${newStatus}`, "info");
  };

  const handleAddCoupon = (newCoupon) => {
    const next = [newCoupon, ...coupons];
    updateCoupons(next);
    showToast(`Coupon ${newCoupon.code} added!`, "success");
  };

  const handleDeleteCoupon = (code) => {
    const next = coupons.filter((c) => c.code !== code);
    updateCoupons(next);
    showToast(`Coupon ${code} removed`, "info");
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div style={{ background: COLORS.bgDark, minHeight: "100vh", fontFamily: "'Jost', sans-serif", color: COLORS.textLight }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Banner Accent */}
      <div style={{ background: `linear-gradient(90deg, ${COLORS.bgDark}, ${COLORS.goldDeep}, ${COLORS.goldLight}, ${COLORS.goldDeep}, ${COLORS.bgDark})`, height: 3 }} />

      {/* Sticky Header Navigation */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: `${COLORS.bgDark}F5`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>

          {/* Logo & Brand Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={handleResetFilters}>
            <JPLogoSvg size={44} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, letterSpacing: 2, color: COLORS.goldLight }}>
                JP <span style={{ color: COLORS.gold, fontWeight: 400, fontSize: 16 }}>CLOTHING</span>
              </div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, fontStyle: "italic" }}>
                Styles that defines you ..
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {["all", ...CATEGORIES.map((c) => c.id)].map((cid) => (
              <button
                key={cid}
                onClick={() => {
                  setActiveCategory(cid);
                  scrollToShop();
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 13.5,
                  color: activeCategory === cid ? COLORS.goldLight : COLORS.textMuted,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  padding: "4px 0",
                  borderBottom: activeCategory === cid ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                  transition: "all 0.2s",
                }}
              >
                {cid === "all" ? "All Dresses" : CATEGORIES.find((c) => c.id === cid).label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ position: "relative", minWidth: 200, flex: 1, maxWidth: 300 }}>
            <Search size={15} color={COLORS.textMuted} style={{ position: "absolute", left: 10, top: 10 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sarees, suits, blazers..."
              style={{
                width: "100%",
                padding: "7px 10px 7px 32px",
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.lineSubtle}`,
                color: COLORS.textLight,
                fontSize: 12.5,
                borderRadius: 20,
              }}
            />
          </div>

          {/* Action Icons (Wishlist, Cart, Admin) */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Wishlist Button */}
            <button
              onClick={() => setWishlistOpen(true)}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: COLORS.goldLight }}
              title="Wishlist"
            >
              <Heart size={22} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -7,
                    right: -8,
                    background: COLORS.gold,
                    color: COLORS.bgDark,
                    fontWeight: 700,
                    borderRadius: "50%",
                    width: 17,
                    height: 17,
                    fontSize: 10.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: COLORS.goldLight }}
              title="Shopping Bag"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -7,
                    right: -8,
                    background: COLORS.gold,
                    color: COLORS.bgDark,
                    fontWeight: 700,
                    borderRadius: "50%",
                    width: 17,
                    height: 17,
                    fontSize: 10.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Trigger */}
            <button
              onClick={() => setAdminOpen(true)}
              style={{
                background: "transparent",
                border: `1px solid ${COLORS.line}`,
                color: COLORS.gold,
                padding: "5px 12px",
                cursor: "pointer",
                fontSize: 12,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Lock size={12} /> Admin
            </button>
          </div>
        </div>
      </div>

      {/* Hero Showcase Section */}
      <HeroSection onExplore={scrollToShop} onSelectCategory={(catId) => { setActiveCategory(catId); scrollToShop(); }} />

      {/* Catalog & Filter Bar */}
      <div ref={shopRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 28px 90px" }}>

        {/* Filters Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30, borderBottom: `1px solid ${COLORS.line}`, paddingBottom: 16, flexWrap: "wrap", gap: 14 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, margin: "0 0 4px", color: COLORS.goldLight }}>
              {activeCategory === "all" ? "The Royal Collection" : CATEGORIES.find((c) => c.id === activeCategory)?.label}
            </h2>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>
              Showing {sortedProducts.length} matching {sortedProducts.length === 1 ? "design" : "designs"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            {/* Price Filter Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: COLORS.textMuted }}>
              <Filter size={14} color={COLORS.gold} /> Price:
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, padding: "5px 10px", borderRadius: 4, fontSize: 12.5 }}
              >
                <option value="all">All Prices</option>
                <option value="under2000">Under ₹2,000</option>
                <option value="2000to5000">₹2,000 - ₹5,000</option>
                <option value="above5000">Above ₹5,000</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: COLORS.textMuted }}>
              Sort:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, color: COLORS.textLight, padding: "5px 10px", borderRadius: 4, fontSize: 12.5 }}
              >
                <option value="featured">Featured</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {(activeCategory !== "all" || searchQuery || priceFilter !== "all" || sortBy !== "featured") && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.line}`,
                  color: COLORS.gold,
                  padding: "5px 10px",
                  fontSize: 12,
                  cursor: "pointer",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <RotateCcw size={12} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: COLORS.bgCard, border: `1px solid ${COLORS.lineSubtle}`, borderRadius: 8 }}>
            <p style={{ color: COLORS.textMuted, fontSize: 16, marginBottom: 16 }}>
              No dresses match your current search or filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              style={{ background: COLORS.gold, color: COLORS.bgDark, fontWeight: 600, border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: 4 }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "32px 24px" }}>
            {sortedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(prod) => setSelectedProduct(prod)}
                onAddToCart={(prod) => handleAddToCart(prod, 1)}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us & Reviews Homepage Sections */}
      <WhyChooseUsSection />
      <CustomerReviewsSection />
      <WhatsAppSection />

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${COLORS.line}`, background: COLORS.bgCard, padding: "32px 28px", fontSize: 13, color: COLORS.textMuted }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <JPLogoSvg size={36} />
            <div>
              <div style={{ color: COLORS.goldLight, fontWeight: 600 }}>JP CLOTHING &copy; 2026</div>
              <div style={{ fontSize: 11, fontStyle: "italic" }}>Styles that defines you ..</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 20, fontSize: 12.5 }}>
            <button onClick={scrollToShop} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>Shop Collection</button>
            <button onClick={() => setWishlistOpen(true)} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer" }}>Wishlist ({wishlist.length})</button>
            <button onClick={() => setAdminOpen(true)} style={{ background: "none", border: "none", color: COLORS.gold, cursor: "pointer" }}>Shop Admin</button>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      <WishlistModal
        wishlist={wishlist}
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onMoveToCart={handleMoveWishlistToCart}
        onRemoveFromWishlist={(id) => handleToggleWishlist(products.find((p) => p.id === id) || { id })}
        onClearWishlist={handleClearWishlist}
      />

      <CartDrawer
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onChangeQty={handleChangeCartQty}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={(pricing) => {
          setCheckoutPricing(pricing);
          setCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(c) => {
          setAppliedCoupon(c);
          showToast(`Applied coupon "${c.code}"!`, "success");
        }}
        onRemoveCoupon={() => {
          setAppliedCoupon(null);
          showToast("Coupon removed", "info");
        }}
        availableCoupons={coupons}
      />

      <CheckoutModal
        cart={cart}
        pricing={checkoutPricing}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirmOrder={handleConfirmOrder}
      />

      <OrderConfirmedModal
        order={orderConfirmed}
        onClose={() => setOrderConfirmed(null)}
      />

      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={products}
        orders={orders}
        coupons={coupons}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddCoupon={handleAddCoupon}
        onDeleteCoupon={handleDeleteCoupon}
      />
    </div>
  );
}
