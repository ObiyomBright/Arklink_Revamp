import React from "react";
import styles from "./AboutUs.module.css";

export default function AboutUs() {
  return (
    <section className={styles.container} id="about">
      <h2 className={styles.title}>About Us</h2>

      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.text}>
            We are a Nigerian-based supplier of premium tiles and sanitary wares,
            committed to quality, reliability, and excellent customer service.
            Our products are sourced from trusted manufacturers and carefully
            selected to meet the needs of modern homes and commercial projects.
          </p>

          <p className={styles.text}>
            From product selection to delivery, we focus on providing durable,
            stylish solutions that fit local budgets without compromising on
            standards. Whether you are building, renovating, or upgrading, we
            make the process simple and dependable.
          </p>

          <div className={styles.highlights}>
            <span>Trusted sourcing</span>
            <span>Nationwide delivery</span>
            <span>After-sales support</span>
          </div>
        </div>

        {/* <div className={styles.imageWrap}>
          <img
            loading="lazy"
            src="/assets/showroom_about.webp"
            alt="Our showroom"
            className={styles.image}
          />
        </div> */}
      </div>
    </section>
  );
}
