const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:userId/stats", userController.getUserStats);
router.put("/:userId", userController.updateProfile);


module.exports = router;
