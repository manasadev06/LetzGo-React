// src/pages/RideDetail.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function RideDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { rideId } = useParams();

  const ride = state?.ride;

  // local state for booking
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // TODO: replace with real logged-in user id
  const userId = 1;

  if (!ride) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Ride Details</h2>
        <p>No ride data found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  async function handleBook() {
    setMessage("");
    setError("");
    const seatCount = Number(seats);

    try {
      const res = await fetch(
        `http://localhost:5000/api/rides/book`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rideId: ride.id,
            userId, 
            seats:seatCount,
           }),
        }
      );

      const data = await res.json();
      console.log("Book response:", res.status, data);

      if (!res.ok) {
        setError(data.message || "Failed to book ride");
        return;
      }

      setMessage("Ride booked successfully!");
    } catch (err) {
      console.error("Book error:", err);
      setError("Something went wrong while booking the ride");
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "auto" }}>
      <h2>Ride Details (ID: {rideId})</h2>

      <p><strong>From:</strong> {ride.from}</p>
      <p><strong>To:</strong> {ride.to}</p>
      <p><strong>Time:</strong> {ride.time}</p>
      <p><strong>Vehicle:</strong> {ride.vehicle}</p>
      <p><strong>Seats Available:</strong> {ride.seatsAvailable}</p>
      <p><strong>Price per seat:</strong> ₹{ride.price}</p>

      <hr />

      <p><strong>Driver:</strong> {ride.driverName}</p>
      <p><strong>Rating:</strong> ⭐ {ride.rating}</p>
      <p><strong>Total trips:</strong> {ride.trips}</p>

      <hr />

      {/* Booking controls */}
      <div style={{ marginTop: "12px" }}>
  <label>
    <strong>Seats to book: </strong>
    <select
      value={seats}
      onChange={(e) => setSeats(Number(e.target.value))}
      style={{ marginLeft: "8px", padding: "4px 8px" }}
    >
      {Array.from({ length: ride.seatsAvailable }, (_, i) => i + 1).map(
        (n) => (
          <option key={n} value={n}>
            {n}
          </option>
        )
      )}
    </select>
  </label>
</div>

      <button
        onClick={handleBook}
        style={{
          marginTop: "16px",
          padding: "10px 18px",
          borderRadius: "999px",
          border: "none",
          background: "#16a34a",
          color: "#fff",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Book Ride
      </button>

      {message && (
        <p style={{ marginTop: "10px", color: "#15803d", fontWeight: "600" }}>
          {message}
        </p>
      )}
      {error && (
        <p style={{ marginTop: "10px", color: "#b91c1c", fontWeight: "600" }}>
          {error}
        </p>
      )}

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "12px",
          marginLeft: "8px",
          padding: "8px 16px",
          borderRadius: "999px",
          border: "1px solid #9ca3af",
          background: "#fff",
          color: "#111827",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
}
