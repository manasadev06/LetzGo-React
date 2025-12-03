const db = require("../db"); // use the single pool

// =============================
// 1) SEARCH RIDES
// =============================
exports.searchRides = async (req, res) => {
  const { from, to } = req.query;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        id,
        user_id,
        pickup,
        drop_location,
        ride_date,
        DATE_FORMAT(ride_time, '%H:%i') AS ride_time,
        vehicle_type,
        seats_available,
        price_per_seat
      FROM offered_rides
      WHERE pickup LIKE ? AND drop_location LIKE ? AND status = 'ACTIVE'
      `,
      [`%${from || ""}%`, `%${to || ""}%`]
    );

    return res.json(rows);
  } catch (err) {
    console.error("searchRides error:", err);
    return res.status(500).json({ message: "Error searching rides" });
  }
};

// =============================
// 2) BOOK RIDE
// =============================
exports.bookRide = async (req, res) => {
  const { userId, rideId, seats } = req.body;
  const seatCount = Number(seats) || 1;

  if (!userId || !rideId) {
    return res.status(400).json({ message: "userId and rideId are required" });
  }

  try {
    // get ride
    const [rides] = await db.query(
      "SELECT seats_available, price_per_seat FROM offered_rides WHERE id = ?",
      [rideId]
    );

    if (rides.length === 0) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const ride = rides[0];

    if (ride.seats_available < seatCount) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // insert booking
    const totalPrice = seatCount * ride.price_per_seat;

    const [result] = await db.query(
      `
      INSERT INTO bookings (passenger_id, ride_id, seats_booked)
      VALUES (?, ?, ?)
      `,
      [userId, rideId, seatCount]
    );

    // update seats
    await db.query(
      "UPDATE offered_rides SET seats_available = seats_available - ? WHERE id = ?",
      [seatCount, rideId]
    );

    return res.status(201).json({
      message: "Booking confirmed",
      bookingId: result.insertId,
    });
  } catch (err) {
    console.error("bookRide error:", err);
    return res.status(500).json({ message: "Server error booking ride" });
  }
};

// =============================
// 3) MY BOOKINGS
// =============================
exports.getMyBookings = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT
        b.id AS booking_id,
        b.seats_booked,
        b.booked_at,
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
      `,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("getMyBookings error:", err);
    return res
      .status(500)
      .json({ message: "Error fetching bookings" });
  }
};


// =============================
// 4) MY OFFERS (DRIVER DASHBOARD)
// =============================
exports.getRidesByDriver = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        r.id,
        r.pickup,
        r.drop_location AS dropLocation,
        r.ride_date AS rideDate,
        r.status,
        DATE_FORMAT(r.ride_time, '%H:%i') AS rideTime,
        r.vehicle_type AS vehicleType,
        r.seats_available AS seatsAvailable,
        r.price_per_seat AS pricePerSeat,

        -- seats originally offered
        (r.seats_available + IFNULL(SUM(b.seats_booked), 0)) AS totalSeats,

        -- seats booked by passengers
        IFNULL(SUM(b.seats_booked), 0) AS seatsBooked

      FROM offered_rides r
      LEFT JOIN bookings b ON b.ride_id = r.id
      WHERE r.user_id = ?
      GROUP BY r.id
      ORDER BY r.ride_date DESC, r.ride_time DESC
      `,
      [userId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("getRidesByDriver error:", err);
    return res.status(500).json({ message: "Error fetching driver rides" });
  }
};


exports.cancelRide = async (req, res) => {
  const { rideId } = req.params;
  const { userId } = req.body;

  if (!rideId || !userId) {
    return res.status(400).json({ message: "rideId and userId are required" });
  }

  try {
    // verify ownership
    const [rides] = await db.query(
      "SELECT id FROM offered_rides WHERE id = ? AND user_id = ?",
      [rideId, userId]
    );

    if (rides.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // mark ride cancelled
    await db.query(
      "UPDATE offered_rides SET status = 'CANCELLED' WHERE id = ?",
      [rideId]
    );

    return res.json({ message: "Ride cancelled ✅" });
  } catch (err) {
    console.error("cancelRide error:", err);
    return res.status(500).json({ message: "Error cancelling ride" });
  }
};


// =============================
// 6) DRIVER EARNINGS SUMMARY
// GET /api/rides/driver-earnings/:userId
// =============================
exports.getDriverEarnings = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT
        COUNT(DISTINCT r.id) AS totalRides,
        IFNULL(SUM(b.seats_booked), 0) AS totalSeatsBooked,
        IFNULL(SUM(b.seats_booked * r.price_per_seat), 0) AS totalEarnings
      FROM offered_rides r
      LEFT JOIN bookings b ON b.ride_id = r.id
      WHERE r.user_id = ?
        AND r.status != 'CANCELLED'
      `,
      [userId]
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error("driver earnings error:", err);
    return res
      .status(500)
      .json({ message: "Error fetching driver earnings" });
  }
};


// =============================
// 7) PASSENGERS FOR A RIDE
// GET /api/rides/:rideId/passengers
// =============================
exports.getPassengersForRide = async (req, res) => {
  const { rideId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        b.seats_booked,
        b.booked_at
      FROM bookings b
      JOIN users u ON b.passenger_id = u.id
      WHERE b.ride_id = ?
      `,
      [rideId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("passenger list error:", err);
    return res
      .status(500)
      .json({ message: "Error fetching passengers" });
  }
};
