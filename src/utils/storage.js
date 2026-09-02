import { SEED_PRODUCTS, INITIAL_COUPONS } from "../constants";

export function formatINR(n) {
    return "₹" + Number(n || 0).toLocaleString("en-IN");
}

export function safeJsonParse(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return fallback;
        const parsed = JSON.parse(item);
        return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e);
        return fallback;
    }
}

export function safeJsonSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error setting localStorage key "${key}":`, e);
    }
}

export function getStoredProducts() {
    const products = safeJsonParse("jp_catalog", null);
    if (Array.isArray(products) && products.length > 0) {
        return products;
    }
    safeJsonSet("jp_catalog", SEED_PRODUCTS);
    return SEED_PRODUCTS;
}

export function saveStoredProducts(products) {
    safeJsonSet("jp_catalog", products);
}

export function getStoredOrders() {
    return safeJsonParse("jp_orders", []);
}

export function saveStoredOrders(orders) {
    safeJsonSet("jp_orders", orders);
}

export function getStoredWishlist() {
    return safeJsonParse("jp_wishlist", []);
}

export function saveStoredWishlist(wishlist) {
    safeJsonSet("jp_wishlist", wishlist);
}

export function getStoredCoupons() {
    const coupons = safeJsonParse("jp_coupons", null);
    if (Array.isArray(coupons) && coupons.length > 0) {
        return coupons;
    }
    safeJsonSet("jp_coupons", INITIAL_COUPONS);
    return INITIAL_COUPONS;
}

export function saveStoredCoupons(coupons) {
    safeJsonSet("jp_coupons", coupons);
}
