import React, { useState } from "react";
import styles from "./Login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNotification } from "../../Contexts/NotificationContext/NotificationContext";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const validate = () => {
    if (!phone.trim()) return "Phone number is required";
    if (!password) return "Password is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();

    setLoading(true);

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);

    try {
      const API = import.meta.env.VITE_API_BASE;
      const res = await fetch(`${API}/login.php`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        notify({ message: data?.message || "Login failed", type: "error" });
        setLoading(false);
        return;
      }

      if (data.status === "success") {
        // Store details locally
        localStorage.setItem("full_name", data.full_name);
        localStorage.setItem("phone", data.phone);
        localStorage.setItem("role", data.role);

        notify({ message: "Login Successful", type: "success" });
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        notify({ message: data.message, type: "error" });
      }


    } catch (error) {
      console.error(error);
      notify({ message: "Network connection failed. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Login to access your account</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* Phone Number */}
          <label className={styles.label}>
            Phone number
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="Enter phone number"
              required
            />
          </label>

          {/* Password */}
          <label className={styles.label}>
            Password
            <div className={styles.passwordWrap}>
              <input
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          <Link className={styles.link} to="/forgot-password">
            Forgot password?
          </Link>

          <button className={styles.primary} disabled={loading}>
            {loading ? <span className={styles.spinner}></span> : "Sign In"}
          </button>

          <p className={styles.alt}>
            New user?{" "}
            <Link className={styles.link} to="/signup">
              Create account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
