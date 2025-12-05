// src/components/ProductCard/ProductCard.jsx
import React, { useEffect, useState } from "react";
import styles from "./ProductCard.module.css";
import { FaPlus, FaMinus, FaShoppingCart, FaTimes } from "react-icons/fa";
import ProductModal from "../ProductModal/ProductModal";
import {
  getCart,
  addToCart,
  updateProductQuantity,
  updateCartCounter,
} from "../../utils/cartUtils";

const ProductCard = ({ id, name, price, image, type }) => {
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cartItem = getCart().find((p) => String(p.id) === String(id));
    setQuantity(cartItem ? cartItem.quantity : 0);
    updateCartCounter();
  }, [id]);

  const handleAddToCart = (e) => {
    // called from the Add button (not from the clickable preview)
    e && e.stopPropagation();
    addToCart({ id, name, price, image, type });
    const cartItem = getCart().find((p) => String(p.id) === String(id));
    setQuantity(cartItem ? cartItem.quantity : 1);
  };

  const handleIncrement = (delta) => {
    updateProductQuantity(id, delta);
    const updated = getCart().find((p) => String(p.id) === String(id));
    setQuantity(updated ? updated.quantity : 0);
  };

  const handleAbsoluteQuantity = (val) => {
    if (Number.isNaN(val) || val < 0) return;
    updateProductQuantity(id, val, { absolute: true });
    const updated = getCart().find((p) => String(p.id) === String(id));
    setQuantity(updated ? updated.quantity : 0);
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <article className={styles.card} aria-labelledby={`p-${id}-title`}>
        {/* Clickable preview area (opens modal) */}
        <div className={styles.previewArea} onClick={openModal} role="button" tabIndex={0}
             onKeyDown={(e) => { if (e.key === "Enter") openModal(); }}>
          <div className={styles.imageWrap}>
            <img src={image} alt={name} className={styles.productImage} />
          </div>

          <div className={styles.body}>
            <div className={styles.rowTop}>
              <h3 id={`p-${id}-title`} className={styles.title}>{name}</h3>
              <span className={styles.typeBadge}>{type}</span>
            </div>
            <div className={styles.excerpt}>
              {/* No description available — show a short placeholder/excerpt */}
              <p className={styles.excerptText}>Tap to view details</p>
            </div>
          </div>
        </div>

        {/* Bottom controls (not clickable area) */}
        <div className={styles.bottomControls}>
          <div className={styles.price}>₦{Number(price).toLocaleString()}</div>

          {quantity > 0 ? (
            <div className={styles.quantityControl} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.iconBtn}
                type="button"
                aria-label="Decrease"
                onClick={() => handleIncrement(-1)}
              >
                <FaMinus />
              </button>

              <input
                className={styles.quantityInput}
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  handleAbsoluteQuantity(Number.isNaN(v) ? 0 : v);
                }}
                aria-label="Quantity"
              />

              <button
                className={styles.iconBtn}
                type="button"
                aria-label="Increase"
                onClick={() => handleIncrement(1)}
              >
                <FaPlus />
              </button>
            </div>
          ) : (
            <button
              className={styles.addToCart}
              type="button"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <FaShoppingCart className={styles.cartIcon} /> Add to cart
            </button>
          )}
        </div>
      </article>

      {/* Modal */}
      {isModalOpen && (
        <ProductModal
          id={id}
          name={name}
          price={price}
          image={image}
          type={type}
          quantity={quantity}
          onClose={closeModal}
          onAdd={(e) => {
            e && e.stopPropagation();
            handleAddToCart();
          }}
          onIncrement={(delta) => handleIncrement(delta)}
          onSetQuantity={(val) => handleAbsoluteQuantity(val)}
        />
      )}
    </>
  );
};

export default ProductCard;
