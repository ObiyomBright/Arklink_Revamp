import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Orders.module.css";

/* Status text colors */
const statusColors = {
  pending: "#B45309",
  confirmed: "#1D4ED8",
  processing: "#7C3AED",
  delivered: "#15803D",
  cancelled: "#B91C1C",
};

/* Money formatter (₦12,000 style) */
const formatMoney = (amount) => {
  if (!amount) return "0";
  return Number(amount).toLocaleString("en-NG");
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const API = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetch(`${API}/orders.php`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      })
      .catch(() => setOrders([]));
  }, [API]);

  const updateStatus = (orderId, status) => {
    fetch(`${API}/updateOrderStatus.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ order_id: orderId, status }),
    }).then(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status } : o
        )
      );
    });
  };

  return (
    <section className={styles.page}>
      {/* Top action bar */}
      <div className={styles.topBar}>
        <h2 className={styles.title}>Orders Management</h2>

        <Link to="/add-product" className={styles.addBtn}>
          + Add Products
        </Link>
      </div>

      {/* Orders list */}
      <div className={styles.list}>
        {orders.map((order) => (
          <div className={styles.card} key={order.id}>
            {/* Header */}
            <div className={styles.header}>
              <span className={styles.orderId}>
                Order #{order.id}
              </span>

              <span
                className={styles.status}
                style={{ color: statusColors[order.status] }}
              >
                {order.status}
              </span>
            </div>

            {/* Body */}
            <div className={styles.body}>
              <div className={styles.meta}>
                <div>
                  <strong>Phone:</strong> {order.phone}
                </div>
                <div>
                  <strong>Address:</strong> {order.delivery_address}
                </div>
              </div>

              {/* Items */}
              <div className={styles.items}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <span>
                      {item.name} =&gt; {item.quantity} cartons
                    </span>
                    <span>
                      ₦{formatMoney(item.item_total)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className={styles.total}>
                Total: ₦{formatMoney(order.total_amount)}
              </div>

              {/* Status update */}
              <div className={styles.updateBox}>
                <p className={styles.updateHint}>
                  Update order status (this affects customer tracking)
                </p>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                  className={styles.select}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
