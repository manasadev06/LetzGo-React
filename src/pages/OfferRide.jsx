// src/pages/OfferRide.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiNavigation,
} from "react-icons/fi";
import styles from "../styles/OfferRide.module.css";

export default function OfferRide() {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    vehicleType: "non-gear",
    seats: 1,
    price: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.from || !form.to) {
      setError("Please fill in both pickup and drop-off locations");
      return;
    }

    if (!form.date || !form.time) {
      setError("Please select date and time");
      return;
    }

    if (!form.price) {
      setError("Please enter price per seat");
      return;
    }

    // get logged-in user from localStorage (set during login)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      setError("Please login first");
      navigate("/login");
      return;
    }

    const body = {
      userId: storedUser.id,
      pickup: form.from,
      dropLocation: form.to,
      rideDate: form.date, // YYYY-MM-DD
      rideTime: form.time, // HH:MM
      vehicleType: form.vehicleType, // 'gear' or 'non-gear'
      seatsAvailable: Number(form.seats),
      pricePerSeat: Number(form.price),
    };

    try {
      const response = await fetch("http://localhost:5000/api/rides/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("Offer ride response:", response.status, data);

      if (!response.ok) {
        setError(data.message || "Failed to post ride");
      }
      else{
        navigate("/driver/dashboard");
      }

      // ✅ Success – go to confirmation page
      navigate("/driver-confirmation", {
        state: { form, rideId: data.rideId },
      });
    } catch (err) {
      console.error("Offer ride error:", err);
      setError("Something went wrong. Please try again.");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Offer a Ride</h1>
        <p className={styles.subtitle}>
          Fill in the details below to share your ride with others
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiMapPin className={styles.inputIcon} />
                <span>Pickup Location</span>
              </label>
              <input
                type="text"
                name="from"
                value={form.from}
                onChange={handleChange}
                placeholder="Enter pickup location"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiMapPin className={styles.inputIcon} />
                <span>Drop-off Location</span>
              </label>
              <input
                type="text"
                name="to"
                value={form.to}
                onChange={handleChange}
                placeholder="Enter drop-off location"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiCalendar className={styles.inputIcon} />
                <span>Date</span>
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={styles.input}
                required
                min={today}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiClock className={styles.inputIcon} />
                <span>Time</span>
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiNavigation className={styles.inputIcon} />
                <span>Vehicle Type</span>
              </label>
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="non-gear">Non-gear Bike</option>
                <option value="gear">Gear Bike</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiUsers className={styles.inputIcon} />
                <span>Available Seats</span>
              </label>
              <input
                name="seats"
                type="number"
                min="1"
                max="4"
                value={form.seats}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FiDollarSign className={styles.inputIcon} />
                <span>Price per Seat (₹)</span>
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price per seat"
                className={styles.input}
                min="0"
                required
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              Post Ride
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
