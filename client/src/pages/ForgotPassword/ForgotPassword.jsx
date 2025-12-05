import { useState } from "react";
import styles from "./ForgotPassword.module.css";
import { useNotification } from "../../Contexts/NotificationContext/NotificationContext";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const { notify } = useNotification();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      notify("Please enter your email", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://your-backend-url/reset-password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === "success") {
        notify("Password reset link sent to your email", "success");
      } else {
        notify(data.message || "Email not found", "error");
      }
    } catch (error) {
      notify("Network error. Try again later", "error");
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Forgot Password</h2>

        <p className={styles.subtitle}>
          Enter your email below and we’ll send you a reset link.
        </p>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className={styles.bottomText}>
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
