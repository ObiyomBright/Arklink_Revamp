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
  company,
  size,
  surface_type,
  pieces_per_carton,
  sqm_per_carton,
  quantity,
  onClose,
  onIncrement,
  onSetQuantity,
}) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleAdd = () => {
    addToCart({ id, name, price, image, type });
    updateCartCounter();
    const cartItem = getCart().find(p => String(p.id) === String(id));
    onSetQuantity(cartItem ? cartItem.quantity : 1);
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}><FaTimes /></button>

        <div className={styles.content}>
          <div className={styles.left}>
            <img src={image} alt={name} className={styles.modalImage} />
          </div>

          <div className={styles.right}>
            <h2 className={styles.title}>{name}</h2>

            <div className={styles.meta}>
              <span className={styles.type}>{surface_type}</span>
              <div className={styles.price}>₦{Number(price).toLocaleString()}</div>
            </div>

            {/* 🔥 NEW SPECS SECTION */}
            <div className={styles.specs}>
              <div><span>Company</span><strong>{company}</strong></div>
              <div><span>Size</span><strong>{size} &nbsp; cm</strong></div>
              <div><span>Pieces / Carton</span><strong>{pieces_per_carton}&nbsp; pcs</strong></div>
              <div><span>Sqm / Carton</span><strong>{sqm_per_carton} &nbsp; m<sup>2</sup></strong></div>
            </div>

            <div className={styles.controls}>
              <div className={styles.quantityControlModal}>
                <button onClick={() => onIncrement(-1)}><FaMinus /></button>
                <div className={styles.quantityDisplay}>{quantity}</div>
                <button onClick={() => onIncrement(1)}><FaPlus /></button>
              </div>

              <button className={styles.addBtn} onClick={handleAdd}>
                <FaShoppingCart /> Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
