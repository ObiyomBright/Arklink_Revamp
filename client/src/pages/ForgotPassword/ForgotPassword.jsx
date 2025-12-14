import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNotification } from "../../Contexts/NotificationContext/NotificationContext";

const ForgotPassword = () => {
  const { notify } = useNotification();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const [step, setStep] = useState(1); // 1: send code, 2: verify code, 3: reset password
  const [loading, setLoading] = useState(false);

  const validatePhone = () => {
    if (!phone.trim()) return "Phone number is required";
    if (!/^[0-9]{11}$/.test(phone)) return "Phone must be 11 digits";
    return null;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    const validation = validatePhone();
    if (validation) return notify({ message: validation, type: "error" });

    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_BASE;
      const formData = new FormData();
      formData.append("phone", phone);

      const res = await fetch(`${API}/forgotpassword.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.status === "success") {
        notify({ message: "Code sent to your phone", type: "success" });
        setStep(2);
      } else {
        notify({ message: data.message, type: "error" });
      }
    } catch (err) {
      notify({ message: "Network error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code.trim()) return notify({ message: "Enter the code", type: "error" });

    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_BASE;
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("code", code);

      const res = await fetch(`${API}/verifycode.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.status === "success") {
        notify({ message: "Code verified. Set new password.", type: "success" });
        setStep(3);
      } else {
        notify({ message: data.message, type: "error" });
      }
    } catch (err) {
      notify({ message: "Network error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6)
      return notify({ message: "Password must be at least 6 characters", type: "error" });

    if (newPassword !== confirmPassword)
      return notify({ message: "Passwords do not match", type: "error" });

    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_BASE;
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("password", newPassword);

      const res = await fetch(`${API}/resetpassword.php`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.status === "success") {
        notify({ message: "Password reset successfully", type: "success" });
        setStep(1);
        setPhone(""); setCode(""); setNewPassword(""); setConfirmPassword("");
      } else {
        notify({ message: data.message, type: "error" });
      }
    } catch (err) {
      notify({ message: "Network error. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={step === 1 ? handleSendCode : step === 2 ? handleVerifyCode : handleResetPassword}>
        <h2 className={styles.title}>Forgot Password</h2>
        {step === 1 && (
          <>
            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                maxLength={11}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Link to="/login" className={styles.login} >Login instead?</Link>

            <button className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}></span> : "Send Code"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.inputGroup}>
              <label>Enter Code</label>
              <input
                type="text"
                placeholder="4-digit code"
                value={code}
                maxLength={4}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}></span> : "Verify Code"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className={styles.inputGroup}>
              <label>New Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span className={styles.icon} onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <FaEyeSlash/> : <FaEye/>}
                </span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showConfPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className={styles.icon} onClick={() => setShowConfPassword(p => !p)}>
                  {showConfPassword ? <FaEyeSlash/> : <FaEye/>}
                </span>
              </div>
            </div>
            <button className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner}></span> : "Reset Password"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
