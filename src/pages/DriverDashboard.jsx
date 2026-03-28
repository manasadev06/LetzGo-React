import React, { useEffect, useState } from "react";
import styles from "../styles/DriverDashboard.module.css";

export default function DriverDashboard() {
  const [postedRides, setPostedRides] = useState([]);
  const [driver, setDriver] = useState(null);
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

    async function fetchDriverDetails() {
      try {
        const res = await fetch(`http://localhost:5000/api/drivers/${userId}`);
        const data = await res.json();
        if (res.ok) setDriver(data);
      } catch (err) {
        console.log("Error fetching driver details");
      }
    }

    fetchDriverDetails();

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
    const time = ride.rideTime.slice(0, 5);
    const rideDateTime = new Date(`${ride.rideDate}T${time}`);
    if (rideDateTime < now) return "COMPLETED";
    if (ride.seatsAvailable === 0) return "FULL";
    return "UPCOMING";
  }

  function getStatusClass(status) {
    switch (status) {
      case "UPCOMING": return styles.statusUpcoming;
      case "COMPLETED": return styles.statusCompleted;
      case "FULL": return styles.statusFull;
      case "CANCELLED": return styles.statusCancelled;
      default: return "";
    }
  }

  function calculateSeatsPercentage(booked, total) {
    return (booked / total) * 100;
  }

  return (
    <div className={styles.wrap}>
      {/* Summary Stats */}
      {earnings && (
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <strong>{earnings.totalRides}</strong>
            <div>Total Rides</div>
          </div>
          <div className={styles.summaryItem}>
            <strong>{earnings.totalSeatsBooked}</strong>
            <div>Seats Booked</div>
          </div>
          <div className={styles.summaryItem}>
            <strong>₹{earnings.totalEarnings}</strong>
            <div>Total Earnings</div>
          </div>
        </div>
      )}

      {driver && (
        <div style={{
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          marginBottom: "20px"
        }}>
          <h3>Driver Details</h3>
          <p><strong>Name:</strong> {driver.full_name}</p>
          <p><strong>Phone:</strong> {driver.phone}</p>
          <p><strong>Vehicle:</strong> {driver.vehicle_type}</p>
          <p><strong>Vehicle No:</strong> {driver.vehicle_no}</p>
        </div>
      )}

      <h2>Your Rides</h2>

      {loading && (
        <div className={styles.loadingState}>
          Loading your rides...
        </div>
      )}

      {!loading && error && (
        <div className={styles.errorState}>
          {error}
        </div>
      )}

      {!loading && !error && postedRides.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🚗</div>
          <h3>No Rides Posted Yet</h3>
          <p>Start offering rides to earn money and help others travel!</p>
        </div>
      )}

      {!loading && !error && postedRides.length > 0 && (
        <ul className={styles.list}>
          {postedRides.map((r) => {
            const rideStatus = getRideStatus(r);
            const isFull = r.seatsAvailable === 0;
            const seatsPercentage = calculateSeatsPercentage(
              r.seatsBooked, r.totalSeats
            );

            return (
              <li
                key={r.id}
                className={`${styles.card} ${isFull ? styles.full : ""}`}
              >
                <div className={styles.rideHeader}>
                  <div className={styles.rideRoute}>
                    <strong>{r.pickup} → {r.dropLocation}</strong>
                  </div>
                  <div className={`${styles.rideStatus} ${getStatusClass(rideStatus)}`}>
                    {rideStatus}
                  </div>
                </div>

                <div className={styles.rideDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date</span>
                    <span className={styles.detailValue}>{r.rideDate}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time</span>
                    <span className={styles.detailValue}>{r.rideTime}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Vehicle</span>
                    <span className={styles.detailValue}>{r.vehicleType}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Price per Seat</span>
                    <span className={styles.detailValue}>₹{r.pricePerSeat}</span>
                  </div>
                </div>

                <div className={styles.seatsProgress}>
                  <div className={styles.seatsInfo}>
                    <span className={styles.detailLabel}>Seats Occupied</span>
                    <span className={styles.detailValue}>
                      {r.seatsBooked} / {r.totalSeats}
                    </span>
                  </div>
                  <div className={styles.seatsBar}>
                    <div
                      className={styles.seatsFill}
                      style={{ width: `${seatsPercentage}%` }}
                    />
                  </div>
                </div>

                <div className={styles.rideActions}>
                  {(rideStatus === "UPCOMING" || rideStatus === "FULL") && (
                    <button
                      onClick={async () => {
                        const ok = window.confirm(
                          "Are you sure you want to cancel this ride?"
                        );
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
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Passengers Panel */}
      {selectedRideId && (
        <div className={styles.passengersSection}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3>Passenger List (Ride #{selectedRideId})</h3>
            <button
              onClick={() => setSelectedRideId(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              Close
            </button>
          </div>

          {selectedRidePassengers.length === 0 && (
            <div className={styles.emptyState}>
              <p>No passengers have booked this ride yet.</p>
            </div>
          )}

          <div className={styles.passengerList}>
            {selectedRidePassengers.map((p) => (
              <div key={p.id} className={styles.passengerCard}>
                <div className={styles.passengerName}>{p.name}</div>
                <div className={styles.passengerEmail}>{p.email}</div>
                <div className={styles.passengerSeats}>
                  🪑 {p.seats_booked} seat{p.seats_booked > 1 ? 's' : ''} booked
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
