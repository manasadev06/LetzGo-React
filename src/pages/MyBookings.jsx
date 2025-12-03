import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // ✅ get from login

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("[MyBookings] useEffect start, userId =", userId);

    async function fetchBookings() {
      setLoading(true);
      setError("");

      if (!userId) {
        console.log("[MyBookings] No userId, skipping fetch");
        setError("Please login first");
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        console.log(
          "[MyBookings] Fetching:",
          `http://localhost:5000/api/rides/my-bookings/${userId}`
        );

        const res = await fetch(
          `http://localhost:5000/api/rides/my-bookings/${userId}`
        );

        console.log("[MyBookings] Response status:", res.status);

        const data = await res.json().catch((e) => {
          console.error("[MyBookings] Error parsing JSON:", e);
          throw e;
        });

        console.log("[MyBookings] Response data:", data);

        if (!res.ok) {
          setError(data.message || "Failed to load bookings");
          setBookings([]);
        } else {
          // handle both array and { bookings: [...] }
          const list = Array.isArray(data) ? data : data.bookings || [];
          setBookings(list);
        }
      } catch (err) {
        console.error("[MyBookings] Fetch error:", err);
        setError("Server error while loading bookings");
        setBookings([]);
      } finally {
        console.log("[MyBookings] Finished fetch, setLoading(false)");
        setLoading(false);
      }
    }

    fetchBookings();
  }, [userId]);

  if (!userId) {
    return (
      <div style={{ padding: "24px", maxWidth: "800px", margin: "auto" }}>
        <h2>My Bookings</h2>
        <p>Please login to see your bookings.</p>
        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            borderRadius: "999px",
            border: "1px solid #9ca3af",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading bookings...</p>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "auto" }}>
      <h2>My Bookings</h2>

      {error && (
        <p style={{ color: "#b91c1c", fontWeight: "600" }}>{error}</p>
      )}

      {!error && bookings.length === 0 && <p>You have no bookings yet.</p>}

      {!error &&
        bookings.map((b) => (
          <div
            key={b.booking_id || b.id}
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
              <strong>Seats booked:</strong> {b.seats_booked}</p>
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
