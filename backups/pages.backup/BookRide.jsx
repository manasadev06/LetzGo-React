import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RideCard from "../components/RideCard";
import MapDummy from "../components/MapDummy";
import styles from "../styles/BookRide.module.css";

const dummyResults = [
  { id:1, driverName:"Hemanth", vehicle:"Non-gear", seatsAvailable:2, time:"08:00" },
  { id:2, driverName:"Priya", vehicle:"Gear", seatsAvailable:1, time:"08:15" },
];

export default function BookRide() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    // placeholder for backend call; using dummy results
    setResults(dummyResults);
  }

  function selectRide(ride) {
    // Send ride data to confirmation via route state
    navigate("/confirmation", { state: { pickup, destination, date, ride }});
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <label>Pickup<input value={pickup} onChange={e=>setPickup(e.target.value)} placeholder="Start location" required /></label>
        <label>Destination<input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Where to?" required /></label>
        <label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)} required /></label>
        <button type="submit">Search</button>
      </form>

      <div className={styles.results}>
        <div className={styles.mapWrap}><MapDummy /></div>
        <div className={styles.cards}>
          {results.length === 0 ? <p>No results yet. Try searching above.</p> :
            results.map(r => <RideCard key={r.id} ride={r} onSelect={selectRide} />)}
        </div>
      </div>
    </div>
  );
}
