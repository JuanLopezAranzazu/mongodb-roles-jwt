const { hash } = require("argon2");
// models
const User = require("./../models/User");
const Role = require("./../models/Role");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, email, password, roles } = req.body;

    const passwordHash = await hash(password);

    // creating a new User
    const user = new User({
      username,
      email,
      password: passwordHash,
    });

    // save roles
    if (roles) {
      const rolesFound = await Role.find({ name: { $in: roles } });
      user.roles = rolesFound.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      user.roles = [role._id];
    }

    // saving the new user
    const userSaved = await user.save();
    return res.status(201).json({ data: userSaved });
  } catch (error) {
    next(error);
  }
};

const followUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    console.log("AUTHENTICATED", req.user);

    const userFound = await User.findById(userId);
    if (!userFound) {
      throw new Error("User followed not found");
    }

    // save in followedes
    const userUpdatedAuth = await User.findByIdAndUpdate(req.user.id, {
      $push: { followedes: userFound._id },
    });
    if (!userUpdatedAuth) {
      throw new Error("Could not save user in followed");
    }

    // save in followers
    const userUpdate = await User.findByIdAndUpdate(userId, {
      $push: { followers: req.user.id },
    });
    if (!userUpdate) {
      throw new Error("Could not save user in follower");
    }

    return res.status(200).json({ data: "Follow user successfully" });
  } catch (error) {
    next(error);
  }
};

const rejectUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    console.log("AUTHENTICATED", req.user);

    const userFound = await User.findById(userId);
    if (!userFound) {
      throw new Error("User followed not found");
    }

    // delete in followedes
    const userUpdatedAuth = await User.findByIdAndUpdate(req.user.id, {
      $pull: { followedes: userFound._id },
    });
    if (!userUpdatedAuth) {
      throw new Error("Could not delete user in followed");
    }

    // save in followers
    const userUpdate = await User.findByIdAndUpdate(userId, {
      $pull: { followers: req.user.id },
    });
    if (!userUpdate) {
      throw new Error("Could not delete user in follower");
    }

    return res.status(200).json({ data: "Reject user successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getAllUsers, followUser, rejectUser };
