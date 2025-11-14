import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/" className={styles.logo}>BikePooling</Link>
      </div>

      <nav className={styles.nav}>
        <Link to="/offer" className={styles.navLink}>Offer a Ride</Link>
        <Link to="/book" className={styles.navLink}>Book a Ride</Link>
        <Link to="/maps" className={styles.navLink}>Map</Link>
        <Link to="/profile" className={styles.navLink}>Profile</Link>
        <Link to="/login" className={styles.cta}>Login</Link>
      </nav>
    </header>
  );
}
