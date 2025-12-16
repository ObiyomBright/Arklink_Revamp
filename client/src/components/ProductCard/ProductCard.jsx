// src/components/ProductCard/ProductCard.jsx
import React, { useEffect, useState } from "react";
import styles from "./ProductCard.module.css";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import ProductModal from "../ProductModal/ProductModal";
import {
  getCart,
  addToCart,
  updateProductQuantity,
  updateCartCounter,
} from "../../utils/cartUtils";

const ProductCard = ({
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
}) => {
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cartItem = getCart().find(p => String(p.id) === String(id));
    setQuantity(cartItem ? cartItem.quantity : 0);
    updateCartCounter();
  }, [id]);

  const handleAddToCart = (e) => {
    e && e.stopPropagation();
    addToCart({ id, name, price, image, type });
    const cartItem = getCart().find(p => String(p.id) === String(id));
    setQuantity(cartItem ? cartItem.quantity : 1);
  };

  const handleIncrement = (delta) => {
    updateProductQuantity(id, delta);
    const updated = getCart().find(p => String(p.id) === String(id));
    setQuantity(updated ? updated.quantity : 0);
  };

  const handleAbsoluteQuantity = (val) => {
    if (Number.isNaN(val) || val < 0) return;
    updateProductQuantity(id, val, { absolute: true });
    const updated = getCart().find(p => String(p.id) === String(id));
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
      <article className={styles.card}>
        <div
          className={styles.previewArea}
          onClick={openModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && openModal()}
        >
          <div className={styles.imageWrap}>
            <img src={image} alt={name} className={styles.productImage} />
          </div>

          <div className={styles.body}>
            <div className={styles.rowTop}>
              <h3 className={styles.title}>{name}</h3>
              <span className={styles.typeBadge}>{surface_type}</span>
            </div>
            <p className={styles.excerptText}>{company}</p>
          </div>
        </div>

        <div className={styles.bottomControls}>
          <div className={styles.price}>₦{Number(price).toLocaleString()}</div>

          {quantity > 0 ? (
            <div className={styles.quantityControl}>
              <button onClick={() => handleIncrement(-1)} className={styles.iconBtn}><FaMinus /></button>
              <input
                className={styles.quantityInput}
                value={quantity}
                onChange={(e) => handleAbsoluteQuantity(+e.target.value)}
              />
              <button onClick={() => handleIncrement(1)} className={styles.iconBtn}><FaPlus /></button>
            </div>
          ) : (
            <button className={styles.addToCart} onClick={handleAddToCart}>
              <FaShoppingCart /> Add to cart
            </button>
          )}
        </div>
      </article>

      {isModalOpen && (
        <ProductModal
          id={id}
          name={name}
          price={price}
          image={image}
          type={type}
          company={company}
          size={size}
          surface_type={surface_type}
          pieces_per_carton={pieces_per_carton}
          sqm_per_carton={sqm_per_carton}
          quantity={quantity}
          onClose={closeModal}
          onIncrement={handleIncrement}
          onSetQuantity={handleAbsoluteQuantity}
        />
      )}
    </>
  );
};

export default ProductCard;
