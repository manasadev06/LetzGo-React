import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiClock, FiDollarSign, FiUsers, FiNavigation } from "react-icons/fi";
import styles from "../styles/OfferRide.module.css";

export default function OfferRide() {
  const [form, setForm] = useState({ 
    from: "", 
    to: "", 
    date: "", 
    time: "", 
    vehicleType: "non-gear", 
    seats: 1, 
    price: "" 
  });
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) { 
    const { name, value } = e.target; 
    setForm(prev => ({ ...prev, [name]: value })); 
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.from || !form.to) { 
      setError("Please fill in both pickup and drop-off locations"); 
      return; 
    }
    if (!form.date || !form.time) {
      setError("Please select date and time");
      return;
    }
    // post to backend later; for now go to confirmation
    navigate("/driver-confirmation", { state: { form } });
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Offer a Ride</h1>
        <p className={styles.subtitle}>Fill in the details below to share your ride with others</p>
        
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
                min={new Date().toISOString().split('T')[0]}
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
            <button type="button" className={styles.secondaryButton} onClick={() => navigate(-1)}>
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
