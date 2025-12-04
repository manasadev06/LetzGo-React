const db = require("../db");

// GET /api/users/:userId/stats
exports.getUserStats = async (req, res) => {
  const { userId } = req.params;

  try {
    const [[booked]] = await db.query(
      `SELECT COUNT(*) AS ridesBooked
       FROM bookings
       WHERE passenger_id = ?`,
      [userId]
    );

    const [[offered]] = await db.query(
      `SELECT COUNT(*) AS ridesOffered
       FROM offered_rides
       WHERE user_id = ?`,
      [userId]
    );

    res.json({
      ridesBooked: booked.ridesBooked,
      ridesOffered: offered.ridesOffered,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};

// PUT /api/users/:userId
exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    await db.query(
      "UPDATE users SET name = ? WHERE id = ?",
      [name, userId]
    );

    res.json({ message: "Profile updated", name });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

