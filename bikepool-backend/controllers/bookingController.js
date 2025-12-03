// controllers/rideController.js
const db = require("../db");

// 🚐 POST /api/rides/book
exports.bookRide = (req, res) => {
  const { userId, rideId, seats } = req.body;
  const seatCount = seats || 1;

  console.log("📩 Book body:", req.body);

  if (!userId || !rideId) {
    return res.status(400).json({ message: "userId and rideId are required" });
  }

  // 1️⃣ Get the ride from offered_rides
  const getRideSql = "SELECT * FROM offered_rides WHERE id = ?";
  db.query(getRideSql, [rideId], (err, rideRows) => {
    if (err) {
      console.error("Error fetching ride:", err);
      return res
        .status(500)
        .json({ message: "Server error fetching ride", error: err.message });
    }

    if (rideRows.length === 0) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const ride = rideRows[0];

    if (ride.seats_available < seatCount) {
      return res
        .status(400)
        .json({ message: "Not enough seats available" });
    }

    const totalPrice = ride.price_per_seat * seatCount;

    // 2️⃣ Insert into bookings table
    const insertBookingSql = `
      INSERT INTO bookings (user_id, ride_id, seats, total_price, status)
      VALUES (?, ?, ?, ?, 'CONFIRMED')
    `;
    db.query(
      insertBookingSql,
      [userId, rideId, seatCount, totalPrice],
      (err, result) => {
        if (err) {
          console.error("Error inserting booking:", err);
          return res.status(500).json({
            message: "Server error inserting booking",
            error: err.message,
          });
        }

        // 3️⃣ Decrease seats in offered_rides
        const updateSeatsSql = `
          UPDATE offered_rides 
          SET seats_available = seats_available - ? 
          WHERE id = ?
        `;
        db.query(updateSeatsSql, [seatCount, rideId], (err2) => {
          if (err2) {
            console.error("Error updating seats:", err2);
            return res.status(500).json({
              message: "Server error updating seats",
              error: err2.message,
            });
          }

          return res.status(201).json({
            message: "Booking confirmed",
            bookingId: result.insertId,
            totalPrice,
          });
        });
      }
    );
  });
};
