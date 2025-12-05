// src/components/ProductCard/ProductModal.jsx
import React, { useEffect } from "react";
import styles from "./ProductModal.module.css";
import { FaTimes, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import {
  getCart,
  addToCart,
  updateProductQuantity,
  updateCartCounter,
} from "../../utils/cartUtils";

export default function ProductModal({
  id,
  name,
  price,
  image,
  type,
  quantity,
  onClose,
  onAdd,
  onIncrement,
  onSetQuantity,
}) {
  useEffect(() => {
    // close on Escape
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleAdd = (e) => {
    e && e.stopPropagation();
    addToCart({ id, name, price, image, type });
    updateCartCounter();
    const cartItem = getCart().find((p) => String(p.id) === String(id));
    // notify parent to update quantity if provided
    if (onSetQuantity) onSetQuantity(cartItem ? cartItem.quantity : 1);
  };

  const handleInc = (delta) => {
    updateProductQuantity(id, delta);
    const updated = getCart().find((p) => String(p.id) === String(id));
    if (onSetQuantity) onSetQuantity(updated ? updated.quantity : 0);
  };

  const overlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={overlayClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        <div className={styles.content}>
          <div className={styles.left}>
            <img src={image} alt={name} className={styles.modalImage} />
          </div>

          <div className={styles.right}>
            <h2 className={styles.title}>{name}</h2>
            <div className={styles.meta}>
              <span className={styles.type}>{type}</span>
              <div className={styles.price}>₦{Number(price).toLocaleString()}</div>
            </div>

            <p className={styles.placeholderDesc}>
              {/* Since there's no description provided, we show a friendly placeholder */}
              No description available for this product. Tap Add to cart to purchase or change quantity below.
            </p>

            <div className={styles.controls}>
              <div className={styles.quantityControlModal}>
                <button className={styles.iconBtnModal} onClick={() => handleInc(-1)} aria-label="Decrease">
                  <FaMinus />
                </button>

                <div className={styles.quantityDisplay}>{quantity ?? 0}</div>

                <button className={styles.iconBtnModal} onClick={() => handleInc(1)} aria-label="Increase">
                  <FaPlus />
                </button>
              </div>

              <button className={styles.addBtn} onClick={handleAdd} aria-label="Add to cart">
                <FaShoppingCart /> Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
