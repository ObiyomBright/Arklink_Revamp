import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer(){
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <strong>Lofloxy Ideal Ltd. (Arklink) </strong>
          <small>Quality Tiles & Sanitary Wares</small>
        </div>

        <div className={styles.copy}>
          © {new Date().getFullYear()} Lofloxy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
