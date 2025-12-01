const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Book a ride
router.post("/rides/:rideId/book", bookingController.bookRide);

module.exports = router;
