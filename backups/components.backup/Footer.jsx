import React from "react";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>© {new Date().getFullYear()} BikePooling. All rights reserved.</p>
        <div className={styles.links}>
          <a className={styles.link} href="/about">About</a>
          <a className={styles.link} href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
