import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OfferRide.module.css";

export default function OfferRide() {
  const [form, setForm] = useState({ from:"", to:"", date:"", time:"", vehicleType:"non-gear", seats:1, price:"" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e){ const {name,value} = e.target; setForm(prev=>({...prev,[name]:value})); }

  function handleSubmit(e){
    e.preventDefault();
    if(!form.from || !form.to) { setError("Fill locations"); return; }
    // post to backend later; for now go to confirmation
    navigate("/driver-confirmation", { state: { form } });
  }

  return (
    <div className={styles.wrap}>
      <h2>Offer a Ride</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>From<input name="from" value={form.from} onChange={handleChange} /></label>
        <label>To<input name="to" value={form.to} onChange={handleChange} /></label>
        <label>Date<input type="date" name="date" value={form.date} onChange={handleChange} /></label>
        <label>Time<input type="time" name="time" value={form.time} onChange={handleChange} /></label>
        <label>Vehicle
          <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
            <option value="non-gear">Non-gear</option>
            <option value="gear">Gear</option>
          </select>
        </label>
        <label>Seats
          <input name="seats" type="number" min="1" max="4" value={form.seats} onChange={handleChange} />
        </label>
        <label>Price<input name="price" value={form.price} onChange={handleChange} /></label>

        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Post Ride</button>
      </form>
    </div>
  );
}
