import React, { useState } from "react";
import { Link } from 'react-router-dom';
import styles from "./AddProduct.module.css";
import { useNotification } from "../../Contexts/NotificationContext/NotificationContext";

const AddProduct = () => {
  const { notify } = useNotification();
  const role = localStorage.getItem("role");

  const [productType, setProductType] = useState("tile");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    surface_type: "",
    size: "",
    pieces_per_carton: "",
    sqm_per_carton: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const MAX_IMAGE_SIZE_MB = 7;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_IMAGE_SIZE_MB) {
        notify({ message: `Image too large. Max allowed is ${MAX_IMAGE_SIZE_MB}MB`, type: "error" });
        setImage(null);
        e.target.value = null;
        return;
      }
      setImage(file);
    }
  };

  const updateField = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      notify({ message: "Please upload a product image", type: "error" });
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("product_type", productType);
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    form.append("image", image);

    try {
      const API = import.meta.env.VITE_API_BASE;
      const res = await fetch(`${API}/addproduct.php`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const result = await res.json();
      notify({ message: result.message, type: result.status });

      if (result.status === "success") {
        setFormData({
          name: "",
          company: "",
          surface_type: "",
          size: "",
          pieces_per_carton: "",
          sqm_per_carton: "",
          price: "",
        });
        setImage(null);
      }
    } catch (error) {
      notify({ message: "An unexpected error occurred", type: "error" });
    }

    setLoading(false);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Admin Top Bar */}
      <div className={styles.topBar}>
        <h3 className={styles.topTitle}>Admin Panel</h3>

        {role === "admin" && (
          <Link to="/orders" className={styles.ordersLink}>
            View Orders →
          </Link>
        )}


      </div>

      <form className={styles.card} onSubmit={submitProduct}>
        <h2 className={styles.title}>Add Product</h2>

        <label>Product Type</label>
        <select
          className={styles.selectInput}
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        >
          <option value="tile">Tile</option>
          <option value="sanitary">Sanitary</option>
        </select>

        <label>Name</label>
        <input
          type="text"
          name="name"
          className={styles.input}
          value={formData.name}
          onChange={updateField}
          required
        />

        <label>Company</label>
        <input
          type="text"
          name="company"
          className={styles.input}
          value={formData.company}
          onChange={updateField}
          required
        />

        {productType === "tile" && (
          <>
            <label>Surface Type</label>
            <select
              name="surface_type"
              className={styles.selectInput}
              value={formData.surface_type}
              onChange={updateField}
              required
            >
              <option value="">Select</option>
              <option value="matt">Matt</option>
              <option value="glazed">Glazed</option>
              <option value="super polished">Super Polished</option>
            </select>

            <label>Size</label>
            <select
              name="size"
              className={styles.selectInput}
              value={formData.size}
              onChange={updateField}
              required
            >
              <option value="">Select size</option>
              <option value="25*40">25×40</option>
              <option value="25*50">25×50</option>
              <option value="40*40">40×40</option>
              <option value="30*60">30×60</option>
              <option value="30*45">30×45</option>
              <option value="60*60">60×60</option>
              <option value="60*120">60×120</option>
            </select>

            <label>Pieces Per Carton</label>
            <input
              type="number"
              name="pieces_per_carton"
              className={styles.input}
              value={formData.pieces_per_carton}
              onChange={updateField}
              required
            />

            <label>Sqm Per Carton</label>
            <input
              type="number"
              name="sqm_per_carton"
              step="0.01"
              className={styles.input}
              value={formData.sqm_per_carton}
              onChange={updateField}
              required
            />
          </>
        )}


        <label>
          {productType === "tile" ? "Price Per Carton (₦)" : "Price Per Item (₦)"}
        </label>
        <input
          type="number"
          name="price"
          step="0.01"
          className={styles.input}
          value={formData.price}
          onChange={updateField}
          required
        />

        <label>
          Product Image <span className={styles.fileNote}>(Max Size: 7MB)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleImageUpload}
          required
        />

        <button type="submit" className={styles.button}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
