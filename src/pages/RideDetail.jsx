// src/pages/RideDetail.jsx
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function RideDetail() {
  console.log("[RideDetail] COMPONENT RENDERED");
  const { state } = useLocation();
  const navigate = useNavigate();
  const { rideId } = useParams();

  const ride = state?.ride;
  const isFull = ride.seatsAvailable === 0;
const isCancelled = ride.status === "CANCELLED";
const disableBooking = isFull || isCancelled;


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

  const userId = localStorage.getItem("userId");
  if (!userId) {
    setError("Please login to book a ride.");
    console.log("[RideDetail] No userId in localStorage");
    return;
  }

  const seatCount = Number(seats);
  if (!seatCount || seatCount < 1) {
    setError("Select at least 1 seat");
    console.log("[RideDetail] Invalid seatCount:", seatCount);
    return;
  }

  console.log("[RideDetail] handleBook START", {
    rideId: ride.id,
    userId,
    seats: seatCount,
  });

  try {
    const res = await fetch("http://localhost:5000/api/rides/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rideId: ride.id,
        userId: Number(userId),
        seats: seatCount,
      }),
    });

    console.log("[RideDetail] Response status:", res.status);

    const raw = await res.text();
    console.log("[RideDetail] Raw response text:", raw);

    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error("[RideDetail] JSON parse error:", e);
      setError("Server returned invalid response");
      return;
    }

    console.log("[RideDetail] Parsed data:", data);

    if (!res.ok) {
      setError(data.message || "Failed to book ride");
      return;
    }

    setMessage("Ride booked successfully!");
  } catch (err) {
    console.error("[RideDetail] Fetch error:", err);
    setError("Cannot reach server while booking the ride");
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
  disabled={disableBooking}
  style={{
    marginTop: "16px",
    padding: "10px 18px",
    borderRadius: "999px",
    border: "none",
    background: disableBooking ? "#9ca3af" : "#16a34a",
    color: "#fff",
    fontWeight: "600",
    cursor: disableBooking ? "not-allowed" : "pointer",
  }}
>
  {isCancelled
    ? "Ride Cancelled"
    : isFull
    ? "Ride Full"
    : "Book Ride"}
</button>

  Book Ride

{isCancelled && (
  <p style={{ color: "#dc2626", marginTop: "8px" }}>
    This ride was cancelled by the driver.
  </p>
)}

{isFull && !isCancelled && (
  <p style={{ color: "#f97316", marginTop: "8px" }}>
    No seats available for this ride.
  </p>
)}



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
