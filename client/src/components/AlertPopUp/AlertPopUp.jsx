import React, { useEffect } from "react";
import styles from "./AlertPopup.module.css"; 
import { FaTimes } from 'react-icons/fa';

const AlertPopup = ({ message, type = "info", onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span>{message}</span>
      <FaTimes className={styles.closeBtn} onClick={onClose} />
    </div>
  );
};

export default AlertPopup;
