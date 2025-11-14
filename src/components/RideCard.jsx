import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/RideCard.module.css";

export default function RideCard({ ride }) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.driver}>{ride.driverName}</div>
        <div className={styles.meta}>{ride.vehicle} • {ride.seatsAvailable} seats</div>
        <div className={styles.route}>{ride.from} → {ride.to}</div>
      </div>

      <div className={styles.right}>
        <div className={styles.price}>₹{ride.price}</div>
        <div className={styles.time}>{ride.time}</div>
        <Link to={`/ride/${ride.id}`} className={styles.view}>View</Link>
      </div>
    </div>
  );
}
