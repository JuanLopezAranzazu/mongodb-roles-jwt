const jwt = require("jsonwebtoken");
const { hash, verify } = require("argon2");
// models
const User = require("./../models/User");
const Role = require("./../models/Role");
// config
const { config } = require("./../config");

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, roles } = req.body;

    const passwordHash = await hash(password);

    // creating a new User
    const user = new User({
      username,
      email,
      password: passwordHash,
    });

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

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const userFound = await User.findOne({ username });
    if (!userFound) {
      throw new Error("User not found");
    }

    const passwordCorrect = await verify(userFound.password, password);
    if (!passwordCorrect) {
      throw new Error("Incorrect password");
    }

    // create token
    const token = await jwt.sign(
      { id: userFound._id, username: userFound.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ data: token });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };
