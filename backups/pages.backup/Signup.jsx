import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Signup.module.css";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer"
  });
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

    if (!form.username || !form.email || !form.password) {
      setError("Please fill required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Replace with your backend endpoint when ready
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      // On success, go to login or driver registration
      if (form.role === "driver") navigate("/driver-registration");
      else navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create an account</h2>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label}>
            Username
            <input name="username" value={form.username} onChange={handleChange} className={styles.input} required />
          </label>

          <label className={styles.label}>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} className={styles.input} required />
          </label>

          <label className={styles.label}>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} className={styles.input} />
          </label>

          <label className={styles.label}>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} className={styles.input} required />
          </label>

          <label className={styles.label}>
            Confirm Password
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className={styles.input} required />
          </label>

          <div className={styles.roleRow}>
            <label className={styles.radio}>
              <input type="radio" name="role" value="customer" checked={form.role === "customer"} onChange={handleChange} />
              Customer
            </label>
            <label className={styles.radio}>
              <input type="radio" name="role" value="driver" checked={form.role === "driver"} onChange={handleChange} />
              Driver
            </label>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
