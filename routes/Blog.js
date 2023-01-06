const express = require("express");
const router = express.Router();
// controller
const {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("./../controllers/Blog");
// middlewares
const { verifyToken } = require("./../middlewares/authenticated");

router.get("/", getAllBlogs);
router.post("/", verifyToken, createBlog);
router.put("/:id", verifyToken, updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

module.exports = router;
