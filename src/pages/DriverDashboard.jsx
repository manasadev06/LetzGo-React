import React, { useEffect, useState } from "react";
import styles from "../styles/DriverDashboard.module.css";
import { FaMoneyBillWave, FaClock, FaCalendarAlt, FaUser, FaCar } from "react-icons/fa";

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
    const time = ride.rideTime.slice(0, 5);
    const rideDateTime = new Date(`${ride.rideDate}T${time}`);

    if (rideDateTime < now) return "COMPLETED";
    if (ride.seatsAvailable === 0) return "FULL";

    return "UPCOMING";
  }

  return (
    <div className={styles.wrap}>

      {/* Earnings Overview */}
      {earnings && (
        <div className={styles.earningsSection}>
          <div className={styles.earningCard}>
            <div className={styles.earningLabel}>Total Earnings</div>
            <div className={`${styles.earningValue} ${styles.valueGreen}`}>₹{earnings.totalEarnings}</div>
          </div>
          <div className={styles.earningCard}>
            <div className={styles.earningLabel}>Total Rides</div>
            <div className={styles.earningValue}>{earnings.totalRides}</div>
          </div>
          <div className={styles.earningCard}>
            <div className={styles.earningLabel}>Seats Booked</div>
            <div className={styles.earningValue}>{earnings.totalSeatsBooked}</div>
          </div>
        </div>
      )}

      {/* Rides List */}
      <h2 className={styles.sectionTitle}>Your Rides</h2>

      {loading && <p>Loading your rides...</p>}
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && postedRides.length === 0 && <p>No rides posted yet.</p>}

      {!loading && !error && postedRides.length > 0 && (
        <ul className={styles.list}>
          {postedRides.map((r) => {
            const rideStatus = getRideStatus(r);
            // const isFull = r.seatsAvailable === 0;

            let statusClass = styles.statusUp;
            if (rideStatus === 'FULL') statusClass = styles.statusFull;
            if (rideStatus === 'COMPLETED') statusClass = styles.statusDone;
            if (rideStatus === 'CANCELLED') statusClass = styles.statusCancel;

            return (
              <li key={r.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.route}>
                    {r.pickup} <span className={styles.arrow}>➝</span> {r.dropLocation}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><FaCalendarAlt /> Date</span>
                    <span className={styles.infoVal}>{r.rideDate} • {r.rideTime.slice(0, 5)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><FaCar /> Vehicle</span>
                    <span className={styles.infoVal}>{r.vehicleType}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><FaMoneyBillWave /> Price</span>
                    <span className={styles.infoVal}>₹{r.pricePerSeat}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><FaUser /> Seats</span>
                    <span className={styles.infoVal}>{r.seatsBooked} / {r.totalSeats}</span>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <span className={`${styles.statusBadge} ${statusClass}`}>{rideStatus}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    onClick={async () => {
                      const res = await fetch(
                        `http://localhost:5000/api/rides/${r.id}/passengers`
                      );
                      const data = await res.json();
                      setSelectedRideId(r.id);
                      setSelectedRidePassengers(data);
                    }}
                    className={`${styles.btn} ${styles.viewBtn}`}
                  >
                    Passengers
                  </button>

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
                      className={`${styles.btn} ${styles.cancelBtn}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Selected Ride Passengers View */}
      {selectedRideId && (
        <div className={styles.passengersSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Passenger List (Ride #{selectedRideId})</h3>
            <button onClick={() => setSelectedRideId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>Close</button>
          </div>

          {selectedRidePassengers.length === 0 && <p className={styles.textMuted}>No passengers have booked this ride yet.</p>}

          <div className={styles.passengerGrid}>
            {selectedRidePassengers.map((p) => (
              <div key={p.id} className={styles.passengerCard}>
                <div className={styles.pName}>{p.name}</div>
                <div className={styles.pEmail}>{p.email}</div>
                <div className={styles.pSeats}>{p.seats_booked} Seat(s)</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
