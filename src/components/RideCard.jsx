// src/components/RideCard.jsx
import React from "react";

export default function RideCard({ ride, onClick }) {
  console.log("RideCard props:", ride);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        marginBottom: "12px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        width: "100%",
      }}
    >
      {/* Left: route + details */}
      <div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          {ride.from} → {ride.to}
        </div>

        <div style={{ fontSize: "14px", color: "#4b5563" }}>
          <div>
            <strong>Time:</strong> {ride.time}
          </div>
          <div>
            <strong>Vehicle:</strong> {ride.vehicle}</div>
          <div>
            <strong>Seats:</strong> {ride.seatsAvailable}
          </div>
          <div>
            <strong>Price/seat:</strong> ₹{ride.price}
          </div>
        </div>
      </div>

      {/* Right: View button */}
      <button
        onClick={onClick}
        style={{
          padding: "10px 18px",
          borderRadius: "999px",
          border: "none",
          background: "#2563eb",
          color: "#ffffff",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        View
      </button>
    </div>
    
  );
}
