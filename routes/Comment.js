const express = require("express");
const router = express.Router();
// controller
const {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} = require("./../controllers/Comment");
// middlewares
const { verifyToken } = require("./../middlewares/authenticated");

router.get("/", getAllComments);
router.post("/", verifyToken, createComment);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;
