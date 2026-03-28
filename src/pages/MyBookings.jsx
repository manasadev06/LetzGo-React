import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MyBookings.module.css";

export default function MyBookings() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBooking, setExpandedBooking] = useState(null);

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

  const toggleBookingDetails = async (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  const formatPhoneNumber = (phone) => {
    // Format phone number for display
    if (!phone) return "Not available";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  if (!userId) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h3>Login Required</h3>
          <p>Please login to view your bookings and manage your rides.</p>
          <button
            onClick={() => navigate("/login")}
            className={styles.loginButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          Loading your bookings...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Bookings</h2>
        <p>Manage your ride bookings and track your journey history</p>
      </div>

      {error && (
        <div className={styles.errorState}>
          {error}
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🚗</div>
          <h3>No Bookings Yet</h3>
          <p>You haven't booked any rides yet. Start exploring and book your first ride!</p>
          <button
            onClick={() => navigate("/book-ride")}
            className={styles.loginButton}
          >
            Book a Ride
          </button>
        </div>
      )}

      {!error && bookings.length > 0 && (
        <div className={styles.bookingsList}>
          {bookings.map((b) => (
            <div
              key={b.booking_id || b.id}
              className={styles.bookingCard}
            >
              <div className={styles.bookingHeader}>
                <div className={styles.bookingRoute}>
                  <h3>
                    <span className={styles.routeIcon}>📍</span>
                    Ride Booking
                  </h3>
                  <div className={styles.routeText}>
                    <div className={styles.fromTo}>
                      <span>{b.pickup}</span>
                      <span className={styles.arrow}>→</span>
                      <span>{b.drop_location}</span>
                    </div>
                  </div>
                </div>
                <div className={`${styles.bookingStatus} ${styles.statusConfirmed}`}>
                  Confirmed
                </div>
              </div>

              <div className={styles.bookingDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>{b.ride_date}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Time</span>
                  <span className={styles.detailValue}>{b.ride_time}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Vehicle</span>
                  <span className={styles.detailValue}>{b.vehicle_type}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Seats</span>
                  <span className={styles.detailValue}>{b.seats_booked}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Price per Seat</span>
                  <span className={styles.detailValue}>₹{b.price_per_seat}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Total Price</span>
                  <span className={styles.detailValue}>₹{b.total_price}</span>
                </div>
              </div>

              {/* Driver Contact Section */}
              <div className={styles.driverSection}>
                <div className={styles.driverHeader}>
                  <span className={styles.driverIcon}>👨‍✈️</span>
                  <span className={styles.driverTitle}>Driver Information</span>
                </div>
                <div className={styles.driverDetails}>
                  <div className={styles.driverInfo}>
                    <span className={styles.driverName}>{b.driver_name || 'Driver'}</span>
                    <span className={styles.driverRating}>
                      ⭐ {b.driver_rating || '4.5'} ({b.driver_trips || '100'} trips)
                    </span>
                  </div>
                  <div className={styles.driverContact}>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📞</span>
                      <span className={styles.contactValue}>
                        {formatPhoneNumber(b.driver_phone)}
                      </span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>✉️</span>
                      <span className={styles.contactValue}>
                        {b.driver_email || 'driver@example.com'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.bookingFooter}>
                <div className={styles.bookingMeta}>
                  Booked at: {b.booked_at}
                </div>
                <div className={styles.bookingActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.primary}`}
                    onClick={() => toggleBookingDetails(b.booking_id || b.id)}
                  >
                    {expandedBooking === (b.booking_id || b.id) ? 'Hide Details' : 'View Details'}
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => {
                      // Copy driver phone to clipboard
                      if (b.driver_phone) {
                        navigator.clipboard.writeText(b.driver_phone);
                        alert('Driver phone number copied to clipboard!');
                      } else {
                        alert('Driver contact information not available');
                      }
                    }}
                  >
                    Contact Driver
                  </button>
                </div>
              </div>

              {/* Expandable Details Section */}
              {expandedBooking === (b.booking_id || b.id) && (
                <div className={styles.expandedDetails}>
                  <div className={styles.detailsSection}>
                    <h4>Additional Information</h4>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Booking ID</span>
                        <span className={styles.detailValue}>#{b.booking_id || b.id}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Vehicle Number</span>
                        <span className={styles.detailValue}>{b.vehicle_number || 'N/A'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Driver License</span>
                        <span className={styles.detailValue}>{b.driver_license || 'Verified'}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Estimated Duration</span>
                        <span className={styles.detailValue}>{b.estimated_duration || '45 mins'}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionsSection}>
                    <h4>Quick Actions</h4>
                    <div className={styles.quickActions}>
                      <button className={styles.quickActionButton}>
                        <span className={styles.actionIcon}>📍</span>
                        Track Ride
                      </button>
                      <button className={styles.quickActionButton}>
                        <span className={styles.actionIcon}>💬</span>
                        Message Driver
                      </button>
                      <button className={styles.quickActionButton}>
                        <span className={styles.actionIcon}>📞</span>
                        Call Driver
                      </button>
                      <button className={styles.quickActionButton}>
                        <span className={styles.actionIcon}>❓</span>
                        Get Help
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
