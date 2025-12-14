import React from "react";
import styles from "./DeliveryPayment.module.css";
import { LuTruck, LuCreditCard, LuShieldCheck } from "react-icons/lu";

export default function DeliveryPayment() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Delivery & Payment</h2>
      <div className={styles.grid}>
        <div className={styles.col}>
          <h3>
            <LuTruck size={22} /> Delivery
          </h3>

          <p>We deliver nationwide. Typical delivery times: Lagos 1-3 days, other major cities 2-7 days. Tracking provided.</p>
        </div>
        <div className={styles.col}>
          <h3>
            <LuCreditCard size={22} /> Payments
          </h3>
          <p>
            We currently accept payments via bank transfer only. Account details are
            shared after your order has been confirmed to ensure accuracy and security.
          </p>
        </div>

        <div className={styles.col}>
          <h3>
            <LuShieldCheck size={22} /> Returns & Warranty
          </h3>
          <p>Damaged items reported within 48 hours are eligible for replacement or refund. Warranty depends on product.</p>
        </div>
      </div>
    </section>
  );
}
