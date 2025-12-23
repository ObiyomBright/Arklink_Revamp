import { useState, useRef, useEffect } from "react";
import styles from "./Nav.module.css";
// import Logo from '../../assets/logo1.png';
import { FaTimes, FaBars } from "react-icons/fa";
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
        {/* <img src={Logo} alt="logo" className={styles.logoImage}/> */}
        <Link to="">Lofloxy</Link>
      </div>

      {/* Desktop Links */}
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/tiles">Tiles</Link></li>
        <li><Link to="/sanitary">Sanitary Wares</Link></li>
        <li><Link to="">About Us</Link></li>
        <li><Link to="/login">Staff Login</Link></li>
        <li><Link to="/cart">Cart</Link></li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className={styles.menuBtn}
        onClick={() => setOpen(!open)}
        aria-label="Toggle Menu"
      >
        <FaBars />
      </button>

      {/* Mobile Slide-In Menu */}
      <div
        ref={menuRef}
        className={`${styles.mobileMenu} ${open ? styles.showMenu : ""}`}
      >
        {/* Close Button */}
        <button
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
          aria-label="Close Menu"
        >
          <FaTimes size={25} />
        </button>

        <ul>
          <li onClick={() => setOpen(false)}><Link to="/">Home</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/tiles">Tiles</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/sanitary">Sanitary Wares</Link></li>
          <li onClick={() => setOpen(false)}><Link to="">About Us</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/login">Staff Login</Link></li>
          <li onClick={() => setOpen(false)}><Link to="/cart">Cart</Link></li>
        </ul>
      </div>
    </nav>
  );
}
