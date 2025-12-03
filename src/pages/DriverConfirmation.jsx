import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DriverConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const form = state.form || {};
  const rideId = state.rideId;

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
      <h1>Ride Posted Successfully</h1>

      {rideId && <p>Ride ID: <strong>{rideId}</strong></p>}

      <div style={{ textAlign: "left", marginTop: "20px" }}>
        <p><strong>From:</strong> {form.from}</p>
        <p><strong>To:</strong> {form.to}</p>
        <p><strong>Date:</strong> {form.date}</p>
        <p><strong>Time:</strong> {form.time}</p>
        <p><strong>Vehicle Type:</strong> {form.vehicleType}</p>
        <p><strong>Seats:</strong> {form.seats}</p>
        <p><strong>Price per Seat:</strong> ₹{form.price}</p>
      </div>

      <button onClick={() => navigate("/driver-dashboard")}>
  Go to Dashboard
</button>

<button onClick={() => navigate("/")}>
  Go to Home
</button>

    </div>
  );
}
