import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SearchForm.module.css";

export default function SearchForm({ initial = {} }) {
  const [from, setFrom] = useState(initial.from || "");
  const [to, setTo] = useState(initial.to || "");
  const [date, setDate] = useState(initial.date || "");
  const [seats, setSeats] = useState(initial.seats || 1);
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const qp = new URLSearchParams({ from, to, date, seats }).toString();
    navigate(`/search?${qp}`);
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <input className={styles.input} placeholder="From (city or place)" value={from} onChange={e=>setFrom(e.target.value)} required />
      <input className={styles.input} placeholder="To (city or place)" value={to} onChange={e=>setTo(e.target.value)} required />
      <input className={styles.input} type="date" value={date} onChange={e=>setDate(e.target.value)} required />
      <select className={styles.select} value={seats} onChange={e=>setSeats(e.target.value)}>
        {[1,2,3,4].map(n => <option key={n} value={n}>{n} seat{n>1?'s':''}</option>)}
      </select>
      <button className={styles.button} type="submit">Search rides</button>
    </form>
  );
}
