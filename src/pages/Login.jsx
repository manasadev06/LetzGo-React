// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import styles from "../styles/Login.module.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

 async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    // Read body ONLY ONCE
    const data = await res.json();

    if (!res.ok) {
  throw new Error(data.message || "Login failed");
} else {
  // Clear old data
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("email");

  // Store new user
  localStorage.setItem("userId", data.user.id);
  localStorage.setItem("username", data.user.username);
  localStorage.setItem("email", data.user.email);

  navigate("/"); 
}
    // success: store user and go home
   
    // or wherever you want after login
  } catch (err) {
    setError(err.message || "An error occurred during login.");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        {error && <div className={styles.error}>{error}</div>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FiMail className={styles.icon} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <FiLock className={styles.icon} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <FiLogIn className={styles.buttonIcon} />}
          </button>

          <div className={styles.footer}>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className={styles.link}>
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}