import React from "react";

export default function Profile() {
  const username = localStorage.getItem("username") || "Guest";
  const email = localStorage.getItem("email") || "Not logged in";
  const role = "customer"; // for now, everyone is a customer/passenger

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "auto" }}>
      <h2>Profile</h2>

      <div
        style={{
          marginTop: "16px",
          padding: "16px 20px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <p>
          <strong>Name:</strong> {username}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Role:</strong> {role}
        </p>
      </div>
    </div>
  );
}
