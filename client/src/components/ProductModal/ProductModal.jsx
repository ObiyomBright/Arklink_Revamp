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

/* Fake price increment by tile size */
const SIZE_PRICE_INCREMENT = {
  "25*40": 400,
  "40*40": 500,
  "30*60": 600,
  "60*60": 700,
  "60*120": 1200,
  "30*45": 750,
};

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

  /* Normalize size and compute fake price */
  const normalizedSize = size?.replace("x", "*");
  const increment = SIZE_PRICE_INCREMENT[normalizedSize] || 0;
  const oldPrice = increment ? Number(price) + increment : null;

  const handleAdd = () => {
    addToCart({ id, name, price, image, type });
    updateCartCounter();
    const cartItem = getCart().find(p => String(p.id) === String(id));
    onSetQuantity(cartItem ? cartItem.quantity : 1);
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.content}>
          <div className={styles.left}>
            <img src={image} alt={name} className={styles.modalImage} />
          </div>

          <div className={styles.right}>
            <h2 className={styles.title}>{name}</h2>

            <div className={styles.meta}>
              <span className={styles.type}>{surface_type}</span>

              {/* ✅ PRICE STACK */}
              <div className={styles.priceWrap}>
                <div className={styles.mainPrice}>
                  ₦{Number(price).toLocaleString()}
                </div>

                {oldPrice && (
                  <div className={styles.oldPrice}>
                    ₦{oldPrice.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* SPECS */}
            <div className={styles.specs}>
              <div>
                <span>Company</span>
                <strong>{company}</strong>
              </div>
              <div>
                <span>Size</span>
                <strong>{size} cm</strong>
              </div>
              <div>
                <span>Pieces / Carton</span>
                <strong>{pieces_per_carton} pcs</strong>
              </div>
              <div>
                <span>Sqm / Carton</span>
                <strong>
                  {sqm_per_carton} m<sup>2</sup>
                </strong>
              </div>
            </div>

            <div className={styles.controls}>
              <div className={styles.quantityControlModal}>
                <button onClick={() => onIncrement(-1)}>
                  <FaMinus />
                </button>
                <div className={styles.quantityDisplay}>{quantity}</div>
                <button onClick={() => onIncrement(1)}>
                  <FaPlus />
                </button>
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
