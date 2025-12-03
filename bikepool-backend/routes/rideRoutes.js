// routes/rideRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); // mysql2/promise pool
const rideController = require("../controllers/rideController");

// =============================
// 1) OFFER A RIDE
// POST /api/rides/offer
// =============================
router.post("/offer", async (req, res) => {
  console.log("Offer ride body:", req.body);

  const {
    userId,
    pickup,
    dropLocation,
    rideDate,
    rideTime,
    vehicleType, // 'gear' or 'non-gear'
    seatsAvailable,
    pricePerSeat,
  } = req.body;

  if (
    !userId ||
    !pickup ||
    !dropLocation ||
    !rideDate ||
    !rideTime ||
    !vehicleType ||
    !seatsAvailable ||
    pricePerSeat == null
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const sql = `
      INSERT INTO offered_rides
      (user_id, pickup, drop_location, ride_date, ride_time, vehicle_type, seats_available, price_per_seat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      userId,
      pickup,
      dropLocation,
      rideDate,
      rideTime,
      vehicleType,
      seatsAvailable,
      pricePerSeat,
    ]);

    return res.status(201).json({
      message: "Ride offered successfully",
      rideId: result.insertId,
    });
  } catch (err) {
    console.error("Offer ride error:", err);
    return res
      .status(500)
      .json({ message: "Server error while offering ride" });
  }
});

// =============================
// 2) SEARCH RIDES
// POST /api/rides/search
// =============================
router.post("/search", async (req, res) => {
  console.log("Search body:", req.body);

  const { pickup, destination, date } = req.body;

  if (!pickup || !destination || !date) {
    return res
      .status(400)
      .json({ message: "Pickup, destination and date are required" });
  }

  try {
    const sql = `
      SELECT
        r.id,
        u.name AS driverName,
        r.vehicle_type,
        r.seats_available,
        r.pickup,
        r.drop_location,
        DATE_FORMAT(r.ride_time, '%H:%i') AS ride_time,
        r.price_per_seat,
        4.8 AS rating,
        42 AS trips
      FROM offered_rides r
      JOIN users u ON r.user_id = u.id
      WHERE LOWER(r.pickup) LIKE LOWER(CONCAT('%', ?, '%'))
        AND LOWER(r.drop_location) LIKE LOWER(CONCAT('%', ?, '%'))
    `;

    const [rows] = await pool.query(sql, [pickup, destination]);

    console.log("Search rows count:", rows.length);

    return res.json({ rides: rows });
  } catch (err) {
    console.error("Search rides error:", err);
    return res
      .status(500)
      .json({ message: "Server error while searching rides" });
  }
});

// =============================
// 3) BOOK A RIDE
// POST /api/rides/book
// =============================
router.post("/book", rideController.bookRide);
// My bookings for a passenger
router.get("/my-bookings/:userId", rideController.getMyBookings);
router.get("/my-offers/:userId", rideController.getRidesByDriver);
router.delete("/cancel/:rideId", rideController.cancelRide);
router.get("/driver-earnings/:userId", rideController.getDriverEarnings);
router.get("/:rideId/passengers", rideController.getPassengersForRide);

// export router
module.exports = router;
