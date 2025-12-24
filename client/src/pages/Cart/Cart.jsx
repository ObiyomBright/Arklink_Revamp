// src/pages/Cart/Cart.jsx
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav";
import ProductModal from "../../components/ProductModal/ProductModal";
import styles from "./Cart.module.css";
import { getCart, updateProductQuantity } from "../../utils/cartUtils";
import { useNotification } from "../../Contexts/NotificationContext/NotificationContext";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const { notify } = useNotification();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleQtyChange = (id, delta) => {
    updateProductQuantity(id, delta);
    setCart(getCart());
  };

  // Temporary change while typing
  const handleQtyInputChange = (id, value) => {
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: value }
          : item
      )
    );
  };

  // Update cart on blur
  const handleQtyInputBlur = (id, value) => {
    const qty = Number(value);

    if (qty <= 0 || isNaN(qty)) {
      updateProductQuantity(id, -Infinity);
    } else {
      const item = cart.find((p) => String(p.id) === String(id));
      if (!item) return;
      const diff = qty - item.quantity;
      updateProductQuantity(id, diff);
    }

    setCart(getCart());
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const phone = e.target.phone?.value?.trim();
    const address = e.target.address?.value?.trim();

    if (!phone || !address) {
      notify({
        message: "Please enter your phone number and delivery address.",
        type: "warning",
      });
      return;
    }

    if (!cart || cart.length === 0) {
      notify({
        message: "Your cart is empty.",
        type: "warning",
      });
      return;
    }

    setLoading(true);

    const items = cart.map((it) => ({
      id: it.id,
      type: it.type || it.product_type || "tile",
      name: it.name,
      price: Number(it.price),
      quantity: Number(it.quantity),
    }));

    try {
      const API = import.meta.env.VITE_API_BASE || "";
      const res = await fetch(`${API}/cart.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          address,
          items,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        localStorage.removeItem("cart");
        setCart([]);
        e.target.reset();

        notify({
          message: `Order placed successfully. You\'ll be contacted shortly by our staff`,
          type: "success",
          duration: 4000,
        });
      } else {
        notify({
          message: data?.message || "Failed to place order. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      notify({
        message: "Network error. Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Nav />

      <div className={styles.container}>
        <h1 className={styles.header}>Your Cart</h1>

        {cart.length === 0 && (
          <div className={styles.empty}>Your cart is empty</div>
        )}

        <div className={styles.list}>
          {cart.map((item) => {
            const itemTotal = Number(item.price) * item.quantity;

            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onClick={() => setActiveProduct(item)}
                  />

                  <div className={styles.info}>
                    <h3>{item.name}</h3>
                    <span className={styles.price}>
                      ₦{Number(item.price).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <div className={styles.qty}>
                    <button onClick={() => handleQtyChange(item.id, -1)}>
                      -
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQtyInputChange(item.id, e.target.value)
                      }
                      onBlur={(e) =>
                        handleQtyInputBlur(item.id, e.target.value)
                      }
                    />

                    <button onClick={() => handleQtyChange(item.id, 1)}>
                      +
                    </button>
                  </div>

                  <div className={styles.itemTotal}>
                    ₦{itemTotal.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className={styles.summary}>
            <div className={styles.total}>
              Total: <strong>₦{total.toLocaleString()}</strong>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <h2 className={styles.formHeader}>Delivery Details</h2>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number:</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10,15}"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Delivery Address:</label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter your delivery address"
                  required
                />
              </div>

              <p className={styles.note}>
                You will be contacted shortly by one of our staff to confirm your
                order.
              </p>

              <button type="submit" disabled={loading}>
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  "Submit Order"
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {activeProduct && (
        <ProductModal
          {...activeProduct}
          quantity={activeProduct.quantity}
          onIncrement={(d) => handleQtyChange(activeProduct.id, d)}
          onSetQuantity={() => setCart(getCart())}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </div>
  );
}
