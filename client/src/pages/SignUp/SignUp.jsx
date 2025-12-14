import React, { useState } from "react";
import styles from "./Signup.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNotification } from "../../Contexts/NotificationContext/NotificationContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { notify } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
  if (!formData.name.trim()) return "Full name is required";

  if (!formData.phone.trim()) return "Phone number is required";

  // Check for non-numeric characters
  if (!/^[0-9]+$/.test(formData.phone)) 
    return "Phone number can contain only numbers";

  // Check for exact length
  if (formData.phone.length !== 11)
    return "Phone number must be exactly 11 digits";

  if (!formData.password) return "Password is required";

  if (formData.password.length < 6)
    return "Password must be at least 6 characters";

  if (!formData.confirmPassword)
    return "Please confirm your password";

  if (formData.password !== formData.confirmPassword)
    return "Passwords do not match";

  return null;
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (validation) {
      notify({ message: validation, type: "error" });
      return;
    }

    setLoading(true);

    try {
      const API = import.meta.env.VITE_API_BASE;
      const form = new FormData();
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("password", formData.password);

      const res = await fetch(`${API}/signup.php`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.status !== "success") {
        notify({ message: data.message || "Registration failed", type: "error" });
      } else {
        notify({ message: "Account created successfully", type: "success" });

        // Reset and redirect
        setFormData({
          name: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 900);
      }

    } catch (err) {
      notify({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.container}>
        <div className={styles.fadeIn}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>Start shopping with ease</p>

          <form className={styles.form} onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                maxLength={11}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className={styles.icon}
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showConfPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span
                  className={styles.icon}
                  onClick={() => setShowConfPassword((p) => !p)}
                >
                  {showConfPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button className={styles.signupBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}></span> : "Sign Up"}
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
