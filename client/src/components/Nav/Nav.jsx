import { useState, useRef, useEffect } from "react";
import styles from "./Nav.module.css";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">Lofloxy</Link>
      </div>

      {/* Desktop Links */}
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tiles">Tiles</Link></li>
        <li><Link to="/sanitary-wares">Sanitary Wares</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
        <li><Link to="/staff-login">Staff Login</Link></li>
        <li><Link to="/cart" className={styles.cart}><FiShoppingCart /></Link></li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className={styles.menuBtn}
        onClick={() => setOpen(!open)}
        aria-label="Toggle Menu"
      >
        {open ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Slide-In Menu */}
      <div
        ref={menuRef}
        className={`${styles.mobileMenu} ${open ? styles.showMenu : ""}`}
      >
        <ul>
          <li onClick={() => setOpen(false)}><Link to="/">Home</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/tiles">Tiles</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/sanitary-wares">Sanitary Wares</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/about-us">About Us</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/staff-login">Staff Login</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/cart">Cart</Link></li>
        </ul>
      </div>
    </nav>
  );
}
