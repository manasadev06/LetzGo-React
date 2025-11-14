import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const DUMMY = { 
  id: "1", 
  driverName: "Hemanth", 
  from: "A", 
  to: "B", 
  time: "08:00", 
  price: 30, 
  seatsAvailable: 2, 
  vehicle: "Non-gear", 
  notes: "Friendly driver. Pickup near main gate." 
};

export default function RideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // frontend-only → using DUMMY data
  const ride = DUMMY;

  function handleBook() {
    alert("Booking simulated (frontend-only).");
    navigate("/confirmation");
  }

  return (
    <div style={{ maxWidth:900, margin:"20px auto", padding:16 }}>
      <h2>{ride.from} → {ride.to}</h2>

      <p><strong>Driver:</strong> {ride.driverName} • {ride.vehicle}</p>
      <p><strong>Time:</strong> {ride.time} • <strong>Price:</strong> ₹{ride.price}</p>
      <p>{ride.notes}</p>

      <div style={{ marginTop:18 }}>
        <button 
          onClick={handleBook} 
          style={{ 
            padding:"10px 14px", 
            background:"#059669", 
            color:"white", 
            borderRadius:8, 
            border:"none",
            cursor:"pointer"
          }}
        >
          Book ride
        </button>
      </div>
    </div>
  );
}
