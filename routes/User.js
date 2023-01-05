const express = require("express");
const router = express.Router();
// controller
const {
  createUser,
  getAllUsers,
  followUser,
  rejectUser,
} = require("./../controllers/User");
// middlewares
const { verifyToken } = require("./../middlewares/authenticated");
const { checkRoles } = require("./../middlewares/check");

router.get("/", getAllUsers);
router.post("/", verifyToken, checkRoles("admin"), createUser);
router.post("/follow", verifyToken, followUser);
router.delete("/reject", verifyToken, rejectUser);

module.exports = router;
