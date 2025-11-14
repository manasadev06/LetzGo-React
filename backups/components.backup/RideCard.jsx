import React from "react";
import styles from "../styles/RideCard.module.css";

export default function RideCard({ ride, onSelect }) {
  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <h4>{ride.driverName}</h4>
        <p>{ride.vehicle} • {ride.seatsAvailable} seats</p>
      </div>
      <div className={styles.meta}>
        <p>{ride.time}</p>
        <button onClick={() => onSelect(ride)}>Select</button>
      </div>
    </div>
  );
}
