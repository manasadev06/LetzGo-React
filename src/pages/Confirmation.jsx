import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapDummy from "../components/MapDummy";
import styles from "../styles/Confirmation.module.css";

export default function Confirmation(){
  const { state } = useLocation();
  const navigate = useNavigate();
  const { pickup, destination, date, ride } = state || {};

  if(!ride) return <div style={{padding:20}}>No booking selected. <button onClick={()=>navigate("/book")}>Search rides</button></div>;

  return (
    <div className={styles.wrap}>
      <h2>Confirm Ride</h2>
      <div className={styles.card}>
        <div><strong>Driver:</strong> {ride.driverName}</div>
        <div><strong>Vehicle:</strong> {ride.vehicle}</div>
        <div><strong>From:</strong> {pickup}</div>
        <div><strong>To:</strong> {destination}</div>
        <div><strong>Date:</strong> {date}</div>
      </div>

      <MapDummy small />

      <div className={styles.actions}>
        <button onClick={()=>alert("Booked! (replace with real API)")}>Confirm & Pay</button>
        <button onClick={()=>navigate(-1)}>Back</button>
      </div>
    </div>
  );
}
