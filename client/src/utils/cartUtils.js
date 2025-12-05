// src/utils/cartUtils.js
export const CART_KEY = "cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return [];
  }
}

export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCounter(cart);
}

export function updateCartCounter(cart = null) {
  const current = cart ?? getCart();
  document.querySelectorAll(".cartCounter").forEach(counter => {
    counter.textContent = current.length;
  });
}

// Add product (or increment if exists)
export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  setCart(cart);
}

// Update product quantity by delta (can be negative)
export function updateProductQuantity(productId, deltaOrAbsolute, opts = { absolute: false }) {
  const cart = getCart();
  const idx = cart.findIndex(p => p.id === productId);
  if (idx === -1 && opts.absolute && deltaOrAbsolute > 0) {
    // If absolute and not present, add it
    cart.push({ id: productId, quantity: deltaOrAbsolute });
  } else if (idx !== -1) {
    if (opts.absolute) {
      cart[idx].quantity = deltaOrAbsolute;
    } else {
      cart[idx].quantity += deltaOrAbsolute;
    }
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
  }
  setCart(cart);
}

// Placeholder: call this on checkout to sync local cart to server
export async function syncCartOnCheckout() {
  const cart = getCart();
  // Example: send cart to API
  try {
    // Replace URL with your endpoint
    const res = await fetch("/api/checkout/sync-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to sync cart");
    return await res.json();
  } catch (err) {
    console.error("Cart sync failed:", err);
    // handle offline fallback etc.
    return { success: false, error: err.message };
  }
}
