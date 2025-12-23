// src/pages/Cart/Cart.jsx
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav";
import ProductModal from "../../components/ProductModal/ProductModal";
import styles from "./Cart.module.css";
import { getCart, updateProductQuantity } from "../../utils/cartUtils";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);

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
          ? { ...item, quantity: value } // allow empty input
          : item
      )
    );
  };

  // Update cart on blur
  const handleQtyInputBlur = (id, value) => {
    const qty = Number(value);

    if (qty <= 0 || isNaN(qty)) {
      // Remove item from cart if 0 or invalid
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

            <form className={styles.form}>
              <h2 className={styles.formHeader}>Delivery Details</h2>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number:</label>
                <input
                  id="phone"
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
                  placeholder="Enter your delivery address"
                  required
                />
              </div>

              <p className={styles.note}>
                You will be contacted shortly by one of our staff to confirm
                your order.
              </p>

              <button type="submit">Submit Order</button>
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
