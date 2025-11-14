import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RideCard from "../components/RideCard";
import styles from "../styles/SearchResults.module.css";

const DUMMY = [
  { id: "1", driverName: "Hemanth", vehicle: "Non-gear", seatsAvailable: 2, from: "A", to: "B", time: "08:00", price: 30 },
  { id: "2", driverName: "Priya", vehicle: "Gear", seatsAvailable: 1, from: "A", to: "B", time: "08:15", price: 35 },
  { id: "3", driverName: "Ravi", vehicle: "Non-gear", seatsAvailable: 3, from: "C", to: "D", time: "09:00", price: 40 }
];

export default function SearchResults() {
  const { search } = useLocation();
  const q = Object.fromEntries(new URLSearchParams(search));
  const [results, setResults] = useState([]);

  useEffect(() => {
    const filtered = DUMMY.filter(r =>
      r.from.toLowerCase().includes((q.from || "").toLowerCase()) &&
      r.to.toLowerCase().includes((q.to || "").toLowerCase())
    );
    setResults(filtered);
  }, [search]);

  return (
    <div style={{ maxWidth:1100, margin:"20px auto", padding:16 }}>
      <h2>Rides: {q.from || "—"} → {q.to || "—"}</h2>
      <div className={styles.wrapper}>
        <aside className={styles.filters}>
          <div className={styles.filterCard}>
            <h4>Filters</h4>
            <label><input type="checkbox" /> Gear</label><br />
            <label><input type="checkbox" /> Non-gear</label>
          </div>
        </aside>

        <main className={styles.results}>
          {results.length === 0 ? <p>No rides found. Try broader search.</p> : results.map(r => <RideCard key={r.id} ride={r} />)}
        </main>
      </div>
    </div>
  );
}
