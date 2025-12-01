// controllers/rideController.js
const db = require("../config/db"); // mysql2 connection

// 🔍 GET /api/rides/search?from=A&to=B
exports.searchRides = (req, res) => {
  const { from, to } = req.query;

  const fromLike = `%${from || ""}%`;
  const toLike = `%${to || ""}%`;

  const sql = `
    SELECT 
      id,
      user_id,
      pickup,
      drop_location,
      ride_date,
      ride_time,
      vehicle_type,
      seats_available,
      price_per_seat
    FROM offered_rides
    WHERE pickup LIKE ? AND drop_location LIKE ?
  `;

  db.query(sql, [fromLike, toLike], (err, results) => {
    if (err) {
      console.error("Error searching rides:", err);
      return res.status(500).json({ message: "Error searching rides" });
    }

    return res.json(results);
  });
};


// 🚐 POST /api/rides/book
exports.bookRide = (req, res) => {
  const { userId, rideId, seats } = req.body;
  const seatCount = seats || 1;

  if (!userId || !rideId) {
    return res.status(400).json({ message: "userId and rideId are required" });
  }

  const getRideSql = "SELECT * FROM offered_rides WHERE id = ?";
  db.query(getRideSql, [rideId], (err, rideRows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (rideRows.length === 0) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const ride = rideRows[0];

    if (ride.seats_available < seatCount) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const insertBookingSql = `
      INSERT INTO bookings (passenger_id, ride_id, seats_booked)
      VALUES (?, ?, ?)
    `;

    db.query(
      insertBookingSql,
      [userId, rideId, seatCount],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Booking failed" });
        }

        const updateSeatsSql = `
          UPDATE offered_rides
          SET seats_available = seats_available - ?
          WHERE id = ?
        `;

        db.query(updateSeatsSql, [seatCount, rideId], (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ message: "Seat update failed" });
          }

          return res.status(201).json({
            message: "Booking confirmed ✅",
            bookingId: result.insertId,
          });
        });
      }
    );
  });
};

// 👤 GET /api/rides/my-bookings/:userId
exports.getMyBookings = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const sql = `
    SELECT
      b.id AS booking_id,
      b.seats_booked,
      b.booked_at,
      r.id AS ride_id,
      r.pickup,
      r.drop_location,
      r.ride_date,
      DATE_FORMAT(r.ride_time, '%H:%i') AS ride_time,
      r.vehicle_type,
      r.price_per_seat,
      (r.price_per_seat * b.seats_booked) AS total_price
    FROM bookings b
    JOIN offered_rides r ON b.ride_id = r.id
    WHERE b.passenger_id = ?
    ORDER BY b.booked_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching my bookings:", err);
      return res
        .status(500)
        .json({ message: "Server error while fetching bookings" });
    }

    return res.json(rows);
  });
};

