import React, { useEffect, useRef, useState } from "react";
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
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  const [isScrollable, setIsScrollable] = useState(false);
  const [tempQuantity, setTempQuantity] = useState("");

  /* Sync temp input with real quantity */
  useEffect(() => {
    setTempQuantity(quantity > 0 ? String(quantity) : "");
  }, [quantity]);

  /* Escape key + scroll detection */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    const checkScrollable = () => {
      if (contentRef.current) {
        setIsScrollable(
          contentRef.current.scrollHeight > contentRef.current.clientHeight
        );
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", checkScrollable);
    };
  }, [onClose]);

  /* Normalize size & compute fake price */
  const normalizedSize = size?.replace("x", "*");
  const increment = SIZE_PRICE_INCREMENT[normalizedSize] || 0;
  const oldPrice = increment ? Number(price) + increment : null;

  /* Add to cart */
  const handleAdd = () => {
    addToCart({ id, name, price, image, type });
    updateCartCounter();

    const cartItem = getCart().find((p) => String(p.id) === String(id));
    onSetQuantity(cartItem ? cartItem.quantity : 1);
    setTempQuantity(cartItem ? String(cartItem.quantity) : "1");
  };

  /* Editable input handlers (same logic as ProductCard) */
  const handleInputChange = (value) => {
    setTempQuantity(value); // allow full typing
  };

  const handleInputBlur = () => {
    const val = Number(tempQuantity);

    if (!val || val <= 0) {
      updateProductQuantity(id, -Infinity); // remove from cart
      onSetQuantity(0);
      setTempQuantity("");
    } else {
      const diff = val - quantity;
      updateProductQuantity(id, diff);

      const updated = getCart().find((p) => String(p.id) === String(id));
      onSetQuantity(updated ? updated.quantity : 0);
      setTempQuantity(updated ? String(updated.quantity) : "");
    }

    updateCartCounter();
  };

  const isSanitary = type?.toLowerCase() === "sanitary";

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.content} ref={contentRef}>
          <div className={styles.left}>
            <img src={image} alt={name} className={styles.modalImage} />
          </div>

          <div className={styles.right}>
            <h2 className={styles.title}>{name}</h2>

            <div className={styles.meta}>
              {!isSanitary && (
                <span className={styles.type}>{surface_type}</span>
              )}

              <div className={styles.priceWrap}>
                <div className={styles.mainPrice}>
                  ₦{Number(price).toLocaleString()}
                </div>

                {oldPrice && !isSanitary && (
                  <div className={styles.oldPrice}>
                    ₦{oldPrice.toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Specs */}
            {!isSanitary ? (
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
            ) : (
              <div className={styles.specs}>
                <div>
                  <span>Company</span>
                  <strong>{company}</strong>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className={styles.controls}>
              <div className={styles.quantityControlModal}>
                <button
                  className={styles.iconBtnModal}
                  onClick={() => onIncrement(-1)}
                >
                  <FaMinus />
                </button>

                <input
                  type="number"
                  className={styles.quantityInputModal}
                  value={tempQuantity}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onBlur={handleInputBlur}
                />

                <button
                  className={styles.iconBtnModal}
                  onClick={() => onIncrement(1)}
                >
                  <FaPlus />
                </button>
              </div>

              <button className={styles.addBtn} onClick={handleAdd}>
                <FaShoppingCart /> Add to cart
              </button>
            </div>
          </div>
        </div>

        {isScrollable && (
          <div className={styles.scrollIndicator}>
            <span className={styles.arrow}>⬇</span>
            <span className={styles.scrollText}>Scroll</span>
          </div>
        )}
      </div>
    </div>
  );
}
