// models
const Blog = require("../models/Blog");
const Comment = require("./../models/Comment");

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({});
    return res.status(200).json({ data: comments });
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { text, blogId } = req.body;
    console.log("AUTHENTICATED", req.user);

    const blogFound = await Blog.findById(blogId);
    if (!blogFound) {
      throw new Error("Blog not found");
    }

    const comment = new Comment({
      text,
      user: req.user.id,
      blog: blogFound._id,
    });
    const commentSaved = await comment.save();

    // save in blogs comments
    await Blog.findByIdAndUpdate(blogFound._id, {
      $push: { comments: comment._id },
    });

    return res.status(201).json({ data: commentSaved });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    console.log("AUTHENTICATED", req.user);

    const commentFound = await Comment.findById(id);
    if (!commentFound) {
      throw new Error("Comment not found");
    }

    const commentUpdated = await Comment.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { text },
      { new: true }
    );
    if (!commentUpdated) {
      throw new Error("You do not have permission");
    }

    return res.status(200).json({ data: commentUpdated });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("AUTHENTICATED", req.user);

    const commentFound = await Comment.findById(id);
    if (!commentFound) {
      throw new Error("Comment not found");
    }

    const commentDeleted = await Comment.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!commentDeleted) {
      throw new Error("You do not have permission");
    }

    // delete in blogs comments
    await Blog.findByIdAndUpdate(commentFound.blog, {
      $pull: { comments: commentFound._id },
    });

    return res.status(204).json({ data: commentFound });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
};
