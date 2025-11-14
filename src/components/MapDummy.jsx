import React from "react";
import styles from "../styles/Maps.module.css";

export default function MapDummy({ small }) {
  return (
    <div className={small ? styles.mapSmall : styles.map}>
      <div className={styles.pin}>📍</div>
      <div className={styles.legend}>Map placeholder — replace with real map</div>
    </div>
  );
}
