import React from "react";
import styles from "../styles/Dashboard.module.css";

export default function DriverDashboard(){
  // demo content - replace with real data fetch
  const postedRides = [
    { id:1, from:"A", to:"B", date:"2025-11-18", seats:2 },
  ];

  return (
    <div className={styles.wrap}>
      <h2>Your Rides</h2>
      {postedRides.length === 0 ? <p>No rides yet</p> :
        <ul className={styles.list}>
          {postedRides.map(r => <li key={r.id}>{r.from} → {r.to} • {r.date} • {r.seats} seats</li>)}
        </ul>
      }
    </div>
  );
}
