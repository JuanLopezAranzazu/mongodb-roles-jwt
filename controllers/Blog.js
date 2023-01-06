// models
const Blog = require("./../models/Blog");
const Comment = require("./../models/Comment");

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    return res.status(200).json({ data: blogs });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    console.log("AUTHENTICATED", req.user);

    const blog = new Blog({ title, body, user: req.user.id });
    const blogSaved = await blog.save();

    return res.status(201).json({ data: blogSaved });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const { id } = req.params;
    console.log("AUTHENTICATED", req.user);

    const blogFound = await Blog.findById(id);
    if (!blogFound) {
      throw new Error("Blog not found");
    }

    const blogUpdated = await Blog.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, body },
      { new: true }
    );
    if (!blogUpdated) {
      throw new Error("You do not have permission");
    }

    return res.status(200).json({ data: blogUpdated });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("AUTHENTICATED", req.user);

    const blogFound = await Blog.findById(id);
    if (!blogFound) {
      throw new Error("Blog not found");
    }

    const blogDeleted = await Blog.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!blogDeleted) {
      throw new Error("You do not have permission");
    }

    // delete comments
    Comment.deleteMany({ _id: { $in: blogFound.comments } }, (err, result) => {
      if (err) {
        console.error(err);
      }
      console.log(`Deleted ${result.deletedCount} documents`);
    });

    return res.status(204).json({ data: blogFound });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBlog, getAllBlogs, updateBlog, deleteBlog };
