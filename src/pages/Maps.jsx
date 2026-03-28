import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import MapView from "../components/MapView";

export default function Maps() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { pickup, destination, ride } = state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!pickup || !destination || !ride) {
    return <p style={{ padding: 20 }}>No ride selected.</p>;
  }

  async function confirmBooking() {
    setLoading(true);
    setError("");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Please login to book a ride.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/rides/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rideId: ride.id,
          userId: Number(userId),
          seats: 1, // keep 1 for now
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Booking failed");
        setLoading(false);
        return;
      }

      // ✅ SUCCESS → go to MyBookings
      navigate("/my-bookings");

    } catch (err) {
      setError("Server error while booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: 16 }}>
      <h2>Route Preview</h2>

      <MapView
        pickupText={pickup}
        destinationText={destination}
      />

      {/* RIDE SUMMARY */}
      <div style={{ marginTop: 20 }}>
        <p><strong>Driver:</strong> {ride.driverName}</p>
        <p><strong>Vehicle:</strong> {ride.vehicle}</p>
        <p><strong>Price:</strong> ₹{ride.price} / seat</p>
      </div>

      {/* ACTION */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={confirmBooking}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "10px 18px",
          borderRadius: "999px",
          border: "none",
          background: "#16a34a",
          color: "#fff",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
}
