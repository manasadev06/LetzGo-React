// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// change origin to your React port (3000 if CRA, 5173 if Vite)
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api", bookingRoutes);
app.use("/api/users", userRoutes);
app.get("/api/drivers/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await db.query(
      "SELECT full_name, phone, vehicle_typ, vehicle_no FROM drivers WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching driver details" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
