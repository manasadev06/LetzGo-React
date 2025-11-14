import React from "react";
import styles from "../styles/Profile.module.css";

export default function Profile(){
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className={styles.wrap}>
      <h2>Profile</h2>
      <div className={styles.card}>
        <p><strong>Name:</strong> {user.username || "Guest"}</p>
        <p><strong>Email:</strong> {user.email || "-"}</p>
        <p><strong>Role:</strong> {user.role || "customer"}</p>
      </div>
    </div>
  );
}
