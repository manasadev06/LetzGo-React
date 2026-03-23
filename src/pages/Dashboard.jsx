import React, { useState, useEffect } from "react";
import MyBookings from "./MyBookings";
import DriverDashboard from "./DriverDashboard";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard() {
  const [mode, setMode] = useState("PASSENGER"); // PASSENGER or DRIVER
  const username = localStorage.getItem("username") || "Traveler";
  const userId = localStorage.getItem("userId");
  const [stats, setStats] = useState(null);

  // Reusing user stats for strict data requirements (read-only)
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/users/${userId}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => { });
  }, [userId]);

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.welcomeBanner}>
          <h1 className={styles.welcomeTitle}>Welcome back, {username} 👋</h1>
          <p className={styles.welcomeText}>
            Where would you like to go today? Manage your rides and trips easily.
          </p>
        </div>

        {/* Dynamic Summary Cards to meet 'Dashboard analytics style layout' requirement */}
        {stats && (
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Trips</span>
              <div className={styles.summaryValue}>{stats.ridesBooked + stats.ridesOffered}</div>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Role</span>
              <div className={styles.summaryValue}>{mode === "PASSENGER" ? "Passenger" : "Driver"}</div>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Status</span>
              <div className={styles.summaryValue} style={{ color: '#22c55e' }}>Active</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabBtn} ${mode === "PASSENGER" ? styles.activeTab : ""
              }`}
            onClick={() => setMode("PASSENGER")}
          >
            Passenger View
          </button>

          <button
            className={`${styles.tabBtn} ${mode === "DRIVER" ? styles.activeTab : ""
              }`}
            onClick={() => setMode("DRIVER")}
          >
            Driver Dashboard
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {mode === "PASSENGER" && <MyBookings />}
        {mode === "DRIVER" && <DriverDashboard />}
      </div>
    </div>
  );
}
