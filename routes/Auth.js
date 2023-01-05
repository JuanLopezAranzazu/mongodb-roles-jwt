const express = require("express");
const router = express.Router();
// controller
const { loginUser, registerUser } = require("./../controllers/Auth");

router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
