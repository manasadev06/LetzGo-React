import React, { useState } from "react";
import MyBookings from "./MyBookings";
import DriverDashboard from "./DriverDashboard";
import styles from "../styles/Dashboard.module.css";

export default function Dashboard() {
  const [mode, setMode] = useState("PASSENGER"); // PASSENGER or DRIVER

  return (
    <div className={styles.wrap}>
      <h2>Dashboard</h2>

      {/* MODE SWITCH */}
      <div className={styles.modeSwitch}>
        <button
          className={`${styles.switchBtn} ${
            mode === "PASSENGER" ? styles.active : ""
          }`}
          onClick={() => setMode("PASSENGER")}
        >
          Passenger
        </button>

        <button
          className={`${styles.switchBtn} ${
            mode === "DRIVER" ? styles.active : ""
          }`}
          onClick={() => setMode("DRIVER")}
        >
          Driver
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.modeContent}>
        {mode === "PASSENGER" && <MyBookings />}
        {mode === "DRIVER" && <DriverDashboard />}
      </div>
    </div>
  );
}
