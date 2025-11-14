import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DriverRegistration.module.css";

export default function DriverRegistration(){
  const [form, setForm] = useState({ fullName:"", phone:"", vehicleType:"non-gear", vehicleNo:"" });
  const [error,setError] = useState("");
  const navigate = useNavigate();

  function change(e){ setForm(p=>({...p,[e.target.name]:e.target.value})); }
  function submit(e){ e.preventDefault(); if(!form.fullName) { setError("Enter name"); return; } navigate("/driver-dashboard"); }

  return (
    <div className={styles.wrap}>
      <h2>Driver Registration</h2>
      <form onSubmit={submit} className={styles.form}>
        <label>Full name<input name="fullName" value={form.fullName} onChange={change} /></label>
        <label>Phone<input name="phone" value={form.phone} onChange={change} /></label>
        <label>Vehicle Type
          <select name="vehicleType" value={form.vehicleType} onChange={change}>
            <option value="non-gear">Non-gear</option>
            <option value="gear">Gear</option>
          </select>
        </label>
        <label>Vehicle Number<input name="vehicleNo" value={form.vehicleNo} onChange={change} /></label>
        {error && <p className={styles.err}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
