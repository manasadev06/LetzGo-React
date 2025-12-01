import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const navigate = useNavigate();
  const userId = 1; // TODO: replace with real logged-in user id

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://localhost:5000/api/rides/my-bookings/${userId}`
        );
        const data = await res.json();
        console.log("My bookings:", res.status, data);

        if (!res.ok) {
          setError(data.message || "Failed to load bookings");
        } else {
          setBookings(data);
        }
      } catch (err) {
        console.error("My bookings error:", err);
        setError("Server error while loading bookings");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [userId]);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading bookings...</p>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "auto" }}>
      <h2>My Bookings</h2>

      {error && (
        <p style={{ color: "#b91c1c", fontWeight: "600" }}>{error}</p>
      )}

      {!error && bookings.length === 0 && (
        <p>You have no bookings yet.</p>
      )}

      {!error &&
        bookings.map((b) => (
          <div
            key={b.booking_id}
            style={{
              marginTop: "12px",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p>
              <strong>From:</strong> {b.pickup} &nbsp;
              <strong>To:</strong> {b.drop_location}
            </p>
            <p>
              <strong>Date:</strong> {b.ride_date} &nbsp;
              <strong>Time:</strong> {b.ride_time}
            </p>
            <p>
              <strong>Vehicle:</strong> {b.vehicle_type}
            </p>
            <p>
              <strong>Seats booked:</strong> {b.seats_booked}
            </p>
            <p>
              <strong>Price per seat:</strong> ₹{b.price_per_seat}
            </p>
            <p>
              <strong>Total price:</strong> ₹{b.total_price}
            </p>
            <p>
              <small>Booked at: {b.booked_at}</small>
            </p>
          </div>
        ))}

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          borderRadius: "999px",
          border: "1px solid #9ca3af",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
}
