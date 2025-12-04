import React, { useEffect, useState } from "react";

export default function Profile() {
  const username = localStorage.getItem("username") || "Guest";
  const email = localStorage.getItem("email") || "Not available";
  const role = "Passenger / Driver";
  const userId = localStorage.getItem("userId");

  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
const [nameInput, setNameInput] = useState(username);
const [saving, setSaving] = useState(false);




  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/users/${userId}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, [userId]);

  const avatarLetter = username.charAt(0).toUpperCase();

  const cardStyle = {
    padding: "16px",
    borderRadius: "14px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  };

  const countStyle = {
    fontSize: "22px",
    fontWeight: "700",
    marginTop: "6px",
  };

const primaryBtn = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "8px 14px",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontWeight: "600",
};


  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700" }}>Profile</h2>

      {/* PROFILE CARD */}
      <div
        style={{
          marginTop: "20px",
          padding: "24px",
          borderRadius: "16px",
          background: "#ffffff",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          alignItems: "center",
        }}
      >
        {/* AVATAR */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "#2563eb",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          {avatarLetter}
        </div>

        {/* INFO */}
        <div style={{ flex: 1, minWidth: "220px" }}>
         {!editing ? (
  <p style={{ fontSize: "18px", fontWeight: "600" }}>{username}</p>
) : (
  <input
    value={nameInput}
    onChange={(e) => setNameInput(e.target.value)}
    style={{
      padding: "8px 10px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "16px",
    }}
  />
)}

          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role}</p>
        </div>

        {/* ACTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {!editing ? (
  <button
    onClick={() => setEditing(true)}
    style={secondaryBtn}
  >
    Edit Profile
  </button>
) : (
  <>
    <button
      disabled={saving}
      onClick={async () => {
        if (!nameInput.trim()) {
          alert("Name cannot be empty");
          return;
        }

        setSaving(true);

        const res = await fetch(
          `http://localhost:5000/api/users/${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nameInput }),
          }
        );

        const data = await res.json();
        setSaving(false);

        if (!res.ok) {
          alert(data.message || "Update failed");
          return;
        }

        // ✅ update localStorage + UI
        localStorage.setItem("username", data.name);
        setEditing(false);
        window.location.reload(); // simplest reliable sync
      }}
      style={primaryBtn}
    >
      {saving ? "Saving..." : "Save"}
    </button>

    <button
      onClick={() => {
        setEditing(false);
        setNameInput(username);
      }}
      style={secondaryBtn}
    >
      Cancel
    </button>
  </>
)}


          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: "none",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      {stats && (
        <div
          style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          <div style={cardStyle}>
            <strong>Rides Booked</strong>
            <div style={countStyle}>{stats.ridesBooked}</div>
          </div>

          <div style={cardStyle}>
            <strong>Rides Offered</strong>
            <div style={countStyle}>{stats.ridesOffered}</div>
          </div>
        </div>
      )}
    </div>
  );
}
