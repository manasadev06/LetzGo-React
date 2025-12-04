import React, { useEffect, useState } from "react";
import styles from "../styles/DriverDashboard.module.css";

export default function DriverDashboard() {
  const [postedRides, setPostedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(null);
  const [selectedRidePassengers, setSelectedRidePassengers] = useState([]);
  const [selectedRideId, setSelectedRideId] = useState(null);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setError("Please log in as a driver to view your rides.");
      setLoading(false);
      return;
    }

    const fetchRides = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/rides/my-offers/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch rides");
        const data = await res.json();
        setPostedRides(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchEarnings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/rides/driver-earnings/${userId}`
        );
        const data = await res.json();
        if (res.ok) setEarnings(data);
      } catch {
        console.error("Earnings fetch failed");
      }
    };

    fetchRides();
    fetchEarnings();
  }, [userId]);

  function getRideStatus(ride) {
    if (ride.status === "CANCELLED") return "CANCELLED";

    const now = new Date();
    const time = ride.rideTime.slice(0, 5); // ✅ fix time format
    const rideDateTime = new Date(`${ride.rideDate}T${time}`);

    if (rideDateTime < now) return "COMPLETED";
    if (ride.seatsAvailable === 0) return "FULL";

    return "UPCOMING";
  }

  return (
    <div className={styles.wrap}>
      {earnings && (
        <div className={styles.summary}>
          <div><strong>Total Rides:</strong> {earnings.totalRides}</div>
          <div><strong>Seats Booked:</strong> {earnings.totalSeatsBooked}</div>
          <div><strong>Total Earnings:</strong> ₹{earnings.totalEarnings}</div>
        </div>
      )}

      <h2>Your Rides</h2>

      {loading && <p>Loading your rides...</p>}
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && postedRides.length === 0 && <p>No rides yet</p>}

      {!loading && !error && postedRides.length > 0 && (
        <ul className={styles.list}>
          {postedRides.map((r) => {
            const rideStatus = getRideStatus(r);
            const isFull = r.seatsAvailable === 0;

            return (
              <li
                key={r.id}
                className={`${styles.card} ${isFull ? styles.full : ""}`}
              >
                <div>
                  <strong>{r.pickup}</strong> → <strong>{r.dropLocation}</strong>
                </div>

                <div>{r.rideDate} • {r.rideTime}</div>
                <div>Vehicle: {r.vehicleType}</div>

                <div>
                  Seats: <strong>{r.seatsBooked} / {r.totalSeats}</strong>
                </div>

                <div>
                  Seats left:{" "}
                  <strong>
                    {r.seatsAvailable === 0 ? "FULL" : r.seatsAvailable}
                  </strong>
                </div>

                <div>Price per seat: ₹{r.pricePerSeat}</div>

                <div>
                  Status:{" "}
                  <strong style={{
                    color:
                      rideStatus === "CANCELLED"
                        ? "#dc2626"
                        : rideStatus === "COMPLETED"
                        ? "#6b7280"
                        : rideStatus === "FULL"
                        ? "#f97316"
                        : "#166534"
                  }}>
                    {rideStatus}
                  </strong>
                </div>

                {(rideStatus === "UPCOMING" || rideStatus === "FULL") && (
                  <button
                    onClick={async () => {
                      const ok = window.confirm("Cancel this ride?");
                      if (!ok) return;

                      const res = await fetch(
                        `http://localhost:5000/api/rides/cancel/${r.id}`,
                        {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId }),
                        }
                      );

                      const data = await res.json();
                      if (!res.ok) {
                        alert(data.message);
                        return;
                      }

                      setPostedRides((prev) =>
                        prev.map((ride) =>
                          ride.id === r.id
                            ? { ...ride, status: "CANCELLED" }
                            : ride
                        )
                      );
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancel Ride
                  </button>
                )}

                {/* ✅ VIEW PASSENGERS BUTTON */}
                <button
                  onClick={async () => {
                    const res = await fetch(
                      `http://localhost:5000/api/rides/${r.id}/passengers`
                    );
                    const data = await res.json();
                    setSelectedRideId(r.id);
                    setSelectedRidePassengers(data);
                  }}
                  className={styles.viewBtn}
                >
                  View Passengers
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* ✅ PASSENGER PANEL */}
      {selectedRideId && (
        <div className={styles.passengersBox}>
          <h3>Passengers</h3>

          {selectedRidePassengers.length === 0 && <p>No bookings yet.</p>}

          {selectedRidePassengers.map((p) => (
            <div key={p.id} className={styles.passengerCard}>
              <strong>{p.name}</strong> ({p.email})
              <div>Seats booked: {p.seats_booked}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
